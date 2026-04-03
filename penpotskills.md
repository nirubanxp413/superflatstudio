# Penpot MCP Skill

This skill file documents the Penpot MCP plugin interface for Claude. It is a living document — update it as patterns, gotchas, and proven recipes accumulate.

---

## 1. Tool Overview

Five tools are exposed via the Penpot MCP plugin:

| Tool | Purpose |
|---|---|
| `penpot:high_level_overview` | Read once per session before any other tool. Loads full API orientation. |
| `penpot:penpot_api_info` | Look up types/interfaces by name. Required before using an unfamiliar type. |
| `penpot:execute_code` | Run JavaScript in the plugin context. Primary workhorse. |
| `penpot:export_shape` | Export a shape to PNG or SVG for visual inspection. |
| `penpot:import_image` | Import a local image file as a Rectangle with an image fill. |

**Always call `high_level_overview` first.** It is a cheap call and prevents hallucinating API shapes.

---

## 2. Global Objects in `execute_code`

### `penpot` (type: `Penpot`)
The main API gateway.

```js
penpot.selection          // Shape[] — user's current selection
penpot.root               // Root shape of current page
penpot.currentPage        // Page object
penpot.currentFile        // File object { id, name }
penpot.library            // LibraryContext — colors, components, tokens
penpot.viewport           // Viewport
penpot.theme              // "dark" | "light"

// Shape factories
penpot.createRectangle()  // → Rectangle
penpot.createBoard()      // → Board
penpot.createEllipse()    // → Ellipse
penpot.createText(str)    // → Text | null
penpot.createPath()       // → Path

// Group / ungroup
penpot.group(shapes)      // → Group | null
penpot.ungroup(group)

// Alignment helpers
penpot.alignHorizontal(shapes, "center" | "left" | "right")
penpot.alignVertical(shapes, "center" | "top" | "bottom")
penpot.distributeHorizontal(shapes)
penpot.distributeVertical(shapes)

// Code generation
penpot.generateMarkup(shapes, { type: "html" | "svg" })
penpot.generateStyle(shapes, { type: "css", includeChildren: true })
```

### `penpotUtils`
Preferred over rolling your own traversal logic.

```js
penpotUtils.getPages()                          // { id, name }[]
penpotUtils.getPageById(id)                     // Page | null
penpotUtils.getPageByName(name)                 // Page | null
penpotUtils.shapeStructure(shape, maxDepth)     // nested { id, name, type, children?, layout? }
penpotUtils.findShapeById(id)                   // Shape | null
penpotUtils.findShape(predicate, root?)         // first match
penpotUtils.findShapes(predicate, root?)        // all matches
penpotUtils.isContainedIn(shape, container)     // boolean
penpotUtils.setParentXY(shape, px, py)          // position relative to parent
penpotUtils.analyzeDescendants(root, evaluator, maxDepth?)
penpotUtils.tokenOverview()                     // token set → type → names
penpotUtils.findTokenByName(name)               // Token | null
penpotUtils.findTokensByName(name)              // Token[]
penpotUtils.getTokenSet(token)                  // TokenSet | null
penpotUtils.addFlexLayout(container, dir)       // SAFE version — use when container already has children
```

### `storage`
Persistent across tool calls within a session. Use it heavily.

```js
storage.myBoard = board;          // save for later
storage.helpers = { ... };        // build up a library of util functions
```

---

## 3. Core Types

### Page
```ts
page.id, page.name
page.root                          // root Shape
page.getShapeById(id)
page.findShapes({ name?, nameLike?, type? })
page.flows, page.rulerGuides
page.createFlow(name, board)
page.getPluginData(key) / setPluginData(key, value)
page.getSharedPluginData(ns, key) / setSharedPluginData(ns, key, value)
```

### ShapeBase (inherited by all shapes)
```ts
shape.id, shape.name, shape.type
shape.x, shape.y                   // top-left in page coords (writable)
shape.width, shape.height          // READ-ONLY — use shape.resize(w, h)
shape.bounds                       // { x, y, width, height } READ-ONLY
shape.parentX, shape.parentY       // READ-ONLY — use penpotUtils.setParentXY()
shape.boardX, shape.boardY         // READ-ONLY

shape.fills: Fill[]                // replace entire array to change
shape.strokes: Stroke[]
shape.shadows: Shadow[]
shape.blur?: Blur

shape.opacity, shape.blendMode
shape.rotation, shape.flipX, shape.flipY
shape.borderRadius                 // uniform; individual: borderRadiusTopLeft etc.
shape.hidden, shape.visible, shape.blocked

shape.resize(w, h)
shape.rotate(angle, center?)
shape.clone()                      // exact copy, same position
shape.remove()                     // permanent destroy

// Z-order
shape.bringToFront() / sendToBack() / bringForward() / sendBackward()
shape.setParentIndex(i)            // 0-based

// Component API
shape.isComponentInstance()
shape.detach()
shape.clone()

// Token API
shape.applyToken(token, properties[])
shape.tokens                       // { fill: "token.name", ... }

// Interactions
shape.addInteraction(trigger, action, delay?)
shape.removeInteraction(interaction)
```

