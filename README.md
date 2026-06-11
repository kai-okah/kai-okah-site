# kai-okah-site

Personal portfolio site of **Kai Okah** (Atchem-Kezih Kai Ndzoh Okah) — software engineering student at UDE Essen.

**Status:** v1 in development (target: 2026-06-22).

- Full project brief, requirements and build plan: [`docs/BRIEF.md`](./docs/BRIEF.md)
- Design references that shaped this project: Anders Brownworth's blockchain demo (simplicity) and Jesse Zhou's ramen shop (immersion) — analysis in the brief.

## Stack

Next.js 15 (App Router) · TypeScript · Tailwind CSS v4 · deployed on Vercel. One-page, static export (`output: "export"`), no backend — by design (see brief §Growth path). Runtime dependencies: `next`, `react`, `react-dom` — nothing else.

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
| `src/data/profile.ts` | Every personal fact and line of copy — edit words here, not in components |
| `src/data/projects.ts` | One object per featured project; adding a project = adding an entry |
| `src/components/` | One small component per section: Nav, Hero, Projects/ProjectCard, About, Contact, Footer, ThemeToggle, Reveal |
| `src/app/globals.css` | All design tokens (colors, fonts, reveal animation) as CSS variables |
| `scripts/generate-images.mjs` | Regenerates favicon / apple icon / Open Graph card (committed assets) |
