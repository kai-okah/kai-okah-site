// A self-contained QR code encoder — no library, on purpose (the same
// spirit as Anders Brownworth's hand-rolled tools, BRIEF V4). Byte mode,
// error-correction level M, versions 1–10 (up to ~213 bytes of UTF-8),
// automatic mask selection per ISO/IEC 18004. Returns the module matrix;
// drawing it is the caller's job.
//
// The implementation follows the spec's pipeline directly:
//   bits → codewords → Reed-Solomon blocks → interleave → matrix → mask.

// --- GF(256) arithmetic (polynomial 0x11D), for Reed-Solomon ----------

const EXP = new Uint8Array(512);
const LOG = new Uint8Array(256);
{
  let x = 1;
  for (let i = 0; i < 255; i++) {
    EXP[i] = x;
    LOG[x] = i;
    x <<= 1;
    if (x & 0x100) x ^= 0x11d;
  }
  for (let i = 255; i < 512; i++) EXP[i] = EXP[i - 255];
}

function gfMul(a: number, b: number): number {
  return a === 0 || b === 0 ? 0 : EXP[LOG[a] + LOG[b]];
}

/** Reed-Solomon generator polynomial of the given degree. */
function rsGenerator(degree: number): Uint8Array {
  // Built lowest-degree-first (poly[j] = coefficient of x^j)…
  let poly = new Uint8Array([1]);
  for (let i = 0; i < degree; i++) {
    const next = new Uint8Array(poly.length + 1);
    for (let j = 0; j < poly.length; j++) {
      next[j] ^= gfMul(poly[j], EXP[i]);
      next[j + 1] ^= poly[j];
    }
    poly = next;
  }
  // …but rsRemainder's synthetic division reads it highest-first.
  return poly.reverse();
}

/** Remainder of data ÷ generator — the EC codewords for one block. */
function rsRemainder(data: Uint8Array, generator: Uint8Array): Uint8Array {
  const result = new Uint8Array(generator.length - 1);
  for (const byte of data) {
    const factor = byte ^ result[0];
    result.copyWithin(0, 1);
    result[result.length - 1] = 0;
    for (let i = 0; i < result.length; i++) {
      result[i] ^= gfMul(generator[i + 1], factor);
    }
  }
  return result;
}

// --- Version tables (EC level M only) ---------------------------------

// [eccPerBlock, numBlocks, totalCodewords] for versions 1..10.
const TABLE: [number, number, number][] = [
  [10, 1, 26],
  [16, 1, 44],
  [26, 1, 70],
  [18, 2, 100],
  [24, 2, 134],
  [16, 4, 172],
  [18, 4, 196],
  [22, 4, 242],
  [22, 5, 292],
  [26, 5, 346],
];

const ALIGNMENT: Record<number, number[]> = {
  2: [6, 18],
  3: [6, 22],
  4: [6, 26],
  5: [6, 30],
  6: [6, 34],
  7: [6, 22, 38],
  8: [6, 24, 42],
  9: [6, 26, 46],
  10: [6, 28, 50],
};

function dataCodewords(version: number): number {
  const [ecc, blocks, total] = TABLE[version - 1];
  return total - ecc * blocks;
}

// --- Bit assembly ------------------------------------------------------

class BitBuffer {
  bits: number[] = [];
  push(value: number, length: number) {
    for (let i = length - 1; i >= 0; i--) this.bits.push((value >> i) & 1);
  }
}

function buildCodewords(bytes: Uint8Array, version: number): Uint8Array {
  const capacity = dataCodewords(version) * 8;
  const buf = new BitBuffer();
  buf.push(0b0100, 4); // byte mode
  buf.push(bytes.length, version < 10 ? 8 : 16);
  for (const b of bytes) buf.push(b, 8);
  // Terminator, byte alignment, then the spec's alternating pad bytes.
  buf.push(0, Math.min(4, capacity - buf.bits.length));
  while (buf.bits.length % 8 !== 0) buf.bits.push(0);
  for (let pad = 0xec; buf.bits.length < capacity; pad ^= 0xec ^ 0x11) {
    buf.push(pad, 8);
  }
  const data = new Uint8Array(capacity / 8);
  for (let i = 0; i < buf.bits.length; i++) {
    data[i >> 3] |= buf.bits[i] << (7 - (i & 7));
  }
  return data;
}

