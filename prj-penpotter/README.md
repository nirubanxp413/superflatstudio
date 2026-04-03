# PenpotChat (Penpot + AI)

Penpot plugin: chat UI in an iframe, `plugin.ts` runs Penpot APIs. The assistant can create boards, rectangles, text, and ellipses via `postMessage` ↔ `penpot.ui`.

## Why two orchestration modes?

- **In-iframe (default):** [Vercel AI SDK](https://sdk.vercel.ai/) `generateText` + `tool()` + `stopWhen: stepCountIs(12)`. Runs fully in the plugin bundle (works with `https://penpot.app` loading `http://localhost:4400`).
- **Mastra sidecar:** [`@mastra/core`](https://mastra.ai) `Agent` in Node (`server/src/ws-server.ts`). Tool execution is forwarded to the iframe over **WebSocket**, because only `plugin.ts` may call `penpot.*`.

`@mastra/core` does not bundle cleanly for the Penpot iframe (Node built-ins such as `fs`, `child_process`, `path/posix`). Use the sidecar when you want a real Mastra agent.

## Quick start

```bash
cd prj-penpotter
cp .env.example .env
# Add VITE_LLM_API_KEY=sk-... OR use Mastra sidecar below
npm install
npm run build
npm run preview
```

In Penpot: **Plugins** (Ctrl/Cmd + Alt + P) → install manifest URL:

`http://localhost:4400/manifest.json`

### Mastra sidecar (optional)

```bash
export OPENAI_API_KEY=sk-...
cd server && npm install && npm start
```

In `.env` for the plugin build:

```
VITE_MASTRA_WS_URL=ws://127.0.0.1:3456
```

Rebuild the plugin. Chat traffic goes to Mastra on port **3456** (override with `PENPOTTER_MASTRA_PORT`).

## Dev workflow

The Penpot docs recommend rebuilding the plugin entry when it changes:

```bash
npm run dev
```

This runs `vite build --watch` and `vite preview` together.

## Layout

| Path | Role |
|------|------|
| `src/plugin.ts` | Penpot runtime: `penpot.ui`, shape creation |
| `src/ui/*` | React chat + AI tools → `parent.postMessage` |
| `public/manifest.json` | Plugin manifest |
| `server/src/ws-server.ts` | Optional Mastra + WebSocket bridge |