### Board (Frame)
```ts
board.type === "board"
board.children: Shape[]
board.appendChild(child)
board.insertChild(index, child)
board.clipContent: boolean
board.horizontalSizing, board.verticalSizing   // "auto" | "fix"
board.flex?: FlexLayout
board.grid?: GridLayout
board.addFlexLayout(): FlexLayout
board.addGridLayout(): GridLayout
board.isVariantContainer(): boolean
```

### Text
```ts
text.type === "text"
text.characters                    // rendered string (writable)
text.growType                      // "fixed" | "auto-width" | "auto-height"
text.fontSize, text.fontFamily, text.fontWeight
text.fontStyle, text.lineHeight, text.letterSpacing
text.textTransform, text.textDecoration
text.align, text.verticalAlign, text.direction
text.textBounds                    // actual rendered bounding box (async — wait 100ms)
text.getRange(start, end): TextRange
text.applyTypography(libTypography)
// NOTE: resize() sets growType to "fixed". Reset to "auto-*" if needed.
```

### Fill
```ts
{ fillColor?: "#RRGGBB",   // hex CAPS only
  fillOpacity?: number,    // 0–1, defaults to 1
  fillColorGradient?: Gradient,
  fillImage?: ImageData }
// Replace the whole array — individual fill objects are read-only
shape.fills = [{ fillColor: "#FF0000", fillOpacity: 1 }];
shape.fills = [];  // transparent
```

### FlexLayout
```ts
board.addFlexLayout()           // call on empty board
penpotUtils.addFlexLayout(board, dir)  // call when board already has children — preserves order

flex.dir: "row" | "column" | "row-reverse" | "column-reverse"
flex.wrap: "wrap" | "nowrap"
flex.rowGap, flex.columnGap
flex.verticalPadding, flex.horizontalPadding
flex.topPadding, flex.rightPadding, flex.bottomPadding, flex.leftPadding
flex.alignItems, flex.justifyContent
flex.horizontalSizing, flex.verticalSizing  // "fill" | "auto" | "fit-content"
flex.remove()
flex.appendChild(child)
```

### LayoutChildProperties (child within flex/grid)
```ts
child.layoutChild.absolute: boolean        // if true, positioned manually with x/y
child.layoutChild.horizontalSizing         // "fix" | "auto" | "fill"
child.layoutChild.verticalSizing
child.layoutChild.topMargin, rightMargin, bottomMargin, leftMargin
child.layoutChild.minWidth, maxWidth, minHeight, maxHeight
```

---

## 4. Asset Libraries

```js
penpot.library.local                    // current file's library
penpot.library.connected                // connected external libraries[]
penpot.library.availableLibraries()    // Promise<LibrarySummary[]>
penpot.library.connectLibrary(id)      // Promise<Library>

// Library object
lib.components: LibraryComponent[]
lib.colors: LibraryColor[]
lib.typographies: LibraryTypography[]

// Colors
const c = penpot.library.local.createColor();
c.name = "Brand Primary"; c.color = "#0066FF";

// Typographies
const t = penpot.library.local.createTypography();
t.name = "Heading Large";

// Components
const comp = lib.components.find(c => c.name.includes("Button"));
const instance = comp.instance();   // creates a Shape (often a Board)
const main = comp.mainInstance();   // reference to main component shape
penpot.library.local.createComponent([shape1, shape2]); // → LibraryComponent
```

---

## 5. Design Tokens

```js
const catalog = penpot.library.local.tokens;
catalog.sets: TokenSet[]
catalog.themes: TokenTheme[]
catalog.addSet(name): TokenSet
catalog.addTheme(group, name): TokenTheme

// TokenSet
set.active                           // bool — inactive sets don't affect shapes
set.toggleActive()
set.tokens: Token[]
set.addToken(type, name, value)      // type: "color"|"dimension"|"spacing"|"borderRadius"|...

// Apply
shape.applyToken(token, ["fill"])    // TokenProperty[]
// Wait ~100ms after application
```

