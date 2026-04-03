# Superflat Studio — Project Plan

Source of truth for all work to be done. Each section is a major theme with fully specced tasks. Check items off as they ship.

---

## 1. Foundation & Dev Environment

**Goal:** Anyone (including future-you) can clone and run the full stack in under 5 minutes.

### Environment setup
- [ ] Create `.env.local` in `superflat/` with:
  - `NEXT_PUBLIC_SANITY_PROJECT_ID=jihmnp1s`
  - `NEXT_PUBLIC_SANITY_DATASET=production`
  - `SANITY_API_TOKEN=<read-token>` (for server-side fetches)
  - `OPENROUTER_API_KEY=<key>`
- [ ] Create `.env.example` (committed, values redacted) so the shape is documented
- [ ] Add `.env.local` to `.gitignore` if not already there

### Scripts & tooling
- [ ] Audit root `package.json` — confirm `dev`, `build`, `studio:dev`, `studio:deploy` all work
- [ ] Add `studio:build` script for CI checks on the studio
- [ ] Pin Node version in `.nvmrc` at root (use current LTS)
- [ ] Add ESLint config to `superflat/` — extend Next.js defaults, no new rules
- [ ] Confirm TypeScript strict mode is on (`"strict": true` in `tsconfig.json`)

### README
- [ ] Write root `README.md` covering:
  - What the project is (one paragraph)
  - Prerequisites (Node version, env vars needed)
  - How to run locally (frontend + studio)
  - How to deploy
  - Folder structure pointer to `docs/ARCHITECTURE.md`

---

## 2. Design System

**Goal:** A single, systematic design language — IBM Carbon's rigour applied to a creative studio context. All visual decisions encoded as tokens in `tailwind.config.ts` and `globals.css`. Zero one-off styles on pages.

**Aesthetic reference:** IBM Carbon Design System — 8px grid, 1px borders, 0 border-radius on interactive elements, dense-but-breathable spacing, cool gray palette, single interactive accent. Not a Carbon clone — borrow the discipline, not the product UI.

---

### 2.1 Typography

#### Display typeface decision
**Retire Bebas Neue. Adopt Fraunces as the display typeface.**

Fraunces is a variable optical serif (Google Fonts, free). It contrasts sharply against IBM Plex's geometric rationalism — editorial, expressive, slightly strange at large sizes. The optical size axis means it behaves differently at 12px vs 120px, which is exactly what a display face should do.

Orbitron stays, but **only** inside Tone Modulator and future mini-apps. It is not part of the site design system.

**Google Fonts import to update in `globals.css`:**
```css
@import url('https://fonts.googleapis.com/css2?
  family=Fraunces:opsz,wght@9..144,300..700&
  family=IBM+Plex+Sans:wght@400;500;600&
  family=IBM+Plex+Mono:wght@400;500;600;700&
  family=Orbitron:wght@400;700;900&
  display=swap');
```
Drop Bebas Neue from the import. Remove the `bebas` font family from `tailwind.config.ts`.

#### Type scale
Two modes, mirroring Carbon's "Productive" / "Expressive" split.

**Productive** — UI text, cards, navigation, metadata. IBM Plex Sans. Tight line heights.

| Token | Size | Line-height | Weight | Use |
|-------|------|------------|--------|-----|
| `text-label` | 11px | 16px | 400 | Eyebrow labels, dates above headings |
| `text-caption` | 12px | 16px | 400 | Image captions, footnotes |
| `text-helper` | 12px | 16px | 400 | Input help text, metadata |
| `text-body-sm` | 14px | 20px | 400 | Secondary body, card descriptions |
| `text-body` | 16px | 24px | 400 | Primary body copy |
| `text-code-sm` | 12px | 16px | 400 | Mono, inline code |
| `text-code` | 14px | 20px | 400 | Mono, code blocks |
| `text-heading-xs` | 12px | 16px | 600 | Small section label, uppercase |
| `text-heading-sm` | 14px | 18px | 600 | Card title, nav item |
| `text-heading` | 16px | 22px | 600 | Section heading (small) |
| `text-heading-md` | 20px | 28px | 400 | Section heading (medium) |
| `text-heading-lg` | 28px | 36px | 300 | Page title, project heading |
| `text-heading-xl` | 36px | 44px | 300 | Large page title |

**Expressive** — Hero, section titles, editorial moments. Fraunces. Airy line heights.

| Token | Size | Line-height | Weight | Optical size axis |
|-------|------|------------|--------|-------------------|
| `text-display-sm` | 42px | 50px | 300 | `opsz=48` |
| `text-display` | 64px | 70px | 300 | `opsz=72` |
| `text-display-lg` | 96px | 100px | 300 | `opsz=144` |

Set `font-feature-settings: 'ss01'` on Fraunces display sizes for the alternate 'a' glyph — it's more characterful.

