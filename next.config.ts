import type { NextConfig } from "next";

// Static export: `next build` emits a plain HTML/CSS/JS site into `out/`.
// This is the portability guarantee from docs/BRIEF.md — the site can be
// served by any static host, not just Vercel. If v2 ever needs serverless
// features, delete `output: "export"` and the same repo becomes a normal
// Next.js app.
const nextConfig: NextConfig = {
  output: "export",
  // Vercel's on-demand image optimizer is a server feature; with static
  // export we serve images as-is (they are few and pre-sized anyway).
  images: { unoptimized: true },
};

export default nextConfig;
