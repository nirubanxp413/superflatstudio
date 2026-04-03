/**
 * Mastra Agent sidecar: runs `@mastra/core` in Node and forwards tool execution to the
 * Penpot plugin iframe over WebSocket (the iframe runs `sendCommand` → `plugin.ts`).
 *
 * Usage:
 *   export OPENAI_API_KEY=sk-...
 *   cd server && npm install && npm start
 *
 * In the plugin `.env`:
 *   VITE_MASTRA_WS_URL=ws://127.0.0.1:3456
 */
import { createOpenAI } from '@ai-sdk/openai';
import { Agent } from '@mastra/core/agent';
import { createTool } from '@mastra/core/tools';
import { randomUUID } from 'node:crypto';
import { WebSocketServer, type WebSocket } from 'ws';
import { z } from 'zod';

const PORT = Number(process.env.PENPOTTER_MASTRA_PORT ?? 3456);
const apiKey = process.env.OPENAI_API_KEY ?? '';

type Pending = { resolve: (v: unknown) => void; reject: (e: Error) => void };

function createBridge(ws: WebSocket, pending: Map<string, Pending>) {
  return {
    request(tool: string, args: Record<string, unknown>) {
      return new Promise<unknown>((resolve, reject) => {
        const requestId = randomUUID();
        pending.set(requestId, { resolve, reject });
        ws.send(JSON.stringify({ type: 'exec', tool, args, requestId }));
      });
    },
  };
}

function createPenpotMastraAgent(bridge: ReturnType<typeof createBridge>) {
  const openai = createOpenAI({ apiKey: apiKey || 'missing-key' });

  const createBoardTool = createTool({
    id: 'createBoard',
    description:
      'Creates a board (frame/artboard). Prefer as the container for a full screen.',
    inputSchema: z.object({
      name: z.string(),
      x: z.number().default(0),
      y: z.number().default(0),
      width: z.number().default(360),
      height: z.number().default(640),
    }),
    execute: async (input) => bridge.request('createBoard', input as Record<string, unknown>),
  });

  const createRectangleTool = createTool({
    id: 'createRectangle',
    description: 'Creates a rectangle.',
    inputSchema: z.object({
      name: z.string(),
      x: z.number(),
      y: z.number(),
      width: z.number(),
      height: z.number(),
      fillColor: z.string().optional(),
      borderRadius: z.number().optional(),
    }),
    execute: async (input) => bridge.request('createRectangle', input as Record<string, unknown>),
  });

  const createTextTool = createTool({
    id: 'createText',
    description: 'Creates a text element.',
    inputSchema: z.object({
      name: z.string(),
      text: z.string(),
      x: z.number(),
      y: z.number(),
      fontSize: z.number().optional().default(16),
      fillColor: z.string().optional().default('#000000'),
    }),
    execute: async (input) => bridge.request('createText', input as Record<string, unknown>),
  });

  const createEllipseTool = createTool({
    id: 'createEllipse',
    description: 'Creates an ellipse or circle.',
    inputSchema: z.object({
      name: z.string(),
      x: z.number(),
      y: z.number(),
      width: z.number(),
      height: z.number(),
      fillColor: z.string().optional(),
    }),
    execute: async (input) => bridge.request('createEllipse', input as Record<string, unknown>),
  });

  const getSelectionTool = createTool({
    id: 'getSelection',
    description: 'Returns the current selection.',
    inputSchema: z.object({}),
    execute: async () => bridge.request('getSelection', {}),
  });

  const getCurrentPageTool = createTool({
    id: 'getCurrentPage',
    description: 'Returns the current page.',
    inputSchema: z.object({}),
    execute: async () => bridge.request('getCurrentPage', {}),
  });

  return new Agent({
    id: 'penpot-design-agent',
    name: 'PenpotDesignAgent',
    instructions: `You are a Penpot design assistant inside the Penpot canvas.
When the user describes a UI screen, component, or layout:
1. Start by creating a board as the container when building a full screen.
2. Break the design into rectangles and text.
3. Use coherent x/y positions (origin top-left).
4. Default to mobile frames 360×640 unless specified otherwise.
5. After using tools, briefly summarize what you created.

Color hints: primary #3B82F6, background #FFFFFF, muted text #6B7280, input #F3F4F6, radius 8.`,
    model: openai('gpt-4o-mini'),
    tools: {
      createBoard: createBoardTool,
      createRectangle: createRectangleTool,
      createText: createTextTool,
      createEllipse: createEllipseTool,
      getSelection: getSelectionTool,
      getCurrentPage: getCurrentPageTool,
    },
  });
}

const wss = new WebSocketServer({ port: PORT });

wss.on('connection', (ws) => {
  const pending = new Map<string, Pending>();
  const bridge = createBridge(ws, pending);

  ws.on('message', async (raw) => {
    let msg: Record<string, unknown>;
    try {
      msg = JSON.parse(raw.toString()) as Record<string, unknown>;
    } catch {
      ws.send(JSON.stringify({ type: 'error', message: 'Invalid JSON' }));
      return;
    }

    if (msg.type === 'result' && typeof msg.requestId === 'string') {
      const p = pending.get(msg.requestId);
      if (!p) return;
      pending.delete(msg.requestId);
      if (msg.error) {
        p.reject(new Error(String(msg.error)));
      } else {
        p.resolve(msg.result);
      }
      return;
    }

    if (msg.type === 'generate' && Array.isArray(msg.messages)) {
      if (!apiKey) {
        ws.send(JSON.stringify({ type: 'error', message: 'Set OPENAI_API_KEY on the server' }));
        return;
      }
      const agent = createPenpotMastraAgent(bridge);
      try {
        const out = await agent.generate(msg.messages as never);
        if (out.error) {
          throw out.error;
        }
        ws.send(JSON.stringify({ type: 'assistant-done', text: out.text ?? '' }));
      } catch (e) {
        const message = e instanceof Error ? e.message : String(e);
        ws.send(JSON.stringify({ type: 'error', message }));
      }
    }
  });
});

console.log(`Penpotter Mastra sidecar listening on ws://127.0.0.1:${PORT}`);
