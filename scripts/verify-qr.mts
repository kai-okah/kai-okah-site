// Independent verification of src/office/lib/qr.ts: render the matrix to
// RGBA pixels and decode with jsQR (a separate, third-party decoder).
// jsQR is NOT a project dependency — install it just for this check:
//
//   npm i --no-save jsqr
//   node --experimental-strip-types scripts/verify-qr.mts
import jsQR from "jsqr";
import { makeQR } from "../src/office/lib/qr.ts";

const cases = [
  "https://kai-okah-site.vercel.app",
  "Kai Okah",
  "x",
  "Hello, world! 1234567890",
  "ümläutß and € symbols — UTF-8 test",
  "A".repeat(60), // forces a multi-block version
  "B".repeat(120), // version ~7+, version-info path
  "C".repeat(200), // version 10, 16-bit length field
  JSON.stringify({ mailto: "okahkaiatchem@gmail.com", site: "/plain" }),
];

let failures = 0;
for (const text of cases) {
  const matrix = makeQR(text);
  if (!matrix) {
    console.log(`ENCODE FAIL (null): ${JSON.stringify(text.slice(0, 30))}`);
    failures++;
    continue;
  }
  const scale = 4;
  const quiet = 4 * scale;
  const size = matrix.length * scale + quiet * 2;
  const data = new Uint8ClampedArray(size * size * 4).fill(255);
  matrix.forEach((row, y) =>
    row.forEach((dark, x) => {
      if (!dark) return;
      for (let dy = 0; dy < scale; dy++) {
        for (let dx = 0; dx < scale; dx++) {
          const px = (size * (quiet + y * scale + dy) + quiet + x * scale + dx) * 4;
          data[px] = data[px + 1] = data[px + 2] = 0;
        }
      }
    })
  );
  const result = jsQR(data, size, size);
  const ok = result && result.data === text;
  console.log(
    `${ok ? "OK  " : "FAIL"} v${(matrix.length - 17) / 4} len=${text.length} ${JSON.stringify(text.slice(0, 30))}${result && !ok ? ` → got ${JSON.stringify(result.data.slice(0, 30))}` : result ? "" : " → no decode"}`
  );
  if (!ok) failures++;
}
process.exit(failures ? 1 : 0);
