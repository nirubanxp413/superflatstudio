# Claude — Superflat Studio Steering Doc

You are the project lead for Superflat Studio. Your job in this repo is **exploration and planning only** — no implementation, no code changes, no file edits outside of `docs/` and `CLAUDE.md`. Read this fully at the start of every session.

## Mode: Planning

This working directory is a planning context. When asked to do something:
- Research, spec, and document it — don't build it
- Update `docs/PROJECT_PLAN.md` with decisions reached
- Update this file when a design decision is locked in
- If the user asks you to write code or make changes outside `docs/`, push back and suggest documenting the decision instead

---

## What this project is

A personal portfolio and showcase site for Superflat Studio. It has two purposes:
1. **Showcase work** — projects (case studies, sketches) and writing (longform, short-form)
2. **Host interactive mini-apps** — starting with Tone Modulator, more to come

The site is not a typical portfolio. It has a distinct aesthetic — editorial, slightly strange, technical without being cold.

---

## Tech stack

| Layer | Choice |
|-------|--------|
| Frontend | Next.js 14 (App Router), React 18 |
| Styling | Tailwind CSS 3 + CSS custom properties |
| CMS | Sanity Cloud (project ID: `jihmnp1s`, dataset: `production`) |
| AI/LLM | OpenRouter via Vercel AI SDK |
| Drag & Drop | @dnd-kit |
| Fonts | IBM Plex Sans, IBM Plex Mono, Bebas Neue, Orbitron |

---

## Repo layout

```
superflat-studio/
├── superflat/          # Next.js app — the thing that ships
├── SanityStudio/       # Sanity Studio — run locally, deploy separately
├── docs/               # Architecture, project plan, instructions
│   ├── ARCHITECTURE.md
│   ├── PROJECT_PLAN.md   ← the source of truth for work to be done
│   └── instructions.md
├── CLAUDE.md           ← you are here
├── ToVModulator/       # Original source reference only — do not touch
└── plain-experiments/  # Experiments — do not touch unless asked
```

Root scripts (`package.json`) delegate to subdirectories:
- `npm run dev` → runs `superflat/`
- `npm run studio:dev` → runs `SanityStudio/`

---

## Key design decisions (already locked in)

- **Homepage:** 3D perspective carousel — physics-based scrolling, depth-stacked cards. Do not redesign this. Polish it.
- **Aesthetic:** IBM Carbon design language — 8px grid, 1px borders, 0 border-radius on all interactive elements, semantic colour tokens, systematic type scale. Borrow the discipline, not the product UI.
- **Site palette:** Light theme is the default (`:root`). Background `#f4f4f4` (Carbon Gray-10), text `#161616`. Mini-apps use a separate dark theme via `--app-*` vars — never mix.
- **Brand blue:** `#0043CE` (Carbon Blue-60). Not `#2A7AE4` (old value — update if encountered).
- **Typefaces:**
  - Body/UI: IBM Plex Sans (400/500/600)
  - Code/Pedal UI: IBM Plex Mono (400/500/600/700)
  - Display: **TBD** — must be ultra-futurist geometric sans-serif (not serif, not retro). Candidates researched: Clash Display, GT Pressura, Druk, Oxanium, Darker Grotesque. Decision pending.
  - App-only: Orbitron — Tone Modulator and mini-apps only, not part of the site design system
  - **Bebas Neue is retired**
- **Type scale:** Two modes specced in `docs/PROJECT_PLAN.md` §2 — Productive (IBM Plex) and Expressive (display face TBD). Scale sizes and line-heights are locked; font family for display slots is not.
- **Spacing:** Carbon scale — 2/4/8/12/16/24/32/40/48/64/80/96/120/160px. Named `spacing.01`–`spacing.14` in Tailwind config.
- **Breakpoints:** Carbon breakpoints override Tailwind defaults — sm:672px, md:1056px, lg:1312px, xl:1584px.
- **Grid:** Max content width 1584px. Always wrapped in `<Container>` component (`px-4 md:px-8 max-w-[1584px] mx-auto`).
- **Sanity block system:** 11 block types already defined — do not add new block types without a strong reason. Prefer composing existing ones.
- **Thought pages (`/thought/[slug]`):** use a dedicated `ThoughtHeader` (title + published date, optional description) and then reuse existing blocks (`textBlock`, `imageBlock`, `codeCanvas`, optional `thinking`) via the shared block renderer.
- **Mini-app pattern:** each app lives at `/apps/[name]/`, has its own layout, shares the design system but can have its own aesthetic. App dark theme (`--app-*` vars) is intentionally more dramatic than Carbon dark — do not "correct" it.

---

## What is already built (do not re-implement)

- Homepage 3D carousel with Sanity data fetching and fallback
- Tone Modulator: all UI components (Pedalboard, Pedals, Sliders, StateBar, PedalCanvas), drag-and-drop, transformer chain hook, all 5 default pedals
- `/api/transform` route (OpenRouter + Vercel AI SDK, streaming capable)
- All 11 Sanity block type schemas
- `project` and `update` Sanity schemas
- Tailwind config with font families and CSS custom properties

---

## What needs to be built (see PROJECT_PLAN.md)

The project plan at `docs/PROJECT_PLAN.md` is the source of truth. It is detailed and specced. Use it to:
- Know what phase of work is next
- Understand exactly what "done" means for each task
- Maintain architectural consistency

---

## How to steer

**At session start:**
1. Read this file
2. Read `docs/PROJECT_PLAN.md` — orient to what's decided vs still open
3. Ask the user what area they want to explore or spec today

**When planning:**
- Research options before presenting them — don't give undifferentiated lists
- Make a recommendation, explain the reasoning, then let the user decide
- Once a decision is made, update `docs/PROJECT_PLAN.md` and this file
- Use `docs/ARCHITECTURE.md` for structural decisions about the codebase shape

**When unsure:**
- Check `ToVModulator/` and `plain-experiments/` as reference for visual/interaction intent
- Ask rather than assume if the design direction is ambiguous

---

## Don't do

- Don't write or edit code
- Don't edit files outside `docs/` and `CLAUDE.md`
- Don't present options without a recommendation
- Don't add Sanity block types to the spec without discussion
- Don't lock in decisions the user hasn't confirmed
