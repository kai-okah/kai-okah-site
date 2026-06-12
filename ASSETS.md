# Assets

Policy: **everything in the office is procedural** — geometry built from
three.js primitives in code (`src/office/`), materials are flat colors
from one palette (`src/office/palette.ts`), and every sound is
synthesized at runtime with the Web Audio API (`src/office/audio/sound.ts`).

Why, and not CC0 model packs:

1. **License clarity.** There is nothing to attribute and nothing to
   audit — no downloaded model, texture, HDRI or sound file exists in
   this repo. This file stays this short on purpose.
2. **Coherence.** Mixed third-party assets are the fastest way to make a
   scene look like a flea market (risk #2 in `docs/BRIEF.md`). One
   palette + simple geometry + real-time lighting keeps the room reading
   as one room.
3. **Payload.** The entire office ships as code. No multi-megabyte GLB
   downloads; the heaviest thing on the page is three.js itself.

## Swapping in real models later

Each piece of furniture is its own component
(`src/office/furniture/*.tsx`) that owns its hotspot. Replacing the
procedural desk with a CC0 GLB (e.g. from Poly Haven) means changing the
meshes inside that one component — the interaction layer (hotspots, camera
poses, store) doesn't change. If that day comes, list every imported
asset here with: name, source URL, author, license, and the date checked.

## Existing media

| File | What | Source |
|---|---|---|
| `public/photo.jpg` | Kai's portrait (hero on /plain, pinned on the corkboard) | provided by Kai, 2026-06-11 |
| `public/certificates/` *(empty yet)* | certificate scans for the dossier | Kai provides; see `src/data/certificates.ts` |
| `public/corkboard/` *(empty yet)* | photo-wall pictures | Kai provides; see `src/data/corkboard.ts` |
