# Superflat Studio — Architecture

## Overview

```
┌─────────────────┐                    ┌─────────────────┐
│  Sanity Cloud   │                    │  API Routes     │
│   (Content)     │                    │  (Next.js /api) │
│                 │                    │                 │
│ • Projects      │                    │ • /api/transform│
│ • Blocks        │                    │ • /api/...      │
│ • Updates       │                    │                 │
│ • App config    │                    │                 │
└────────┬────────┘                    └────────┬────────┘
         │                                      │
         │   fetch content                      │   API responses
         │                                      │
         └──────────────┬───────────────────────┘
                        │
                        ▼
              ┌─────────────────┐
              │  superflat/     │
              │  (Next.js App)  │
              │                 │
              │ • /             │
              │ • /project/[s]  │
              │ • /apps/tone-*  │
              │ • /apps/...     │
              └─────────────────┘
```

## Repo layout

```
superflat-studio/
├── superflat/          # Next.js frontend + API routes (the thing that ships)
├── SanityStudio/       # Sanity Studio (run locally, deploy separately)
│   ├── sanity.config.ts
│   └── schemaTypes/
├── ToVModulator/       # Original ToV Modulator source — reference only
├── plain-experiments/  # Experiments — reference only
└── docs/               # Architecture, project plan
```

## Components

| Component | Role |
|-----------|------|
| **Sanity Cloud** | Content CMS. Projects, blocks, updates, app config. |
| **superflat/** | Next.js app. Portfolio pages, mini-app routes, API routes. |
| **SanityStudio/** | Sanity Studio for editors. Run locally or deploy to Sanity hosting. |

## Sitemap

### Public routes

```
/                               Homepage
                                  3D carousel hero
                                  ↓ Work section (projects + sketches preview)
                                  ↓ Thought section (longform + updates preview)

/work                           Work index
/work/projects                  All case studies (list)
/work/projects/[slug]           Individual project page (block renderer)
/work/sketches                  All sketches (list)
/work/sketches/[slug]           Individual sketch page (block renderer)

/thought                        Thought index
/thought/[slug]                 Individual thought piece (reading layout)

/apps                           Apps directory / switcher
/apps/tone-modulator            Tone Modulator mini-app
/apps/[name]                    Future mini-apps (one route per app)
```

### Dev-only routes

```
/design                         Design system preview (not built for production)
/design/styles                  Colour tokens, spacing scale, type scale
/design/components              All UI primitives rendered with variants
```

### API routes

```
/api/transform                  LLM text transform (OpenRouter, streaming)
```

---

## Folder structure (superflat/)

```
superflat/
├── app/
│   ├── page.tsx                        # Homepage
│   ├── layout.tsx                      # Root layout (Nav, Footer, fonts)
│   ├── not-found.tsx                   # 404
│   ├── work/
│   │   ├── page.tsx                    # Work index
│   │   ├── projects/
│   │   │   ├── page.tsx                # Case studies list
│   │   │   └── [slug]/page.tsx         # Individual project
│   │   └── sketches/
│   │       ├── page.tsx                # Sketches list
│   │       └── [slug]/page.tsx         # Individual sketch
│   ├── thought/
│   │   ├── page.tsx                    # Thought index
│   │   └── [slug]/page.tsx             # Individual thought piece
│   ├── apps/
│   │   ├── layout.tsx                  # Shared app shell (no global nav/footer)
│   │   ├── page.tsx                    # Apps directory
│   │   ├── tone-modulator/page.tsx     # Tone Modulator
│   │   └── [name]/page.tsx             # Future apps
│   ├── design/                         # Dev-only
│   │   ├── page.tsx                    # Design system index
│   │   ├── styles/page.tsx             # Tokens: colour, spacing, type
│   │   └── components/page.tsx         # All UI primitives
│   └── api/
│       └── transform/route.ts          # LLM transform endpoint
│
├── components/
│   ├── ui/                             # Design system primitives
│   │   ├── Button.tsx
│   │   ├── Tag.tsx
│   │   ├── Divider.tsx
│   │   ├── Container.tsx
│   │   ├── Text.tsx
│   │   ├── Stack.tsx
│   │   └── Grid.tsx
│   ├── blocks/                         # Sanity block renderers
│   │   ├── BlockRenderer.tsx
│   │   ├── HeroImage.tsx
│   │   ├── HeroCode.tsx
│   │   ├── HeroCodeSketch.tsx
│   │   ├── BlockTitle.tsx
│   │   ├── ThinkingGallery.tsx
│   │   ├── Thinking.tsx
│   │   ├── Artefact.tsx
│   │   ├── CodeCanvas.tsx
│   │   ├── TextBlock.tsx
│   │   ├── TextSketchbook.tsx
│   │   └── ImageBlock.tsx
│   ├── tone-modulator/                 # App-specific (existing)
│   ├── Nav.tsx                         # Global navigation
│   ├── Footer.tsx                      # Global footer
│   ├── ProjectCard.tsx                 # Shared card used on Work pages
│   └── PortableTextRenderer.tsx        # Shared Portable Text config
│
├── lib/
│   ├── sanity.ts                       # Sanity client + sanityFetch helper
│   ├── queries.ts                      # All GROQ queries (named exports)
│   └── imageUrl.ts                     # urlFor() helper
│
├── styles/
│   └── globals.css                     # CSS custom properties (all tokens)
│
├── hooks/
├── types/
└── constants/
```

---

## Homepage information architecture

Hero is split into two paths: **Work** and **Thought**.

```mermaid
flowchart TD
    A[Home] --> B[Work]
    A --> C[Thought]
    A --> D[Apps]

    B --> B1[/work/projects]
    B --> B2[/work/sketches]
    B1 --> B3[/work/projects/slug]
    B2 --> B4[/work/sketches/slug]

    C --> C1[/thought]
    C1 --> C2[/thought/slug]

    D --> D1[/apps/tone-modulator]
    D --> D2[/apps/next-app...]
```

## Deployment

**Production deploy:** `superflat/` only (Next.js app with API routes).

**Not deployed with production:**
- `SanityStudio/` — run locally or deploy separately via `sanity deploy`
- `Frontend/` — legacy reference
- `ToVModulator/` — source reference (now bundled into superflat)

## Commands

```bash
npm run dev              # Start Next.js frontend
npm run build            # Build for production
npm run studio:dev       # Start Sanity Studio
npm run studio:deploy    # Deploy Studio to Sanity hosting
```
