// Cubic-bezier easing, the same curve family CSS transitions use — and
// the same one Henry Heffernan's camera rides (0.13, 0.99, 0, 1: launch
// fast, land like a feather). Hand-rolled so the camera doesn't cost a
// tween library.

export type Easing = (t: number) => number;

export function cubicBezier(x1: number, y1: number, x2: number, y2: number): Easing {
  // Solve x(u) = t for u with a few Newton iterations, then return y(u).
  const ax = 3 * x1 - 3 * x2 + 1;
  const bx = 3 * x2 - 6 * x1;
  const cx = 3 * x1;
  const ay = 3 * y1 - 3 * y2 + 1;
  const by = 3 * y2 - 6 * y1;
  const cy = 3 * y1;
  const xAt = (u: number) => ((ax * u + bx) * u + cx) * u;
  const dxAt = (u: number) => (3 * ax * u + 2 * bx) * u + cx;
  const yAt = (u: number) => ((ay * u + by) * u + cy) * u;

  return (t: number) => {
    if (t <= 0) return 0;
    if (t >= 1) return 1;
    let u = t;
    for (let i = 0; i < 5; i++) {
      const slope = dxAt(u);
      if (Math.abs(slope) < 1e-6) break;
      u -= (xAt(u) - t) / slope;
    }
    return yAt(Math.min(1, Math.max(0, u)));
  };
}

/** The flight curve: launches immediately, decelerates long and soft. */
export const flightEase = cubicBezier(0.13, 0.99, 0, 1);
