# kai-okah-site

Personal portfolio site of **Kai Okah** (Atchem-Kezih Kai Ndzoh Okah) — software engineering student at UDE Essen.

**Status:** v2 ("A Completely Normal Office") in beta. v1 lives on at [`/plain`](https://kai-okah-site.vercel.app/plain).

- `/` — a 3D office where every object is secretly interactive: the monitor runs KO/OS (projects, about, hand-built tools), a folder on the desk opens the certificate dossier, the corkboard enlarges, the chair is sittable, the wall switch cycles day / evening / midnight, and the coffee machine actually brews.
- `/plain` — the v1 one-pager, kept whole: the recruiter fast path and the no-WebGL fallback. Reachable from the business card on the desk and offered automatically when WebGL is missing.
- Full project brief, requirements and build plan: [`docs/BRIEF.md`](./docs/BRIEF.md). Asset policy (spoiler: there are none): [`ASSETS.md`](./ASSETS.md).

## Stack

Next.js 15 (App Router) · TypeScript · Tailwind CSS v4 · static export (`output: "export"`), no backend — deployed on Vercel.

Runtime dependencies, each earning its place:

| Dependency | Why |
|---|---|
| `next`, `react`, `react-dom` | the framework (BRIEF R9) |
| `three`, `@react-three/fiber` | the office itself — WebGL via React |
| `@react-three/drei` | camera rails (`CameraControls`) + perf ladder (`PerformanceMonitor`) |
| `zustand` | the one store bridging canvas and DOM overlays (already inside r3f's tree) |

Deliberately **not** dependencies: an animation library (CSS + drei do it), an audio library (all sound is synthesized with the Web Audio API), a QR library (`src/office/lib/qr.ts` is hand-written and verified against an independent decoder by `scripts/verify-qr.mts`).

## Development

```bash
npm install
npm run dev     # local dev server at http://localhost:3000
npm run build   # static export into out/
npm run lint
```

## Where things live

| Path | What |
|---|---|
| `src/data/profile.ts` | every personal fact and line of copy |
| `src/data/projects.ts` | one object per featured project |
| `src/data/certificates.ts` | dossier pages — add a scan, add an entry |
| `src/data/corkboard.ts` | photo-wall pins, mostly reserved (growth design) |
| `src/office/store.ts` | the mode state machine: idle → monitor / dossier / corkboard / sitting |
| `src/office/Scene.tsx` + `camera/` + `room/` + `furniture/` | the 3D office, all procedural geometry |
| `src/office/overlays/` | entry screen, HUD, KO/OS and its apps, dossier, lightbox |
| `src/office/audio/sound.ts` | synthesized sound effects + rain loop |
| `src/office/lib/qr.ts` | zero-dependency QR encoder (byte mode, EC level M, v1–10) |
| `src/components/` | the v1 one-pager components, serving `/plain` |
| `src/app/globals.css` | design tokens + the few office keyframes |
| `scripts/` | image generation, QR verification |

## How the office works (the short version)

One zustand store holds a mode state machine. Clicking a hotspot (an invisible box over a normal-looking object — it glows softly on hover) is only legal in `idle`; it flies the camera along rails to a named pose on a bezier that launches fast and lands soft. The camera is never parked: between flights it follows the pointer with a gentle parallax and breathes on a slow sine — and there is deliberately no free orbit, every frame is a composed shot (the reference-site discipline). The monitor is the special case: KO/OS is a live DOM surface composited *into* the scene (drei `Html transform occlude` — the CSS3DRenderer technique from Henry Heffernan's portfolio), so the OS runs the whole time and "opening" it is nothing but getting close. Dossier and corkboard remain DOM overlays that fade in when their flight lands. A `PerformanceMonitor` steps a degradation ladder (shadows → resolution → particles) instead of letting weak GPUs stutter, and `prefers-reduced-motion` turns flights into cuts and stills the camera.
