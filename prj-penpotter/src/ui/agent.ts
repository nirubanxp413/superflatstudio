import { createOpenAI } from '@ai-sdk/openai';
import { generateText, stepCountIs, tool } from 'ai';
import { z } from 'zod';
import { sendCommand } from './tools';

/**
 * Penpot design assistant: LLM + tools orchestrated in the plugin iframe.
 *
 * Note: `@mastra/core` targets Node and pulls `fs`, `child_process`, `path/posix`, etc.,
 * which break Vite’s browser bundle for Penpot. This module mirrors the same tool set and
 * prompt using the Vercel AI SDK (`generateText` + `maxSteps`), which runs cleanly in the iframe.
 *
 * For a Mastra-backed deployment, run a small Node sidecar with `@mastra/core` and proxy
 * tool execution to this UI over WebSocket or a continue-turn HTTP API.
 */

const instructions = `You are a Penpot design assistant inside the Penpot canvas.
When the user describes a UI screen, component, or layout:
1. Start by creating a board as the container when building a full screen.
2. Break the design into rectangles (backgrounds, cards, inputs, buttons) and text.
3. Use coherent x/y positions on the canvas (origin top-left).
4. Default to mobile frames 360×640 unless the user specifies otherwise.
5. After using tools, briefly summarize what you created.

Color hints unless overridden:
- Primary button area: #3B82F6
- Page background: #FFFFFF
- Muted text: #6B7280
- Input fill: #F3F4F6, border radius 8

Call tools in a sensible order (often board first for full screens).`;

function penpotTools() {
  return {
    createBoard: tool({
      description:
        'Creates a board (frame/artboard). Prefer as the container for a full screen.',
      inputSchema: z.object({
        name: z.string().describe('Display name for the board'),
        x: z.number().default(0),
        y: z.number().default(0),
        width: z.number().default(360).describe('Width in px, default mobile'),
        height: z.number().default(640).describe('Height in px, default mobile'),
      }),
      execute: async (input) => sendCommand('createBoard', input as Record<string, unknown>),
    }),
    createRectangle: tool({
      description: 'Creates a rectangle for backgrounds, cards, inputs, buttons, dividers.',
      inputSchema: z.object({
        name: z.string().describe('Display name'),
        x: z.number(),
        y: z.number(),
        width: z.number(),
        height: z.number(),
        fillColor: z.string().optional().describe('Hex color e.g. #3B82F6'),
        borderRadius: z.number().optional().describe('Corner radius in px'),
      }),
      execute: async (input) => sendCommand('createRectangle', input as Record<string, unknown>),
    }),
    createText: tool({
      description: 'Creates a text element for labels, headings, body copy, button labels.',
      inputSchema: z.object({
        name: z.string().describe('Layer name'),
        text: z.string().describe('The text content to display'),
        x: z.number(),
        y: z.number(),
        fontSize: z.number().optional().default(16),
        fillColor: z.string().optional().default('#000000'),
      }),
      execute: async (input) => sendCommand('createText', input as Record<string, unknown>),
    }),
    createEllipse: tool({
      description: 'Creates an ellipse or circle for avatars, icons, decorative dots.',
      inputSchema: z.object({
        name: z.string(),
        x: z.number(),
        y: z.number(),
        width: z.number(),
        height: z.number(),
        fillColor: z.string().optional(),
      }),
      execute: async (input) => sendCommand('createEllipse', input as Record<string, unknown>),
    }),
    getSelection: tool({
      description: 'Returns the currently selected shapes. Use for context before changes.',
      inputSchema: z.object({}),
      execute: async () => sendCommand('getSelection'),
    }),
    getCurrentPage: tool({
      description: 'Returns the current page name and id.',
      inputSchema: z.object({}),
      execute: async () => sendCommand('getCurrentPage'),
    }),
  };
}

export async function runPenpotAgent(apiKey: string, messages: { role: 'user' | 'assistant'; content: string }[]) {
  const openai = createOpenAI({ apiKey: apiKey || 'missing-api-key' });

  const { text } = await generateText({
    model: openai('gpt-4o-mini'),
    system: instructions,
    messages,
    tools: penpotTools(),
    stopWhen: stepCountIs(12),
  });

  return text ?? '';
}