**Implementation in `tailwind.config.ts`:**
```ts
fontSize: {
  'label':      ['11px', { lineHeight: '16px', fontWeight: '400' }],
  'caption':    ['12px', { lineHeight: '16px', fontWeight: '400' }],
  'helper':     ['12px', { lineHeight: '16px', fontWeight: '400' }],
  'body-sm':    ['14px', { lineHeight: '20px', fontWeight: '400' }],
  'body':       ['16px', { lineHeight: '24px', fontWeight: '400' }],
  'code-sm':    ['12px', { lineHeight: '16px', fontWeight: '400' }],
  'code':       ['14px', { lineHeight: '20px', fontWeight: '400' }],
  'heading-xs': ['12px', { lineHeight: '16px', fontWeight: '600' }],
  'heading-sm': ['14px', { lineHeight: '18px', fontWeight: '600' }],
  'heading':    ['16px', { lineHeight: '22px', fontWeight: '600' }],
  'heading-md': ['20px', { lineHeight: '28px', fontWeight: '400' }],
  'heading-lg': ['28px', { lineHeight: '36px', fontWeight: '300' }],
  'heading-xl': ['36px', { lineHeight: '44px', fontWeight: '300' }],
  'display-sm': ['42px', { lineHeight: '50px', fontWeight: '300' }],
  'display':    ['64px', { lineHeight: '70px', fontWeight: '300' }],
  'display-lg': ['96px', { lineHeight: '100px', fontWeight: '300' }],
},
fontFamily: {
  sans:    ['IBM Plex Sans', 'sans-serif'],
  mono:    ['IBM Plex Mono', 'ui-monospace', 'monospace'],
  display: ['Fraunces', 'Georgia', 'serif'],
  // app-only — not part of the site design system:
  pedal:   ['IBM Plex Mono', 'ui-monospace', 'monospace'],
  orbitron:['Orbitron', 'monospace'],
},
```

---

### 2.2 Colour System

**Philosophy:** Carbon-style semantic tokens. Never use raw hex values in component code — always reference a token. Light theme is the default for the site. Dark theme lives exclusively in mini-apps.

#### Site tokens (light theme — replaces current `[data-theme="light"]` vars)

Make light the `:root` default. The current dark default is wrong for a portfolio site — the homepage is already light `#f5f5f5`.

| CSS var | Value | Tailwind token | Semantic meaning |
|---------|-------|----------------|-----------------|
| `--background` | `#f4f4f4` | `bg-background` | Page background (Carbon Gray-10) |
| `--layer-01` | `#f4f4f4` | `bg-layer` | Card / surface background |
| `--layer-02` | `#e8e8e8` | `bg-layer-hover` | Hover state on cards |
| `--border` | `#e0e0e0` | `border-subtle` | 1px dividers, card borders |
| `--border-strong` | `#8d8d8d` | `border-strong` | Active borders, focus adjacent |
| `--text-primary` | `#161616` | `text-primary` | Body, headings |
| `--text-secondary` | `#525252` | `text-secondary` | Metadata, captions |
| `--text-muted` | `#a8a8a8` | `text-muted` | Disabled, placeholder |
| `--interactive` | `#0043CE` | `text-interactive` / `bg-interactive` | Brand blue (Carbon Blue-60) |
| `--interactive-hover` | `#002d9c` | `bg-interactive-hover` | Hover on interactive elements |
| `--focus` | `#0043CE` | — | Focus ring colour |

Note: replaces current `--brand: #2A7AE4` with `#0043CE`. This is a more authoritative, Carbon-exact blue. Update CLAUDE.md once confirmed.

#### App tokens (dark theme — mini-apps only, keep existing vars)

The existing `--app-*` vars in `globals.css` are correct and intentionally more dramatic than Carbon dark. Do not change them. They live in the pedal aesthetic.

#### Colour implementation

All site tokens → Tailwind:
```ts
colors: {
  background:         'var(--background)',
  layer:              'var(--layer-01)',
  'layer-hover':      'var(--layer-02)',
  border:             'var(--border)',
  'border-strong':    'var(--border-strong)',
  'text-primary':     'var(--text-primary)',
  'text-secondary':   'var(--text-secondary)',
  'text-muted':       'var(--text-muted)',
  interactive:        'var(--interactive)',
  'interactive-hover':'var(--interactive-hover)',
  // keep app-* tokens for mini-app use:
  'app-bg':           'var(--app-bg)',
  'app-surface':      'var(--app-surface)',
  'app-border':       'var(--app-border)',
  'app-text':         'var(--app-text)',
  'app-text-muted':   'var(--app-text-muted)',
},
```

---

### 2.3 Spacing

Carbon's spacing scale — multiples of 8px. Tailwind's default scale is close but not exact. Override it:

| Token | Value | Tailwind class |
|-------|-------|----------------|
| `spacing.01` | 2px | `p-01` |
| `spacing.02` | 4px | `p-02` |
| `spacing.03` | 8px | `p-03` |
| `spacing.04` | 12px | `p-04` |
| `spacing.05` | 16px | `p-05` |
| `spacing.06` | 24px | `p-06` |
| `spacing.07` | 32px | `p-07` |
| `spacing.08` | 40px | `p-08` |
| `spacing.09` | 48px | `p-09` |
| `spacing.10` | 64px | `p-10` |
| `spacing.11` | 80px | `p-11` |
| `spacing.12` | 96px | `p-12` |
| `spacing.13` | 120px | `p-13` |
| `spacing.14` | 160px | `p-14` |

Use `theme: { spacing: { ... } }` (not `extend`) to replace Tailwind's default. This means no `p-3` (12px) confusion — only named semantic sizes.

---

### 2.4 Border & Radius

- **All borders: 1px.** No 2px, no thick borders anywhere in site UI.
- **All interactive elements: 0 border-radius.** Buttons, inputs, cards, tags — sharp corners. This is the hardest Carbon rule to hold to. Hold to it.
- **Exception: none.** If you feel the urge to add `rounded`, reconsider the layout first.
- **Focus ring:** 2px solid `--interactive`, offset 1px inward (inset). Not an outline — a box-shadow: `inset 0 0 0 2px var(--interactive)`.

