# Superflat Site POC

Standalone prototype built from the Penpot boards:

- `Home`
- `Projects`
- `Sketches`
- `Slide 16:9` (implemented as `Thoughts`)

## What this POC includes

- Fullscreen fixed landing state (no scroll).
- `WORK>` reveal interaction that expands to show `PROJECTS` and `SKETCHES`.
- Selected sub-item appears black; inactive sub-item is faded.
- Strict transition choreography: existing canvas scene exits first, then next scene enters.
- Project scene animation:
  - **Each slide:** **0.6s** of motion (off-screen ↔ rest). **Entry:** **ease-out quart**; **exit:** **ease-in quart**. **Stagger:** next slide starts **0.2s** after the previous **start**. Total `(n−1)×200ms + 600ms` (e.g. 8 slides → **2s**). **No scene opacity** on cards. Left text: **translate only**, duration matches **`--projects-scene-total-ms`** from JS.
- Sketches scene animation:
  - **Entry:** canvas **slides in from the right** over **0.6s**; **text fades up** over **0.4s** starting **0.4s** after entry begins (total **0.8s**).
  - **Exit:** **reverse** — text fades down **0.4s**, then canvas slides off to the right **0.6s** (total **1s**).
- Thoughts: **`vertical-strip`** stacks **hero** (blue + content) above **`thoughts-area`**. **`main-scroll-viewport`** is one viewport tall; **`--main-viewport-h`** (JS on load/resize) sizes panels. **Thought** translates the strip **up** so thoughts sit “below” the blue block — **no page `scrollY`**. **Work** / **projects** / **sketches** / **about→home** scrolls the strip **back to top**. **`thoughts-area`** uses **`overflow-y: auto`** for long lists. Footer **fixed to top** in thought mode. Row hover still shows preview image.

## Wrapper and Layer Structure

This session refactored the page into stable layout layers so each area can be edited independently.

Top-level composition:

- `app-shell` (flex column, fixed viewport)
  - `main-scroll-viewport` (flex 1, `overflow: hidden`)
    - `vertical-strip` (column: hero panel + thoughts panel; translates up in thought mode)
      - `strip-hero` → `hero-container` → `content` → `header-row`, `content-row`
      - `thoughts-area` → `thoughts-list`
  - `hero-footer` (nav: `THOUGHT>`, `WORK>`, `ABOUT>`)

### Responsibilities by layer

- `hero-container`
  - Visual blue frame and clipping region.
  - Owns no page-specific content directly; content is mounted via row slots below.

- `content`
  - Internal layout wrapper for everything inside blue frame.
  - **Padding:** `var(--hero-padding-y)` top + `var(--hero-padding-x)` horizontal; **no bottom padding** on `.content`. On Projects, `.projects-carousel` uses **`translateY(var(--carousel-bleed-y))`** (~30px) so the deck extends **below** the inner bottom of the blue hero; **`hero-container { overflow: hidden }`** clips that overlap at the rounded blue edge (front card looks “cut off”). Small `row-gap` between `header-row` and `content-row`.

- `header-row`
  - **Shared** for `home`, `projects`, and `sketches`: same tagline (`VISUALLY OPINIONATED / SYSTEMS THINKER`, matching Penpot Projects).
  - Filled by `fillHeaderRow()` in `app.js`; do not mount per-page headers inside `sketches-wrapper` / `projects-wrapper`.

- `content-row`
  - Main content mount zone; **only** `projects-wrapper` or `sketches-wrapper` swap here.
  - Default `overflow: hidden`; **`content-row--carousel-bleed`** sets `overflow: visible` on Projects so the translated carousel can paint past this row and get clipped by **`hero-container`**.
  - **`margin: 0; padding: 0`**
  - Fills remaining flex height to the bottom inner edge of the blue hero.

- `hero-footer`
  - Global footer nav, independent from page content wrappers.
  - Supports work reveal and page switching.

### Page wrappers (mounted inside `content-row`)

- `projects-wrapper` (from Penpot `Projects` board)
  - **Flex row**: left `projects-text` (index + title + description); right **`projects-carousel`** with **`.projects-carousel-clip`** only (no debug HUD).
  - **Carousel behavior** is ported from **`superflat/app/page.tsx`**: `perspective: 1200px`, `perspective-origin: 50% 35%`, **`projects-carousel-stage`** with `transform-style: preserve-3d`, **8** absolutely positioned cards (`left: 50%`, `bottom: 0`, `transform-origin: center bottom`), **`translateX(-50%) translateZ translateY scale rotateX`** with `zSpacing` / `ySpacing`, velocity + friction + snap (`SCROLL_MULT` 0.0006, `FRICTION` 0.92, etc.).
  - **Card size** in the POC: `clipWidth * 0.72` × 9/16 (slightly larger than superflat’s `innerWidth * 0.6`).
  - **Shadows**: card `box-shadow` matches the superflat home card treatment (upward soft shadow + deeper drop shadow on blue).
  - **Input**: wheel / touch on the clip, **Arrow** keys add velocity (same nudge as superflat). Leaving Projects cancels `requestAnimationFrame` and removes listeners via `disposeProjectsCarousel()`.

- `sketches-wrapper`
  - Contains sketches canvas + right descriptor column + indicators.
  - **Scene classes:** `sketches-scene-enter` / `sketches-scene-exit` (see Sketches animation above). Carousel timer starts after entry **0.8s**.
  - Canvas width is percentage-based (currently 50%); height is flexible.

### Why this helps

- You can tune global spacing by editing `content` only.
- You can tweak headings without touching page content flow by editing `header-row`.
- You can redesign projects/sketches independently by editing only their wrappers in `content-row`.
- Footer/navigation can evolve separately from page layout internals.

## Run

Open `index.html` directly in the browser, or serve the folder:

```bash
cd superflat-site-poc
python -m http.server 4173
```

Then open `http://localhost:4173`.