/** Split into RS blocks, append EC, interleave — transmission order. */
function interleave(data: Uint8Array, version: number): Uint8Array {
  const [eccLen, numBlocks, totalLen] = TABLE[version - 1];
  const numShort = numBlocks - (totalLen % numBlocks);
  const shortLen = Math.floor(totalLen / numBlocks) - eccLen; // data bytes
  const generator = rsGenerator(eccLen);

  const blocks: Uint8Array[] = [];
  const eccs: Uint8Array[] = [];
  let offset = 0;
  for (let i = 0; i < numBlocks; i++) {
    const len = shortLen + (i < numShort ? 0 : 1);
    const block = data.slice(offset, offset + len);
    offset += len;
    blocks.push(block);
    eccs.push(rsRemainder(block, generator));
  }

  const out = new Uint8Array(totalLen);
  let k = 0;
  const maxLen = shortLen + 1;
  for (let i = 0; i < maxLen; i++) {
    for (const block of blocks) if (i < block.length) out[k++] = block[i];
  }
  for (let i = 0; i < eccLen; i++) {
    for (const ecc of eccs) out[k++] = ecc[i];
  }
  return out;
}

// --- Matrix ------------------------------------------------------------

type Matrix = { size: number; modules: boolean[][]; isFunction: boolean[][] };

function setFunction(m: Matrix, x: number, y: number, dark: boolean) {
  m.modules[y][x] = dark;
  m.isFunction[y][x] = true;
}

function drawFinder(m: Matrix, cx: number, cy: number) {
  for (let dy = -4; dy <= 4; dy++) {
    for (let dx = -4; dx <= 4; dx++) {
      const x = cx + dx;
      const y = cy + dy;
      if (x < 0 || y < 0 || x >= m.size || y >= m.size) continue;
      const dist = Math.max(Math.abs(dx), Math.abs(dy));
      setFunction(m, x, y, dist !== 2 && dist !== 4);
    }
  }
}

function drawFormatBits(m: Matrix, mask: number) {
  // EC level M has format indicator 0.
  const data = (0 << 3) | mask;
  let rem = data;
  for (let i = 0; i < 10; i++) rem = (rem << 1) ^ ((rem >> 9) * 0x537);
  const bits = ((data << 10) | rem) ^ 0x5412;
  const bit = (i: number) => ((bits >> i) & 1) !== 0;

  for (let i = 0; i <= 5; i++) setFunction(m, 8, i, bit(i));
  setFunction(m, 8, 7, bit(6));
  setFunction(m, 8, 8, bit(7));
  setFunction(m, 7, 8, bit(8));
  for (let i = 9; i < 15; i++) setFunction(m, 14 - i, 8, bit(i));
  for (let i = 0; i < 8; i++) setFunction(m, m.size - 1 - i, 8, bit(i));
  for (let i = 8; i < 15; i++) setFunction(m, 8, m.size - 15 + i, bit(i));
  setFunction(m, 8, m.size - 8, true); // the dark module
}

function buildMatrix(version: number): Matrix {
  const size = version * 4 + 17;
  const m: Matrix = {
    size,
    modules: Array.from({ length: size }, () => Array(size).fill(false)),
    isFunction: Array.from({ length: size }, () => Array(size).fill(false)),
  };

  // Timing patterns
  for (let i = 0; i < size; i++) {
    setFunction(m, 6, i, i % 2 === 0);
    setFunction(m, i, 6, i % 2 === 0);
  }
  // Finders (with separators via the dist-4 ring)
  drawFinder(m, 3, 3);
  drawFinder(m, size - 4, 3);
  drawFinder(m, 3, size - 4);
  // Alignment patterns — skip the three corners covered by finders
  const align = ALIGNMENT[version] ?? [];
  for (const cy of align) {
    for (const cx of align) {
      const inFinder =
        (cx <= 8 && cy <= 8) ||
        (cx >= size - 9 && cy <= 8) ||
        (cx <= 8 && cy >= size - 9);
      if (inFinder) continue;
      for (let dy = -2; dy <= 2; dy++) {
        for (let dx = -2; dx <= 2; dx++) {
          setFunction(m, cx + dx, cy + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1);
        }
      }
    }
  }
  // Reserve the format areas so codeword placement skips them
  drawFormatBits(m, 0);
  // Version info (only versions ≥ 7)
  if (version >= 7) {
    let rem = version;
    for (let i = 0; i < 12; i++) rem = (rem << 1) ^ ((rem >> 11) * 0x1f25);
    const bits = (version << 12) | rem;
    for (let i = 0; i < 18; i++) {
      const dark = ((bits >> i) & 1) !== 0;
      const a = size - 11 + (i % 3);
      const b = Math.floor(i / 3);
      setFunction(m, a, b, dark);
      setFunction(m, b, a, dark);
    }
  }
  return m;
}

