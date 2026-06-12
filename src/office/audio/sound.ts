// All sound is synthesized with the Web Audio API — no audio files, no
// audio library. (The build environment can't fetch CC0 sound packs, and
// a library that only plays files we don't have would be dead weight —
// see ASSETS.md.) Each effect is a tiny recipe: a noise burst or
// oscillator shaped by an envelope and a filter.

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let rainNode: { source: AudioBufferSourceNode; gain: GainNode } | null = null;

/** Must be called from a user gesture (the START click) — autoplay rules. */
export function unlockAudio() {
  if (ctx) return;
  try {
    ctx = new AudioContext();
    master = ctx.createGain();
    master.gain.value = 0.5;
    master.connect(ctx.destination);
  } catch {
    ctx = null; // no audio support — every effect below becomes a no-op
  }
}

function noiseBuffer(seconds: number): AudioBuffer {
  const c = ctx!;
  const buf = c.createBuffer(1, Math.ceil(c.sampleRate * seconds), c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  return buf;
}

/** Short filtered noise burst — the building block of most "clack" sounds. */
function burst(opts: {
  duration: number;
  frequency: number;
  q?: number;
  gain?: number;
}) {
  if (!ctx || !master) return;
  const src = ctx.createBufferSource();
  src.buffer = noiseBuffer(opts.duration);
  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = opts.frequency;
  filter.Q.value = opts.q ?? 1;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(opts.gain ?? 0.5, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + opts.duration);
  src.connect(filter).connect(gain).connect(master);
  src.start();
}

/** Typewriter tick for the entry screen. */
export function typewriterTick() {
  burst({ duration: 0.04, frequency: 2400, q: 2, gain: 0.18 });
}

/** Generic UI / object click. */
export function click() {
  burst({ duration: 0.05, frequency: 1400, q: 3, gain: 0.3 });
}

/** Keyboard clack inside KO/OS — slightly random so typing sounds alive. */
export function keyClack() {
  burst({
    duration: 0.045,
    frequency: 900 + Math.random() * 600,
    q: 2,
    gain: 0.22,
  });
}

/** Page flip in the certificate dossier: a soft noise sweep. */
export function pageFlip() {
  if (!ctx || !master) return;
  const src = ctx.createBufferSource();
  src.buffer = noiseBuffer(0.18);
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(600, ctx.currentTime);
  filter.frequency.exponentialRampToValueAtTime(4000, ctx.currentTime + 0.12);
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.25, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
  src.connect(filter).connect(gain).connect(master);
  src.start();
}

/** The "you found something" ding: two soft sine partials. */
export function ding() {
  if (!ctx || !master) return;
  for (const [freq, vol] of [
    [1318.5, 0.2],
    [2637, 0.07],
  ] as const) {
    const osc = ctx.createOscillator();
    osc.frequency.value = freq;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.9);
    osc.connect(gain).connect(master);
    osc.start();
    osc.stop(ctx.currentTime + 0.9);
  }
}

/** Coffee machine brewing: a few seconds of gurgling lowpassed noise. */
export function brew(seconds = 3) {
  if (!ctx || !master) return;
  const src = ctx.createBufferSource();
  src.buffer = noiseBuffer(seconds);
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 350;
  // Wobble the cutoff so it gurgles instead of hissing.
  const lfo = ctx.createOscillator();
  lfo.frequency.value = 7;
  const lfoGain = ctx.createGain();
  lfoGain.gain.value = 180;
  lfo.connect(lfoGain).connect(filter.frequency);
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.4);
  gain.gain.setValueAtTime(0.3, ctx.currentTime + seconds - 0.5);
  gain.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + seconds);
  src.connect(filter).connect(gain).connect(master);
  lfo.start();
  src.start();
  src.stop(ctx.currentTime + seconds);
  lfo.stop(ctx.currentTime + seconds);
}

/** Rain on the window — a quiet endless loop of highpassed noise (V10). */
export function startRain() {
  if (!ctx || !master || rainNode) return;
  const src = ctx.createBufferSource();
  src.buffer = noiseBuffer(2);
  src.loop = true;
  const filter = ctx.createBiquadFilter();
  filter.type = "highpass";
  filter.frequency.value = 1200;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0.045, ctx.currentTime + 2);
  src.connect(filter).connect(gain).connect(master);
  src.start();
  rainNode = { source: src, gain };
}
