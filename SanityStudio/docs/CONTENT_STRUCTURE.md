# Content Structure for Superflat Portfolio

## Conceptual approach

Each project is a **flexible page** — no fixed layout. You compose the page from blocks (text, code, images, thinking notes, etc.) in whatever order fits that project. Separately, **project updates** act as a chronological log: milestones, reflections, pivots.

---

## How to execute from Sanity

### 1. Create a project

1. Run `npm run dev` → Sanity Studio opens
2. Click **Projects** in the sidebar
3. Click **Create new** → **Project**
4. Fill: **Title**, **Slug** (click Generate), **Category**, **Short description**
5. Add **Main image** (optional, for homepage card)

### 2. Build the main content

The **Page content** field is an array of blocks. You add blocks in any order:

| Block type | Use case |
|------------|----------|
| **Text** | Paragraphs, headings (H2, H3), blockquotes |
| **Code** | Code snippets with language + optional title |
| **Thinking** | Process notes, reflections, "why I did this" |
| **Image** | Single image with optional caption |
| **Gallery** | Multiple images in a row/grid |
| **Artefact** | Links to deliverables (prototype, repo, doc) with badges |
| **Embed** | Videos, Figma, CodePen, etc. |

Order is free: one project might start with text, another with a code block. Each project tells its own story.

### 3. Add project updates

**Project updates** are a separate array. Each update has:

- **Date** — when it happened
- **Title** — short headline
- **Content** — rich text (or same block types as main content)

They render in reverse chronological order (newest first). Use them for:

- Milestones ("First playable", "Shipped v1")
- Reflections ("Switched approach because…")
- Artefact drops ("Published the design doc")

---

## Sanity schema structure (proposed)

```
Project (document)
├── title, slug, category, description  ← homepage metadata
├── mainImage                          ← card image
├── pageContent[]                      ← flexible blocks (main content)
│   ├── text (portable text)
│   ├── code (language, code, title)
│   ├── thinking (label, text)
│   ├── image (image, caption)
│   ├── gallery (images[])
│   ├── artefact (title, url, badges[])
│   └── embed (url)
└── updates[]                          ← project updates
    ├── date
    ├── title
    └── content (portable text or blocks)
```

### Block types in detail

**Code block**
- `language` — python, javascript, etc.
- `code` — raw code string
- `title` — optional, e.g. "order_parser.py"

**Thinking block**
- `label` — e.g. "Process note", "Reflection"
- `text` — the note

**Artefact block**
- `title` — "Prototype", "Design doc"
- `url` — link
- `badges` — ["Prototype", "Code"] for visual tags

**Gallery block**
- `images[]` — array of image + caption

---

## Frontend rendering

The frontend fetches the project and iterates over `pageContent`. For each block:

```js
pageContent.forEach(block => {
  switch (block._type) {
    case 'text': renderPortableText(block); break
    case 'code': renderCodeBlock(block); break
    case 'thinking': renderThinkingBlock(block); break
    case 'image': renderImage(block); break
    // ...
  }
})
```

Same idea for `updates`: loop and render each update with its date, title, and content.

---

## Summary

| Concept | Implementation |
|---------|----------------|
| Flexible page structure | `pageContent` = array of block types |
| Main content | Text, code, thinking, images, galleries, artefacts, embeds |
| Project updates | `updates[]` with date, title, content |
| Creative showcase | Code blocks, process notes, artefact links |
| Per-project variation | You choose block order and mix per project |

The mock page (`Frontend/project-mock.html`) shows how this renders visually. Open it in a browser to see the layout.