function placeCodewords(m: Matrix, data: Uint8Array) {
  let i = 0;
  for (let right = m.size - 1; right >= 1; right -= 2) {
    if (right === 6) right = 5;
    for (let vert = 0; vert < m.size; vert++) {
      for (let j = 0; j < 2; j++) {
        const x = right - j;
        const upward = ((right + 1) & 2) === 0;
        const y = upward ? m.size - 1 - vert : vert;
        if (!m.isFunction[y][x] && i < data.length * 8) {
          m.modules[y][x] = ((data[i >> 3] >> (7 - (i & 7))) & 1) !== 0;
          i++;
        }
      }
    }
  }
}

function maskBit(mask: number, x: number, y: number): boolean {
  switch (mask) {
    case 0: return (x + y) % 2 === 0;
    case 1: return y % 2 === 0;
    case 2: return x % 3 === 0;
    case 3: return (x + y) % 3 === 0;
    case 4: return (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0;
    case 5: return ((x * y) % 2) + ((x * y) % 3) === 0;
    case 6: return (((x * y) % 2) + ((x * y) % 3)) % 2 === 0;
    default: return (((x + y) % 2) + ((x * y) % 3)) % 2 === 0;
  }
}

function applyMask(m: Matrix, mask: number) {
  for (let y = 0; y < m.size; y++) {
    for (let x = 0; x < m.size; x++) {
      if (!m.isFunction[y][x] && maskBit(mask, x, y)) {
        m.modules[y][x] = !m.modules[y][x];
      }
    }
  }
}

/** The spec's four penalty rules — lower is better. */
function penalty(m: Matrix): number {
  const { size, modules } = m;
  let score = 0;

  // Rule 1: runs of ≥5 same-colored modules, rows and columns.
  for (let axis = 0; axis < 2; axis++) {
    for (let a = 0; a < size; a++) {
      let run = 1;
      for (let b = 1; b < size; b++) {
        const cur = axis === 0 ? modules[a][b] : modules[b][a];
        const prev = axis === 0 ? modules[a][b - 1] : modules[b - 1][a];
        if (cur === prev) {
          run++;
          if (b === size - 1 && run >= 5) score += run - 2;
        } else {
          if (run >= 5) score += run - 2;
          run = 1;
        }
      }
    }
  }
  // Rule 2: 2×2 blocks of one color.
  for (let y = 0; y < size - 1; y++) {
    for (let x = 0; x < size - 1; x++) {
      const c = modules[y][x];
      if (c === modules[y][x + 1] && c === modules[y + 1][x] && c === modules[y + 1][x + 1]) {
        score += 3;
      }
    }
  }
  // Rule 3: finder-like 1011101 patterns with 4 light modules either side.
  const FINDER = 0b1011101;
  for (let axis = 0; axis < 2; axis++) {
    for (let a = 0; a < size; a++) {
      let bitsHistory = 0;
      for (let b = 0; b < size; b++) {
        const dark = axis === 0 ? modules[a][b] : modules[b][a];
        bitsHistory = ((bitsHistory << 1) | (dark ? 1 : 0)) & 0x7ff;
        if (b >= 10) {
          if (bitsHistory === FINDER << 4 || bitsHistory === FINDER) score += 40;
        }
      }
    }
  }
  // Rule 4: dark/light balance.
  let dark = 0;
  for (const row of modules) for (const d of row) if (d) dark++;
  const percent = (dark * 100) / (size * size);
  score += Math.floor(Math.abs(percent - 50) / 5) * 10;
  return score;
}

// --- Public API ---------------------------------------------------------

/**
 * Encode text as a QR matrix (true = dark module), or null if the text
 * doesn't fit in version 10 at EC level M (~213 bytes of UTF-8).
 */
export function makeQR(text: string): boolean[][] | null {
  const bytes = new TextEncoder().encode(text);
  let version = 0;
  for (let v = 1; v <= 10; v++) {
    const headerBits = 4 + (v < 10 ? 8 : 16);
    if (bytes.length * 8 + headerBits <= dataCodewords(v) * 8) {
      version = v;
      break;
    }
  }
  if (version === 0) return null;

  const codewords = interleave(buildCodewords(bytes, version), version);
  const matrix = buildMatrix(version);
  placeCodewords(matrix, codewords);

  // Try all 8 masks, keep the one the spec scores best.
  let bestMask = 0;
  let bestScore = Infinity;
  for (let mask = 0; mask < 8; mask++) {
    applyMask(matrix, mask);
    drawFormatBits(matrix, mask);
    const score = penalty(matrix);
    if (score < bestScore) {
      bestScore = score;
      bestMask = mask;
    }
    applyMask(matrix, mask); // XOR is its own inverse — unmask
  }
  applyMask(matrix, bestMask);
  drawFormatBits(matrix, bestMask);

  return matrix.modules;
}