---

## 6. Common Patterns

### Explore current page
```js
const pages = penpotUtils.getPages();
const page = penpot.currentPage;
return penpotUtils.shapeStructure(page.root, 3);
```

### Find shapes by type
```js
const texts = penpotUtils.findShapes(s => s.type === "text", penpot.root);
const boards = penpotUtils.findShapes(s => s.type === "board", penpot.root);
const images = penpotUtils.findShapes(
  s => s.type === "image" || s.fills?.some(f => f.fillImage),
  penpot.root
);
```

### Create a board with flex layout containing text
```js
const board = penpot.createBoard();
board.name = "Card";
board.resize(320, 160);
board.x = 100; board.y = 100;
board.fills = [{ fillColor: "#1A1A2E", fillOpacity: 1 }];
board.addFlexLayout();
board.flex.dir = "column";
board.flex.verticalPadding = 24;
board.flex.horizontalPadding = 24;
board.flex.rowGap = 12;

const title = penpot.createText("Hello World");
title.fills = [{ fillColor: "#FFFFFF", fillOpacity: 1 }];
title.fontSize = "24";
board.appendChild(title);
```

### Position shape relative to parent
```js
// NEVER set parentX/parentY directly — they are read-only
penpotUtils.setParentXY(shape, 16, 24);  // correct
```

### Save and reuse selection across calls
```js
// Call 1
storage.target = penpot.selection[0];

// Call 2
const shape = storage.target;
shape.fills = [{ fillColor: "#FF0000", fillOpacity: 1 }];
```

### Cross-page work
```js
const page = penpotUtils.getPageByName("sf-page");
const structure = penpotUtils.shapeStructure(page.root, 2);
```

---

## 7. Known Gotchas

| Situation | What goes wrong | Fix |
|---|---|---|
| `shape.width = 200` | Silently does nothing | Use `shape.resize(200, shape.height)` |
| `shape.parentX = 50` | Read-only, no error | Use `penpotUtils.setParentXY(shape, 50, ...)` |
| `shape.fills[0].fillColor = "#F00"` | Array contents are read-only | Replace entire array: `shape.fills = [...]` |
| `board.addFlexLayout()` on a board with existing children | Children reordered arbitrarily | Use `penpotUtils.addFlexLayout(board, dir)` instead |
| Text resize via `text.resize(w, h)` | Sets `growType` to `"fixed"` — text may clip | Reset: `text.growType = "auto-height"` after resize |
| Text bounding box read immediately after creation | `textBounds` not yet updated | `await new Promise(r => setTimeout(r, 100))` then read |
| `shape.remove()` on component descendant | Shape made invisible, not deleted | Detach the component first: `shape.detach()` |
| Assuming `penpot.selection` persists across calls | Selection can change between calls | Store immediately: `storage.sel = penpot.selection[0]` |
| Hex color lowercase | May behave unexpectedly | Always use CAPS: `"#FF5533"` not `"#ff5533"` |
| Logging returned data | Duplicates output | Never `console.log` what you `return` |

---

## 8. Your Penpot File (Superflat Studio)

**File ID:** `1379938b-a15b-8002-8005-ff00f3cec91f`  
**File Name:** Superflat Studio

### Pages
| Page Name | ID |
|---|---|
| `sf-page` *(default)* | `1379938b-a15b-8002-8005-ff00f3cec920` |
| `app-penpotmcp` | `a6716c29-78c0-80a4-8007-bb4a5fdd957d` |
| `app-tovmod` | `a6716c29-78c0-80a4-8007-bb4f98610d66` |
| `archive` | `a6716c29-78c0-80a4-8007-bb4fe9e45179` |
| `sf-general` | `a6716c29-78c0-80a4-8007-bb4ff93250cc` |

### `sf-page` Top-level Boards
- **Projects** — portfolio project card layout with rectangles, numbered items, tagline text
- **Sketches** — sketch card layout; mirrors Projects structure
- **Home** — hero/landing board; includes Logo (bool shape), nav links (WORK>, THOUGHT>, ABOUT>), masked background
- **Slide 16:9** — presentation slide format with THOUGHT, ABOUT, navigation text

---

## 9. Changelog

| Date | Entry |
|---|---|
| 2026-03-19 | Initial file created from MCP API introspection + live Superflat Studio file scan |

---

*Update this file whenever a new pattern, gotcha, or file-specific note is discovered.*