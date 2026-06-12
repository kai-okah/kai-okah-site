"use client";

import * as THREE from "three";

// Procedural surface textures, painted once onto canvases at runtime.
// The asset CDNs are unreachable from the build environment (ASSETS.md),
// but flat colors are what made the room look like a diagram — a wood
// grain, a cork speckle and a plaster noise are 90% of "this is a real
// material" and cost a few kilobytes of code instead of megabytes of
// downloads. Everything is seeded, so the office always looks the same.

function makeRng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
}

const cache = new Map<string, THREE.CanvasTexture>();

function canvasTexture(
  key: string,
  size: number,
  repeat: [number, number],
  paint: (g: CanvasRenderingContext2D, size: number, rnd: () => number) => void
): THREE.CanvasTexture {
  const cached = cache.get(key);
  if (cached) return cached;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const g = canvas.getContext("2d")!;
  paint(g, size, makeRng(1234567 + key.length * 7919));
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(...repeat);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  cache.set(key, tex);
  return tex;
}

/** Plank wood: base tone striped with grain lines and plank seams. */
export function woodTexture(
  key: string,
  base: string,
  dark: string,
  repeat: [number, number],
  planks = 6
): THREE.CanvasTexture {
  return canvasTexture(key, 512, repeat, (g, size, rnd) => {
    g.fillStyle = base;
    g.fillRect(0, 0, size, size);
    const plankW = size / planks;
    for (let p = 0; p < planks; p++) {
      // Each plank gets its own slight tint
      g.fillStyle = `rgba(0,0,0,${0.02 + rnd() * 0.07})`;
      g.fillRect(p * plankW, 0, plankW, size);
      // Grain: long wavy strokes
      for (let i = 0; i < 26; i++) {
        const x0 = p * plankW + rnd() * plankW;
        g.strokeStyle = `rgba(${rnd() > 0.5 ? "40,24,10" : "90,60,30"},${0.05 + rnd() * 0.1})`;
        g.lineWidth = 0.6 + rnd() * 1.4;
        g.beginPath();
        g.moveTo(x0, -10);
        for (let y = 0; y <= size; y += 32) {
          g.lineTo(x0 + Math.sin(y * 0.02 + rnd() * 6) * 3.5, y);
        }
        g.stroke();
      }
      // Plank seam
      g.fillStyle = "rgba(0,0,0,0.32)";
      g.fillRect(p * plankW - 1, 0, 2, size);
    }
    g.fillStyle = dark;
    g.globalAlpha = 0.06;
    g.fillRect(0, 0, size, size);
    g.globalAlpha = 1;
  });
}

/** Cork: warm base packed with light/dark speckles. */
export function corkTexture(repeat: [number, number]): THREE.CanvasTexture {
  return canvasTexture("cork", 512, repeat, (g, size, rnd) => {
    g.fillStyle = "#b08d5e";
    g.fillRect(0, 0, size, size);
    for (let i = 0; i < 5200; i++) {
      const r = 0.6 + rnd() * 2.6;
      const tone = rnd();
      g.fillStyle =
        tone < 0.45
          ? `rgba(60,40,20,${0.1 + rnd() * 0.22})`
          : tone < 0.8
            ? `rgba(150,115,70,${0.12 + rnd() * 0.2})`
            : `rgba(225,195,150,${0.1 + rnd() * 0.18})`;
      g.beginPath();
      g.ellipse(rnd() * size, rnd() * size, r, r * (0.5 + rnd() * 0.5), rnd() * 3.2, 0, Math.PI * 2);
      g.fill();
    }
  });
}

/** Plaster / paint: barely-there blotches so walls stop being vector-flat. */
export function plasterTexture(key: string, base: string, repeat: [number, number]): THREE.CanvasTexture {
  return canvasTexture(key, 256, repeat, (g, size, rnd) => {
    g.fillStyle = base;
    g.fillRect(0, 0, size, size);
    for (let i = 0; i < 1400; i++) {
      g.fillStyle = rnd() > 0.5 ? `rgba(255,255,255,${rnd() * 0.018})` : `rgba(0,0,0,${rnd() * 0.018})`;
      const r = 1 + rnd() * 6;
      g.beginPath();
      g.arc(rnd() * size, rnd() * size, r, 0, Math.PI * 2);
      g.fill();
    }
  });
}

/** Rug fabric: a fine two-direction weave. */
export function fabricTexture(repeat: [number, number]): THREE.CanvasTexture {
  return canvasTexture("fabric", 256, repeat, (g, size, rnd) => {
    g.fillStyle = "#3a3631";
    g.fillRect(0, 0, size, size);
    for (let y = 0; y < size; y += 3) {
      g.fillStyle = `rgba(255,255,255,${0.02 + rnd() * 0.045})`;
      g.fillRect(0, y, size, 1);
    }
    for (let x = 0; x < size; x += 3) {
      g.fillStyle = `rgba(0,0,0,${0.04 + rnd() * 0.06})`;
      g.fillRect(x, 0, 1, size);
    }
    for (let i = 0; i < 320; i++) {
      g.fillStyle = `rgba(190,180,160,${rnd() * 0.07})`;
      g.fillRect(rnd() * size, rnd() * size, 1.5, 1.5);
    }
  });
}

/** Paper: faint fibers for pinned notes and dossier sheets. */
export function paperTexture(repeat: [number, number]): THREE.CanvasTexture {
  return canvasTexture("paper", 256, repeat, (g, size, rnd) => {
    g.fillStyle = "#f2ede2";
    g.fillRect(0, 0, size, size);
    for (let i = 0; i < 700; i++) {
      g.strokeStyle = `rgba(120,105,80,${rnd() * 0.05})`;
      g.lineWidth = 0.5;
      const x = rnd() * size;
      const y = rnd() * size;
      g.beginPath();
      g.moveTo(x, y);
      g.lineTo(x + (rnd() - 0.5) * 9, y + (rnd() - 0.5) * 9);
      g.stroke();
    }
  });
}
