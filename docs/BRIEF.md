# Proposal: kai-okah.dev v1 — "The Foundation"
**Client:** Kai Okah (Atchem-Kezih Kai Ndzoh Okah) · **Engineer:** Claude · **Date:** 2026-06-11 · **Deadline: 2026-06-22 (11 days)**

---

## ⚡ CURRENT STATUS & RESUME POINT (if session is lost, start here)

- Interview COMPLETE (4 rounds, R1–R14 below all client-confirmed). Proposal COMPLETE. Risks explained in plain language, client understood.
- Client attempted ultraplan → failed: no git repo in `C:\Users\okahk`. Client decided: **use this as a learning opportunity for Claude Code on the web** — set up the repo properly and run the cloud flow.
- **Immediately on approval, in this order:**
  1. Copy this brief to `C:\Users\okahk\Documents\portfolios\00-kai-okah-site-BRIEF.md` (+ index line in portfolios README) — client's durable progress copy
  2. Execute "Claude Code on the web — onboarding" below (engineer steps), then guide client through his manual steps
  3. Then the 11-day build plan proceeds (locally and/or via cloud sessions, client's choice per task)

## Claude Code on the web — onboarding (client's learning goal)

**What it is:** claude.ai/code — Claude Code running in Anthropic's cloud on a copy of a GitHub repo. Sessions start from the browser (works from any device), produce branches/PRs on the repo, and plans can be "teleported" back into the local CLI. Same Claude subscription as this terminal.

**Prerequisite chain (why ultraplan failed):** cloud sessions need ① a git repo → ② pushed to GitHub → ③ the Claude GitHub app granted access to that exact repo (Kai's known 2026-06-01 blocker was this scope step) → ④ session started from/for that repo.

**Engineer does (on approval, ~10 min):**
- E1. Create `C:\Users\okahk\Documents\kai-okah-site\`, `git init`, commit the brief as `docs\BRIEF.md` (= step 0 of build plan)
- E2. Check `gh auth status`. If authenticated → `gh repo create kai-okah-site --public --source --push`. If not → hand to client step C1.

**Client does (browser/manual, ~10 min):**
- C1. *(only if gh unauthenticated)* type `! gh auth login` in this session → choose GitHub.com → HTTPS → browser login flow
- C2. Grant the Claude GitHub app access to the new repo: github.com/apps/claude → **Configure** → your account → Repository access → **Only select repositories** → add `kai-okah-site` → Save. (This exact step was the June-1 blocker — without it, cloud sessions can't see the repo.)
- C3. Open **claude.ai/code** in the browser → sign in with the same account as this CLI → select repo `kai-okah-site` → start a session (first task suggestion: "Read docs/BRIEF.md and refine it into an implementation plan")
- C4. *(optional, the CLI cloud route)* open a new terminal **inside** `Documents\kai-okah-site`, start `claude` there → ultraplan now finds a git repo and the teleport flow works
- C5. Cloud sessions end in PRs → review on GitHub → merge → local session pulls and continues

**Decision recorded:** cloud refinement/learning happens ON the project repo (option 2 from the cloud-path question), not from the home directory.

---

---

## Context

Client is building his long-term personal brand site. He defined his taste with two analyzed references (`Documents\portfolios\01-anders-brownworth.md`, `02-jesse-zhou.md`): Anders Brownworth (radical simplicity — client's flagged quality) and Jesse Zhou (total immersion). Extracted shared DNA both follow: one interactive centerpiece · no backend · client-side · instant feedback · open source.

A 4-round discovery interview was conducted (2026-06-11). The deadline exists because client may lose access to Fable 5 after June 22 — the hard work must happen inside this tooling window.

## Requirements (from interview — all client-confirmed)

| # | Requirement | Decision |
|---|---|---|
| R1 | Purpose | **Long-term personal brand** (wins all conflicts) |
| R2 | Audience | **Mixed** — HR fast-orientation layer + developer depth layer |
| R3 | 60-second outcome | **"I want to talk to him"** — conversion; contact frictionless, always one click away |
| R4 | Deadline | **Live by 2026-06-22** |
| R5 | Centerpiece | **None in v1** (v2; foundation may start in stretch days) |
| R6 | Content available | Current CV ✅, 2+ public presentable repos ✅; **no photo yet** (client delivers one this week), no written texts (engineer drafts, client approves) |
| R7 | Language | **English only** v1; German = v2 |
| R8 | Design | **Modern minimal + personality** — typography-first, one accent color, dark/light, micro-interactions |
| R9 | Stack | **React/Next.js** (client's explicit choice over engineer's vanilla-JS recommendation — CV keyword + learning value; final) |
| R10 | Hosting | Engineer's choice, free + most reliable → **Vercel Hobby**, `*.vercel.app`, static-export-compatible architecture (no lock-in); custom domain attachable later |
| R11 | Window strategy | **Ship v1 (target day 9), then stretch**: spare days go into v2 centerpiece core |
| R12 | Photo | Real photo this week (phone + daylight is fine); design includes portrait slot |
| R13 | Structure | **One-page** (hero → projects → about → contact), built so per-project detail pages (structure B) can grow out of it |
| R14 | Naming | Brand/title/logo = **"Kai Okah"** (monogram KO); full name **Atchem-Kezih Kai Ndzoh Okah** appears in About + footer |

## The concept

**One page that earns one email.** A fast, typographic one-pager: name and pitch above the fold with the CTA, 2–3 project cards that link to real code, a short human About (with the full name), and a contact block that makes emailing effortless. The simplicity Kai admires in Anders, executed with the visual care Anders skips — inside the React stack Kai chose, kept to a Anders-style dependency budget (the repo is part of the portfolio).

**Design direction** (shown as a token demo on day 2 before committing — measure-then-commit): near-black/paper-white dark+light themes; one warm accent (amber/copper family — distinct from the sea of blue dev portfolios, warm = approachable = conversion); Geist Sans + Geist Mono via `next/font` (zero external requests, mono for the dev signal); generous whitespace; reveal-on-scroll via a tiny IntersectionObserver hook (CSS transitions, no animation library); `prefers-reduced-motion` respected.

## Architecture

- **Next.js 15 (App Router) + TypeScript + Tailwind CSS v4**, deployed on Vercel Hobby from day 1
- **Dependency budget:** next, react, react-dom, tailwind — nothing else without justification
- Static-export-compatible: no API routes, no server-only features → portable to any host
- **Contact without backend:** visible email + copy-to-clipboard + `mailto:` + LinkedIn/GitHub buttons
- **Content as typed data:** `src/data/projects.ts`, `src/data/profile.ts` — adding a project = adding an object (growth path, no CMS)
- Components: `Nav` (sticky, scroll-spy), `Hero` (pitch + photo slot + CTA), `ProjectCard` (name, story-line, stack tags, repo link, hidden "details" slot for v2 pages), `About` (full-name line), `Contact`, `Footer`, `ThemeToggle`
- SEO/meta: Next metadata API, OG share image (KO monogram card), favicon set, sitemap
- Quality bar: Lighthouse ≥ 95 in all categories, mobile-first responsive, keyboard navigable, WCAG AA contrast

## Build plan (11 days, launch target day 9 + 2 buffer/stretch)

| Days | Work | Client owes |
|---|---|---|
| 1 | Project scaffold + GitHub repo + Vercel pipeline live (deploy day one); **repo audit**: pick the 2–3 projects, job-radar privacy check (sanitize personal job-hunt data) | List of repos to feature |
| 2 | Design tokens demo (colors/type/dark-light) → **client approves direction before rollout** | Token approval (24h) |
| 3–4 | Nav + Hero + theme toggle + layout skeleton, responsive base | — |
| 5 | Projects section + cards; engineer drafts all project copy from repos/CV | Copy review (24h) |
| 6 | About + Contact + Footer (full name placement); bio draft | Bio approval; **photo due** |
| 7 | Photo integration, OG image, favicon, SEO pass | — |
| 8 | Polish: micro-interactions, mobile QA, a11y, Lighthouse to ≥95 | — |
| 9 | Content freeze → client review → fixes → **LAUNCH v1** | Final review |
| 10–11 | **Stretch:** v2 centerpiece core (candidate: algorithm-visualizer engine as standalone TS module) — or buffer if slipped | — |

## Risks — the ways this could fail, named in advance (plain language)

1. **Waiting for words ("content approval latency").** Engineer writes all texts, client must approve each — if approvals take days instead of hours, the finished site sits unlaunched and the deadline dies. *This is the #1 killer of portfolio projects.* **Deal: client answers reviews within 24h (≈10 min of reading each time).**
2. **job-radar shows private data.** The featured project contains Kai's real job hunt (companies, applications, personal data). **Deal: day-1 privacy check — show the tool, black out the personal data — before it appears anywhere.**
3. **The photo doesn't arrive.** Life eats "this week I'll take a photo." **Deal: the hero section looks intentional in both states (with photo / text-only), so no missing item can block the launch; photo drops in whenever it exists.**
4. **Kai can't explain his own site.** He's learning React while it's built — if the code is too clever, an interviewer's "walk me through it" backfires. **Deal: small, boring-readable components + a walkthrough of each piece, so Kai owns the code instead of just hosting it.**

## Growth path — media, cloud & "do I ever need a backend?" (client question, answered)

**Rule of thumb:** a backend is needed only when the server must *process or store data per request*. *Serving* content — including video — is exactly what static hosting + CDNs do best (precedent: Jesse Zhou streams 6 videos with zero backend; they're static mp4 assets).

| Future feature | Backend? | How it lands on THIS architecture (no rewrite) |
|---|---|---|
| Project demo videos | **No** | Small clips (< ~20 MB total): mp4 in `/public`, served by Vercel's CDN. Bigger/many: upload to YouTube (unlisted) and embed — free, streaming-grade. Self-hosted feel at scale: Cloudflare R2 / Vercel Blob storage + CDN. |
| Image galleries / photo upgrades | **No** | Static images through `next/image` optimization |
| Blog / articles | **No** | MDX files in the repo — still fully static |
| German version (v2) | **No** | Static localized routes |
| Real contact form (vs. mailto) | **Serverless, not a server** | One Vercel function or a free form service (e.g. Web3Forms) — nothing to run or maintain |
| Analytics | **No** | Vercel Analytics / Plausible script |
| Auth, database, live data, user accounts | **Yes — and it bolts on** | Vercel serverless functions + hosted DB (Neon/Supabase free tiers) added to the *same* Next.js repo. This is the payoff of the client's R9 stack choice: static → serverless → full-stack is a gradient here, not a migration. |

**Conclusion recorded:** v1 ships static; every named growth feature has a no-backend or bolt-on path. The static-export discipline is a portability guarantee, not a capability ceiling.

## v2 roadmap (after the window — recorded, not built now)

Interactive centerpiece (algorithm visualizer leading candidate) · per-project deep-dive pages (structure B) · project demo videos (YouTube embed or R2, per growth table) · German version · custom domain (~12€/yr) · photo upgrade · more projects each semester.

## Verification

1. `npm run dev` locally + Vercel preview URL per push — visual check each milestone
2. Lighthouse (mobile + desktop) ≥ 95 across Performance/A11y/Best-Practices/SEO before launch
3. Real-device pass: Kai's phone (portrait) + desktop + one tablet width
4. Link check: every repo link, mailto, LinkedIn resolves
5. **The 60-second test:** one person who doesn't know the project gets the URL for one minute — can they say what Kai does, and did they find how to contact him? (R3 acceptance test)
6. Static-export smoke test (`next build` with export config) to prove portability claim

## Execution notes

- **Step 0 (immediately on approval, before any code):** create `C:\Users\okahk\Documents\kai-okah-site\` and save this entire brief as `docs\BRIEF.md` inside it — the durable copy the client asked for ("if anything ever goes wrong"); it ships with the repo from commit #1
- Project folder: `C:\Users\okahk\Documents\kai-okah-site` (new git repo, public on GitHub — the repo is part of the portfolio)
- Update memory (`project_portfolio.md`) with decisions + schedule at execution start
- Reference docs to honor during build: simplicity ledger discipline from `01-anders-brownworth.md` §2; polish patterns from `02-jesse-zhou.md` §4 where they fit a one-pager (front-loaded wow, designed frozen states, ambient micro-motion)