```ts
borderRadius: { none: '0px', DEFAULT: '0px' },
borderWidth:  { DEFAULT: '1px' },
```

---

### 2.5 Grid & Layout

Carbon's responsive grid:

| Breakpoint | Columns | Gutter | Margin |
|------------|---------|--------|--------|
| sm (< 672px) | 4 | 16px | 16px |
| md (672–1056px) | 8 | 16px | 16px |
| lg (1056–1312px) | 16 | 32px | 16px |
| xl (1312–1584px) | 16 | 32px | 16px |
| max (≥ 1584px) | 16 | 32px | auto |

Max content width: **1584px** (`max-w-[1584px] mx-auto`).

In practice: use a `<Container>` component that handles `px-4 md:px-8 max-w-[1584px] mx-auto`. Don't repeat these classes on pages.

Add to Tailwind:
```ts
screens: {
  sm:  '672px',
  md:  '1056px',
  lg:  '1312px',
  xl:  '1584px',
},
```
These override Tailwind's defaults. This is intentional — Carbon breakpoints, not Tailwind's.

---

### 2.6 Component Specs

All components live in `superflat/components/ui/`. No logic — only markup and classes.

#### `Button`
Props: `variant`, `size`, `disabled`, `as` (default `button`).

Two sizes. 0 border-radius. Horizontal padding: 16px.

| Size | Height |
|------|--------|
| `md` (default) | 40px |
| `sm` | 32px |

| Variant | Background | Text | Border |
|---------|-----------|------|--------|
| `primary` | `--interactive` | white | none |
| `secondary` | transparent | `--interactive` | 1px `--interactive` |
| `ghost` | transparent | `--interactive` | none |
| `danger` | `#da1e28` (Carbon Red-60) | white | none |

- Hover: `primary` → `--interactive-hover`. `secondary`/`ghost` → `bg-layer-hover`.
- Focus: `inset 0 0 0 2px var(--focus)` box-shadow.
- Disabled: `opacity-50 cursor-not-allowed`.

#### `Tag`
Props: `variant`, `children`.

Carbon-style: uppercase, `text-label` (11px/16px), tracking-wide. No border. 0 border-radius. Horizontal padding: 8px. Height: 24px.

| Variant | Background | Text |
|---------|-----------|------|
| `default` | `--layer-02` | `--text-secondary` |
| `interactive` | `--interactive` | white |

Used for: project categories, content type labels, artefact badges.

#### `Divider`
`<hr>` rendered as `block h-px bg-border w-full border-0`. That's it.

Used heavily as structural elements — Carbon uses dividers as layout devices, not just decoration.

#### `Container`
Props: `bleed` (boolean, default `false`).

- Default: `<div className="max-w-[1584px] mx-auto px-4 md:px-8">`
- `bleed={true}`: `<div className="w-full">` — no max-width, no horizontal padding. Used by full-bleed blocks (`heroImage`, `heroCode`, `heroCodeSketch`).

#### `Text`
Props: `as` (semantic element, required), `variant` (type scale token name, required), `className`.

```tsx
<Text as="h1" variant="display">Superflat Studio</Text>
<Text as="p" variant="body">...</Text>
<Text as="span" variant="label">CASE STUDY</Text>
```

Font-family is determined by variant:
- `display-*` → Fraunces. Apply `font-feature-settings: 'ss01'` on all display variants for the alternate 'a' glyph.
  - `display-lg` → Fraunces with `font-variation-settings: 'opsz' 144`
  - `display` → `font-variation-settings: 'opsz' 72`
  - `display-sm` → `font-variation-settings: 'opsz' 48`
- `code-*` → IBM Plex Mono
- all others → IBM Plex Sans

#### `Stack`
Props: `as` (semantic element, default `div`), `gap` (spacing token name, e.g. `'06'`), `align`, `justify`.

Vertical flex. No horizontal variant — use `Grid` or `flex-row` directly.

#### `Grid`
Props: `cols` (number or responsive object), `gap` (spacing token name).

Responsive `cols` object syntax:
```tsx
<Grid cols={{ sm: 1, md: 2, lg: 3 }} gap="06">
```

Single number = fixed column count at all breakpoints. Responsive object uses Carbon breakpoint keys.

---

### 2.7 Implementation checklist

**Important: complete this section before building any block components (§5). Block components depend on all 7 primitives and all design tokens being in place.**

- [ ] Update Google Fonts import in `globals.css`: add Fraunces, drop Bebas Neue
- [ ] Rewrite `:root` in `globals.css` to light-theme defaults using the new token names above
- [ ] Move dark vars to a `[data-theme="dark"]` selector (for future use) or remove the dark site theme entirely if the site is always light
- [ ] Confirm `--app-*` vars are untouched (they're app-specific, not site tokens)
- [ ] Rewrite `tailwind.config.ts` with:
  - `theme` (not `extend`) for `screens`, `spacing`, `borderRadius`, `borderWidth`
  - `extend` for `fontFamily`, `fontSize`, `colors`
- [ ] Build all 7 UI primitives in `superflat/components/ui/`: `Button`, `Tag`, `Divider`, `Container`, `Text`, `Stack`, `Grid`
- [ ] Create `superflat/app/dev/design-system/page.tsx` (dev-only, returns 404 in production) with sections:
  - Type scale: all variants rendered with lorem text
  - Colour swatches: all tokens with hex value and CSS var name shown
  - Components: all Button variants (both sizes), Tag variants, Divider
  - Spacing scale: visual ruler showing each spacing token name and pixel value
- [ ] Search codebase for any hardcoded hex values in non-app components and replace with token references
- [ ] Document the Fraunces variable axis usage (opsz, wght) in CLAUDE.md

---

## 3. Sanity CMS

**Goal:** Content is fully managed in Sanity. No hardcoded data in production code.

### Schema work
Currently: `project`, `update`, 11 block types. Missing: site config, author.

- [ ] Add `siteConfig` singleton schema:
  - `siteName` (string)
  - `tagline` (string) — used in hero
  - `about` (rich text) — short about blurb
  - `socialLinks` (array of `{ platform, url }`)
  - `seoDefaults` (`{ ogImage, description }`)
  - Make it a singleton in Sanity Studio desk structure (one document, not a list)

- [ ] Update `project` schema in `SanityStudio/schemaTypes/project.ts`:
  - `title`, `slug`, `category`, `description` — ✓ exists
  - `mainImage` with hotspot — ✓ exists
  - Add `tags` — `array` of `string`, `options: { layout: 'tags' }`
  - Add `publishedAt` — `date`, `validation: Rule.required()`
  - Add `isFeatured` — `boolean`, `initialValue: false`, description: "Show prominently in homepage carousel"
  - Add `type` — `string`, `validation: Rule.required()`, options list:
    - `{ title: 'Case Study', value: 'case-study' }`
    - `{ title: 'Quick Sketch', value: 'sketch' }`
    - `{ title: 'Longform', value: 'longform' }`
  - Update `orderings` to sort by `publishedAt desc` as default
  - Update `preview.select` to include `subtitle: 'type'`

- [ ] Update `update` schema in `SanityStudio/schemaTypes/update.ts`:
  - `project` reference — ✓ exists
  - `date` — ✓ exists
  - `title`, `content` — ✓ exists
  - Add `tags` — `array` of `string`, `options: { layout: 'tags' }`
  - Add `isStandalone` — `boolean`, `initialValue: false`, description: "Show as a site-level update not linked to any project"

- [ ] Confirm all 11 block types are correctly exported from `schemaTypes/index.ts`

### GROQ queries
- [ ] Create `superflat/lib/sanity.ts`:
  - Client configuration (uses env vars, not hardcoded project ID)
  - `sanityFetch` helper (wraps fetch with revalidation tag)
- [ ] Create `superflat/lib/queries.ts` with named GROQ queries:

```groq
// homepageProjectsQuery
*[_type == "project"] | order(publishedAt desc) {
  _id, title, slug, description, category,
  tags, publishedAt, isFeatured, type,
  mainImage { asset->, hotspot }
}
```

```groq
// projectBySlugQuery — $slug param
*[_type == "project" && slug.current == $slug][0] {
  _id, title, slug, category, description,
  tags, publishedAt, isFeatured, type,
  mainImage { asset->, hotspot },
  pageContent[] {
    ...,
    image { asset->, hotspot },
    images[] { image { asset->, hotspot }, size }
  }
}
```

Note: the `...` spread in `pageContent[]` captures all scalar fields on every block type. The explicit `image` and `images[]` expansions are needed because GROQ does not auto-dereference nested image asset refs.

```groq
// adjacentProjectsQuery — for prev/next nav, $publishedAt and $id params
{
  "prev": *[_type == "project" && publishedAt < $publishedAt] | order(publishedAt desc)[0] {
    title, slug, category
  },
  "next": *[_type == "project" && publishedAt > $publishedAt] | order(publishedAt asc)[0] {
    title, slug, category
  }
}
```

```groq
// allUpdatesQuery
*[_type == "update"] | order(date desc) {
  _id, title, date, tags, isStandalone,
  content,
  project->{ title, slug }
}
```

```groq
// siteConfigQuery
*[_type == "siteConfig"][0] {
  siteName, tagline, about, socialLinks, seoDefaults
}
```

- [ ] Replace the hardcoded Sanity fetch in `app/page.tsx` with `homepageProjectsQuery`
- [ ] Remove all fallback hardcoded project data from `app/page.tsx` (replace with empty array, render empty state)

### Studio desk structure
- [ ] Update `SanityStudio/sanity.config.ts` to add a structured desk:
  - "Site Config" singleton (no list view)
  - "Projects" list (filterable by type)
  - "Updates" list (orderable by date)
- [ ] Deploy studio: `npm run studio:deploy`

### Image URL builder
- [ ] Add `superflat/lib/imageUrl.ts` using `@sanity/image-url`
- [ ] Install `@sanity/image-url` if not already present
- [ ] Export a `urlFor(source)` helper used everywhere images are rendered

---

## 4. Homepage

**Goal:** The 3D carousel is the hero. Below it: two sections (Work, Thought). All content is live from Sanity.

### Carousel (already built — polish only)
- [ ] Replace hardcoded Sanity client init (`jihmnp1s` inline) with the shared `lib/sanity.ts` client
- [ ] Remove fallback hardcoded project array — show an empty carousel or loading state instead
- [ ] Confirm carousel renders `mainImage` from Sanity using `urlFor()` (currently may be using placeholder images)
- [ ] Mobile: test scroll/touch behaviour on real device — fix if broken
- [ ] Keyboard: confirm arrow key navigation works and is accessible (add `aria-label` to navigation hints)

### Work section
Appears below the carousel. Shows projects split by type.

- [ ] Build `WorkSection` component:
  - Two sub-sections: "Case Studies" and "Quick Sketches"
  - Filters `projects` by `type === 'case-study'` and `type === 'sketch'`
  - Each project renders as a `ProjectCard` (see below)
- [ ] Build `ProjectCard` component:
  - Shows: cover image (thumbnail), category tag, title, short description
  - Links to `/project/[slug]`
  - Hover state: subtle lift or reveal effect (decide on one)
  - Layout: grid, 2 columns on desktop, 1 on mobile

### Thought section
- [ ] Build `ThoughtSection` component:
  - Two sub-sections: "Longform" (links to `/thought/[slug]`) and "Updates" (links to `/updates`)
  - Longform items: title + date, no image needed
  - Updates: most recent 3, shown as a feed of title + date
- [ ] Fetch updates via `allUpdatesQuery`

### Navigation (homepage)
- [ ] "Work" and "Thought" headings in the hero should scroll to their sections (smooth scroll)
- [ ] About link should scroll to or open an About panel (decision needed: inline section or modal?)

---

## 5. Project Pages

**Goal:** Every project in Sanity has a rich, rendered page at `/project/[slug]`.

### Route & data
- [ ] Create `superflat/app/project/[slug]/page.tsx`
- [ ] Use `projectBySlugQuery` to fetch full project data
- [ ] Add `generateStaticParams` — build all project pages at build time
- [ ] Add `revalidateTag('projects')` for ISR

### Block renderer
- [ ] Create `superflat/components/blocks/BlockRenderer.tsx`
  - Accepts `blocks: SanityBlock[]`
  - Wraps each block in a rhythm wrapper: `py-10` (64px) by default; hero blocks and `titleBlock` override this (see below)
  - Switches on `_type` and renders the correct block component
  - Unknown types: render nothing, no errors
- [ ] Install `@portabletext/react` for Portable Text fields
- [ ] Create `superflat/components/blocks/PortableTextComponents.tsx` — shared Portable Text config:
  - `normal` → `<Text as="p" variant="body">`
  - `h2` → `<Text as="h2" variant="heading-md">`
  - `h3` → `<Text as="h3" variant="heading">`
  - `blockquote` → `<blockquote>` with `pl-06 border-l-2 border-interactive text-secondary`
  - `strong` → `font-semibold`
  - `em` → `italic`
  - `code` → `<code className="font-mono text-code-sm bg-layer px-01 py-01">`

#### Block component specs

All block components live in `superflat/components/blocks/`. All use design system primitives — no ad-hoc hex values or one-off spacing.

---

**`HeroImage.tsx`** (`heroImage` block)
- Full bleed: `Container` with `bleed={true}` (no max-width, no padding)
- `<img>` via `next/image` with `fill`, `object-fit: cover`, `height: 70vh`
- No caption
- No vertical rhythm padding — flush to whatever precedes it

---

**`HeroCode.tsx`** (`heroCode` block)
- Full bleed: `Container bleed={true}`, `min-height: 70vh`
- Background: `--app-bg` (dark app tokens), text: `--app-text`
- Layout: centred code block with syntax highlighting (static, not interactive)
- Language label: top-right in `text-code-sm text-muted font-mono`
- No vertical rhythm padding — flush

---

**`HeroCodeSketch.tsx`** (`heroCodeSketch` block)
- `'use client'` — runs p5.js sketch interactively in the browser
- Full bleed: same dark panel treatment as `HeroCode`
- `min-height: 70vh`, canvas fills the container
- No vertical rhythm padding — flush

---

**`BlockTitle.tsx`** (`titleBlock` block)
- `Container` (default, not bleed)
- `Divider` above the title text
- `Text as="h2" variant="display-sm"` — Fraunces, 42px, weight 300, `opsz=48`
- Vertical rhythm override: `pt-10 pb-08` (64px top, 40px bottom) — replaces the default `py-10`

---

**`ThinkingGallery.tsx`** (`thinkingGallery` block)
- `Container` (default)
- CSS grid: `grid-cols-1 md:grid-cols-[1fr_2fr]` — text left, images right
- Left column: `heading` in `Text as="h3" variant="heading-md"` + `body` in `Text as="p" variant="body" className="text-secondary"`
- Right column: image grid
  - `size: 'full'` → spans full right column (`col-span-2` within a nested 2-col grid)
  - `size: 'half'` → takes one column slot — pairs of `half` images appear side by side
- All images via `next/image`, `object-fit: cover`, consistent aspect ratio (`aspect-[4/3]`)
- Mobile: single column, text above images

---

**`Thinking.tsx`** (`thinking` block)
- `Container` (default)
- Two-row layout:
  - Row 1: `Text as="span" variant="heading-xs" className="uppercase tracking-widest text-muted"` — renders `label`
  - Row 2: `Text as="p" variant="body" className="pl-08 text-secondary"` — renders `text` with 40px left indent
- Reads as marginalia / process note — visually lighter than body prose

---

**`Artefact.tsx`** (`artefact` block)
- `Container` (default)
- Full-width `<a href={url}>` wrapping the entire card
- 1px border (`border border-subtle`), hover: `bg-layer-hover` transition
- Layout: `flex justify-between items-start gap-06`
  - Left: `Stack gap="02"` containing:
    - `badges` — `Tag` components with `variant="default"`, rendered in a flex row
    - `title` — `Text as="span" variant="heading-sm"`
    - `description` — `Text as="p" variant="body-sm" className="text-secondary"`
  - Right: `Stack gap="01" items-end`
    - Arrow `→` in `text-heading-sm`
    - URL in `Text as="span" variant="code-sm" className="text-muted"` (truncated to ~40 chars)
- Padding: `p-06` (24px) inside the card

---

**`CodeCanvas.tsx`** (`codeCanvas` block)
- `Container` (default), but inner panel has dark background (`bg-[var(--app-bg)]`)
- Header row (`flex justify-between items-center px-06 py-03 border-b border-[var(--app-border)]`):
  - Left: `title` in `Text as="span" variant="code-sm" className="text-[var(--app-text)]"` (or "untitled" if absent)
  - Right: `language` in `Text as="span" variant="code-sm" className="text-[var(--app-text-muted)]"`
- Code body: `p-06 font-mono text-code overflow-x-auto` with syntax highlight
- Syntax highlighter: Shiki (server-side) — no client JS needed

---

**`TextBlock.tsx`** (`textBlock` block)
- `Container` (default), inner content constrained to `max-w-[65ch] mx-auto`
- Renders `content` Portable Text array via `@portabletext/react` using `PortableTextComponents`

---

**`TextSketchbook.tsx`** (`textSketchbook` block)
- `Container` (default), full width (no `65ch` constraint)
- Renders Portable Text body at natural width
- Images embedded in the text use `position: relative` + CSS `transform: rotate(Xdeg) translate(Xpx, Ypx)` via inline styles — each image gets a deterministic offset derived from its index
- CSS-only offset, no JavaScript required

---

**`ImageBlock.tsx`** (`imageBlock` block)
- `Container` (default) wrapping a `next/image` with `width: 100%`, `height: auto`
- Caption (if present): `Text as="p" variant="caption" className="text-secondary mt-02"`

---

#### Vertical rhythm rules

Applied by `BlockRenderer.tsx` wrapper around each block:

| Block type | Top padding | Bottom padding |
|---|---|---|
| `heroImage`, `heroCode`, `heroCodeSketch` | 0 | 0 |
| `titleBlock` | `pt-10` (64px) | `pb-08` (40px) |
| all others | `pt-10` (64px) | `pt-10` (64px) |

The first block in `pageContent` has its top padding removed regardless of type (`[&:first-child]:pt-0`).

---

- [ ] Build all 11 block components per specs above
- [ ] Confirm `heroCodeSketch` loads p5.js dynamically (`next/dynamic` with `ssr: false`) to avoid SSR issues

### Project page layout

#### Metadata header

Inside `Container` (default), with a `Divider` below it. Structure:

```
[Back link: ← Work]   [category Tag]
[Title — Fraunces text-heading-xl or text-display-sm]
[description — body-sm, text-secondary]
[publishedAt — text-label, text-muted]
```

- Back link: `Button variant="ghost" size="sm"` pointing to `/#work`
- Category: `Tag variant="default"` — uppercase, right-aligned on same row as back link on desktop
- Title: `Text as="h1" variant="display-sm"` — use `heading-xl` if title is > 40 chars
- Description: `Text as="p" variant="body-sm" className="text-secondary"`, max 2 lines
- Date: `Text as="time" variant="label" className="text-muted"` formatted as `MMM YYYY`

#### Block stream

- `BlockRenderer` renders `pageContent` blocks sequentially
- No additional wrapper needed — `BlockRenderer` handles all spacing

#### Prev / Next navigation

At page bottom, fetched via `adjacentProjectsQuery`. Structure:

```
[Divider — full width]
[two-column flex]
  Left col:                    Right col:
  [CATEGORY Tag]               [CATEGORY Tag]
  [← Previous title]           [Next title →]
[Back to Work — ghost Button, centred, mt-08]
```

- Two-column: `flex justify-between gap-10`
- Each column: `Stack gap="02"` — Tag then title in `heading-sm`
- Left column is empty (hidden) if no previous project; right column empty if no next
- "← Work" back link below both columns, `Button variant="ghost"`, centred with `mt-08`

- [ ] Create `superflat/app/project/[slug]/page.tsx` with metadata header, block stream, prev/next nav
- [ ] Use `projectBySlugQuery` to fetch full project data
- [ ] Use `adjacentProjectsQuery` (separate fetch) for prev/next links
- [ ] Add `generateStaticParams` — build all project pages at build time from `homepageProjectsQuery` slugs
- [ ] Add `revalidateTag('projects')` for ISR
- [ ] Add `generateMetadata` using `title`, `description`, `mainImage` from the project data

---

### 5.5 Dev preview page — block visualiser

**Goal:** Render all 11 block components with hardcoded dummy data so they can be inspected before any Sanity content exists. Sits alongside the existing `/dev/tailwind-showcase` page.

**Route:** `superflat/app/dev/project-blocks/page.tsx`

**Dev-only guard:** At the top of the page file:
```ts
if (process.env.NODE_ENV === 'production') notFound()
```

**Page structure:** A vertical list of sections, each containing:
1. A labelled header row: block type name in `text-heading-xs uppercase tracking-widest text-muted`, with a `Divider` above
2. The block component rendered with its dummy data

**Dummy data per block:**

| Block | Key dummy values |
|---|---|
| `heroImage` | Unsplash placeholder URL (`picsum.photos`) |
| `heroCode` | 20-line sample TypeScript function, `language: 'typescript'` |
| `heroCodeSketch` | Simple p5.js sketch: bouncing circle, `language: 'javascript'` |
| `titleBlock` | `title: "Section One"` |
| `thinkingGallery` | `heading: "Design process"`, `body: "Exploring the..."`, 3 images (2 full, 1 half) using Unsplash |
| `thinking` | `label: "Process note"`, `text: "Early on we decided..."` |
| `artefact` | `title: "Prototype v2"`, `url: "https://example.com"`, `badges: ["Prototype", "Figma"]`, `description: "Interactive mock..."` |
| `codeCanvas` | `title: "lib/utils.ts"`, `language: "typescript"`, 10 lines of sample code |
| `textBlock` | Portable Text array with one `normal` paragraph, one `h2`, one `blockquote` |
| `textSketchbook` | Portable Text with 2 paragraphs; 2 offset images using Unsplash |
| `imageBlock` | Single Unsplash image, `caption: "Caption text here"` |

**No Sanity dependency:** All data is hardcoded inline. No environment variables required to view this page.

**Checklist:**
- [ ] Create `superflat/app/dev/project-blocks/page.tsx` with dev-only guard and all 11 block previews
- [ ] Confirm page is accessible at `http://localhost:3000/dev/project-blocks` in dev mode
- [ ] Confirm page returns 404 when `NODE_ENV=production`

---

## 6. Thought / Writing Pages

**Goal:** Writing lives at `/thought/` (longform) and `/updates` (short-form). Separate from projects.

### Longform
- [ ] Decide: does longform writing use the same Sanity `project` type with `type: 'longform'`, or a separate schema?
  - **Recommendation:** Add `type: 'longform'` to the project schema enum. Reuse block renderer.
- [ ] Create `superflat/app/thought/[slug]/page.tsx`
- [ ] Create GROQ query `longformBySlugQuery`
- [ ] Add `generateStaticParams` for all longform entries
- [ ] Page layout: simpler than project pages — reading-focused, max-width prose column

#### Thought page sample spec (blog layout)

**Recommendation:** Keep `/thought/[slug]` structurally simple and editorial. Reuse the existing block system and only add one dedicated header component for writing metadata.

**Route intent**
- `/thought/[slug]` is for longform writing entries (`project.type === 'longform'`)
- Visual density should be lower than project pages: no prev/next rails, no category-heavy chrome
- Reading flow should prioritise title, publication date, and uninterrupted body rhythm

**New component: `ThoughtHeader`**
- File target: `superflat/components/thought/ThoughtHeader.tsx`
- Purpose: canonical header for all thought pages
- Props:
  - `title: string`
  - `publishedAt: string` (ISO date)
  - `description?: string` (optional dek/standfirst)
- Structure (inside `Container`):
  - Eyebrow row: `Text as="span" variant="heading-xs"` with label `THOUGHT`
  - Title row: `Text as="h1" variant="display-sm"` (fallback to `heading-xl` if title wraps excessively)
  - Meta row: `Text as="time" variant="label" className="text-muted"` formatted `DD MMM YYYY`
  - Optional description row: `Text as="p" variant="body-sm" className="text-secondary max-w-[65ch]"`
  - `Divider` below header block
- Spacing:
  - Header wrapper: `pt-10 pb-08`
  - Inside header stack: `gap-03` for eyebrow/title, `gap-02` for meta/description
- Behaviour:
  - Date is always visible
  - No hero image in header by default (hero visuals stay in block stream if needed)

**Block reuse policy for thought pages**
- Reuse existing renderer and components from project pages:
  - `textBlock` (primary longform body)
  - `imageBlock` (single inline visual with optional caption)
  - `codeCanvas` (code sketch or technical excerpt)
  - `thinking` (optional marginalia/process note when needed)
- For thought pages, avoid default use of:
  - `heroImage`, `heroCode`, `heroCodeSketch` unless explicitly editorially justified
  - `artefact` unless the post is link-heavy and reference-driven

**Rendering sequence**
1. `ThoughtHeader`
2. `BlockRenderer` for `pageContent`
3. Simple bottom action row in `Container`:
   - `Button variant="ghost" size="sm"` linking to `/#thought` with label `← Back to Thought`

**Sample content composition (baseline)**
- `textBlock` (intro + first section)
- `imageBlock` (single supporting image)
- `textBlock` (main section)
- `codeCanvas` (if technical post)
- `thinking` (optional short note)
- `textBlock` (closing section)

**Checklist — implementation-ready**
- [ ] Add `ThoughtHeader` component in `superflat/components/thought/`
- [ ] Create `superflat/app/thought/[slug]/page.tsx` using `ThoughtHeader` + `BlockRenderer`
- [ ] Implement `longformBySlugQuery` (same shape as `projectBySlugQuery`, filtered to `type == 'longform'`)
- [ ] Add `allLongformSlugsQuery` for `generateStaticParams`
- [ ] Add `generateMetadata` for thought pages (`title`, `description`, `mainImage`)
- [ ] Ensure date formatting is consistent across homepage Thought list and thought detail pages
- [ ] Add one dev fixture page for thought layout validation (can reuse existing dev route strategy)

### Updates feed
- [ ] Create `superflat/app/updates/page.tsx`
- [ ] Renders all updates newest first
- [ ] Each update: date (prominent), title, body (portable text)
- [ ] Optional: filter by project or tag
- [ ] Standalone updates (no project reference) should display without a project link

---

## 7. Mini-Apps

### Tone Modulator (polish phase)
The core is fully built. This is about quality and integration.

- [ ] Polish UI to match the design system tokens (check: does the dark app theme use `--app-*` CSS vars consistently? Any magic hex values that should reference tokens?)
- [ ] AppHeader: replace "Coming soon" placeholder with a real second app entry when ready (don't remove the placeholder, just update the label)
- [ ] Add a project page in Sanity for Tone Modulator — it should appear on the homepage
- [ ] Confirm `/api/transform` handles these edge cases:
  - Empty input text → return input unchanged, don't call LLM
  - LLM timeout → return error state, don't hang
  - Invalid modelId → return 400 with message
- [ ] Add a keyboard shortcut to run the chain (e.g., `Cmd+Enter` in the input area)
- [ ] Mobile: decide if Tone Modulator is mobile-supported or shows a "best on desktop" message

### Mini-app #2 (TBD)
- [ ] Identify and decide on the second mini-app concept
- [ ] Once decided: add to AppHeader dropdown
- [ ] Create route `/apps/[name]/page.tsx`
- [ ] Create a Sanity project entry for it
- [ ] Add its own section to this plan

### Shared app infrastructure
- [ ] Create `superflat/app/apps/layout.tsx` — shared layout for all mini-apps:
  - Renders `AppHeader` (already exists)
  - Dark background by default
  - No global nav (apps are their own context)
- [ ] Confirm `AppHeader` app-switcher list is driven by a config array (not hardcoded JSX) so adding apps later is a one-line change

---

## 8. Navigation & Site Chrome

**Goal:** Consistent, minimal global UI that doesn't compete with content.

### Global nav
- [ ] Design the nav: logo (wordmark or mark?), "Work", "Thought", "Apps" — decide if it's top bar or sidebar
- [ ] Build `superflat/components/Nav.tsx`
- [ ] Add to `superflat/app/layout.tsx`
- [ ] Active link state (highlight current section)
- [ ] Mobile: hamburger or just stacked — keep it simple

### Footer
- [ ] Build `superflat/components/Footer.tsx`:
  - Left: site name + tagline (pulled from `siteConfig`)
  - Right: social links (pulled from `siteConfig`)
  - Bottom: copyright line with current year
- [ ] Add to `superflat/app/layout.tsx` (but NOT inside the apps layout — apps have no footer)

### Layout & metadata
- [ ] Audit `superflat/app/layout.tsx`:
  - Font loading: IBM Plex Sans, IBM Plex Mono, Bebas Neue, Orbitron — confirm all loaded via `next/font`
  - Default metadata: title template `"%s | Superflat Studio"`, description from `siteConfig`
  - OG image: default OG image (static asset)
- [ ] Per-page metadata: `generateMetadata` on project, thought, updates pages using Sanity data
- [ ] Add `superflat/app/not-found.tsx` — minimal 404 page with a link home

---

## 9. Deployment & Production

**Goal:** Site is live, fast, and content updates flow from Sanity automatically.

### Vercel setup
- [ ] Create Vercel project linked to this repo
- [ ] Set root directory to `superflat/` (not the monorepo root)
- [ ] Add all env vars to Vercel dashboard (same as `.env.local`)
- [ ] Confirm `npm run build` passes with zero errors
- [ ] Confirm no TypeScript errors (`tsc --noEmit`)

### Domain & CDN
- [ ] Set up custom domain (what is it? TBD)
- [ ] Confirm SSL is provisioned
- [ ] Set redirect: `www` → apex (or vice versa)

### Sanity → Vercel webhook
- [ ] Create a Vercel deploy hook URL
- [ ] Add it to Sanity as a webhook (trigger on: publish, unpublish)
- [ ] Test: publish a change in Sanity, confirm Vercel rebuild triggers within 60s

### Sanity Studio
- [ ] Deploy Studio: `npm run studio:deploy`
- [ ] Confirm Studio URL is accessible
- [ ] Add CORS origin for the production domain in Sanity project settings

### Analytics
- [ ] Enable Vercel Analytics (zero-config, add `<Analytics />` to layout)
- [ ] Optionally add Vercel Speed Insights

### Performance targets
- [ ] Lighthouse score targets: Performance ≥ 90, Accessibility ≥ 95, SEO ≥ 95
- [ ] All images use `next/image` with correct `sizes` prop
- [ ] No images over 200KB uncompressed (use Sanity image transforms)
- [ ] Core Web Vitals: LCP < 2.5s, CLS < 0.1, INP < 200ms

---

## 10. Content

**Goal:** Site has real content on launch day. This runs in parallel with build work.

### Projects
- [ ] Write and publish 2 case studies with full block content
- [ ] Write and publish 2 quick sketches (lighter, image-forward)
- [ ] Write a Tone Modulator project page
- [ ] For each project: cover image, category tag, short description (for carousel), full page content

### Writing
- [ ] Write 1 longform piece
- [ ] Write 3–5 short-form updates (can be brief)

### Site config
- [ ] Fill in `siteConfig` in Sanity: site name, tagline, about blurb, social links
- [ ] Upload default OG image (1200×630px)
- [ ] Confirm all social links point to real destinations

### Image preparation
- [ ] All cover images: consistent aspect ratio (decide: 16:9 or 3:2 or 4:3)
- [ ] Cover images uploaded to Sanity with hotspot set correctly

---

## 11. Polish & Launch

**Goal:** Qualitatively ready. No rough edges.

- [ ] Cross-browser: Chrome, Firefox, Safari (latest) — test every page
- [ ] Mobile: real device test on iOS Safari and Android Chrome
- [ ] Keyboard navigation: tab through entire site without a mouse
- [ ] Screen reader: run VoiceOver on homepage and a project page
- [ ] Colour contrast: all text passes WCAG AA (4.5:1 for body, 3:1 for large text)
- [ ] Review all public-facing copy for typos and tone
- [ ] Confirm no console errors on any page in production build
- [ ] Soft-launch: share URL with 2–3 people for feedback
- [ ] Address feedback
- [ ] Hard-launch: share publicly
