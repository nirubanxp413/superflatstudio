

# manifest.json
cat > manifest.json << 'EOF'
{
  "name": "PenpotChat",
  "description": "AI chat assistant for Penpot",
  "code": "/plugin.js",
  "icon": "/icon.png",
  "permissions": [
    "content:read",
    "content:write",
    "library:read",
    "user:read"
  ]
}
EOF

# package.json
cat > package.json << 'EOF'
{
  "name": "penpot-chat-plugin",
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite build --watch & vite preview",
    "build": "tsc && vite build"
  },
  "dependencies": {
    "@mastra/core": "latest",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "zod": "^3.22.0"
  },
  "devDependencies": {
    "@penpot/plugin-types": "latest",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "typescript": "^5.0.0",
    "vite": "^5.0.0",
    "@vitejs/plugin-react": "^4.0.0"
  }
}
EOF

# tsconfig.json
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "jsx": "react-jsx",
    "typeRoots": ["./node_modules/@types", "./node_modules/@penpot"],
    "types": ["plugin-types"],
    "outDir": "./dist"
  },
  "include": ["src"]
}
EOF

# vite.config.ts
cat > vite.config.ts << 'EOF'
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        plugin: 'src/plugin.ts',
        index: './index.html',
      },
      output: {
        entryFileNames: '[name].js',
      },
    },
  },
  preview: {
    port: 4400,
  },
});
EOF

# index.html
cat > index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>PenpotChat</title>
    <style>
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body { font-family: sans-serif; background: #1e1e1e; color: #fff; height: 100vh; }
    </style>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/ui/main.tsx"></script>
  </body>
</html>
EOF

# src/plugin.ts
cat > src/plugin.ts << 'EOF'
// This file runs in the Penpot runtime.
// ONLY this file can use the `penpot` global object.

penpot.ui.open('PenpotChat', 'index.html', { width: 340, height: 600 });

penpot.ui.onMessage(async (msg: { type: string; args: any }) => {
  let result: any = null;

  try {
    if (msg.type === 'createBoard') {
      const board = penpot.createBoard();
      board.name = msg.args.name ?? 'Board';
      board.x = msg.args.x ?? 0;
      board.y = msg.args.y ?? 0;
      board.width = msg.args.width ?? 360;
      board.height = msg.args.height ?? 640;
      result = { id: board.id, name: board.name };
    }

    if (msg.type === 'createRectangle') {
      const rect = penpot.createRectangle();
      rect.name = msg.args.name ?? 'Rectangle';
      rect.x = msg.args.x ?? 0;
      rect.y = msg.args.y ?? 0;
      rect.width = msg.args.width ?? 100;
      rect.height = msg.args.height ?? 100;
      if (msg.args.fillColor) rect.fills = [{ fillColor: msg.args.fillColor, fillOpacity: 1 }];
      if (msg.args.borderRadius) rect.borderRadius = msg.args.borderRadius;
      result = { id: rect.id };
    }

    if (msg.type === 'createText') {
      const text = penpot.createText(msg.args.text ?? '');
      if (text) {
        text.name = msg.args.name ?? 'Text';
        text.x = msg.args.x ?? 0;
        text.y = msg.args.y ?? 0;
        if (msg.args.fontSize) text.fontSize = String(msg.args.fontSize);
        if (msg.args.fillColor) text.fills = [{ fillColor: msg.args.fillColor, fillOpacity: 1 }];
        result = { id: text.id };
      }
    }

    if (msg.type === 'createEllipse') {
      const ellipse = penpot.createEllipse();
      ellipse.name = msg.args.name ?? 'Ellipse';
      ellipse.x = msg.args.x ?? 0;
      ellipse.y = msg.args.y ?? 0;
      ellipse.width = msg.args.width ?? 100;
      ellipse.height = msg.args.height ?? 100;
      if (msg.args.fillColor) ellipse.fills = [{ fillColor: msg.args.fillColor, fillOpacity: 1 }];
      result = { id: ellipse.id };
    }

    if (msg.type === 'getSelection') {
      result = penpot.selection.map(s => ({ id: s.id, name: s.name, type: s.type }));
    }

    if (msg.type === 'getCurrentPage') {
      const page = penpot.currentPage;
      result = page ? { id: page.id, name: page.name } : null;
    }

  } catch (err: any) {
    result = { error: err?.message ?? 'Unknown error' };
  }

  penpot.ui.sendMessage({ type: `${msg.type}:result`, result });
});
EOF

# src/ui/tools.ts
cat > src/ui/tools.ts << 'EOF'
// Bridge: sends commands to plugin.ts and waits for the result

export function sendCommand<T = any>(type: string, args: Record<string, unknown> = {}): Promise<T> {
  return new Promise((resolve, reject) => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type === `${type}:result`) {
        window.removeEventListener('message', handler);
        if (e.data.result?.error) {
          reject(new Error(e.data.result.error));
        } else {
          resolve(e.data.result as T);
        }
      }
    };
    window.addEventListener('message', handler);
    // Send to Penpot plugin runtime
    (window as any).parent.postMessage({ type, args }, '*');
  });
}
EOF

# src/ui/agent.ts
cat > src/ui/agent.ts << 'EOF'
import { Agent } from '@mastra/core/agent';
import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { sendCommand } from './tools';

// ── Tools ──────────────────────────────────────────────────────────────

const createBoardTool = createTool({
  id: 'createBoard',
  description: 'Creates a board (frame/artboard) on the Penpot canvas. Always create a board first as the container for a screen.',
  inputSchema: z.object({
    name: z.string().describe('Display name for the board'),
    x: z.number().default(0),
    y: z.number().default(0),
    width: z.number().default(360).describe('Width in px, default 360 for mobile'),
    height: z.number().default(640).describe('Height in px, default 640 for mobile'),
  }),
  execute: async ({ context }) => {
    const result = await sendCommand('createBoard', context);
    return result;
  },
});

const createRectangleTool = createTool({
  id: 'createRectangle',
  description: 'Creates a rectangle shape. Use for backgrounds, cards, input fields, buttons, dividers.',
  inputSchema: z.object({
    name: z.string().describe('Display name'),
    x: z.number(),
    y: z.number(),
    width: z.number(),
    height: z.number(),
    fillColor: z.string().optional().describe('Hex color e.g. #3B82F6'),
    borderRadius: z.number().optional().describe('Corner radius in px'),
  }),
  execute: async ({ context }) => sendCommand('createRectangle', context),
});

const createTextTool = createTool({
  id: 'createText',
  description: 'Creates a text element. Use for labels, headings, body copy, button labels.',
  inputSchema: z.object({
    name: z.string().describe('Layer name'),
    text: z.string().describe('The actual text content to display'),
    x: z.number(),
    y: z.number(),
    fontSize: z.number().optional().default(16),
    fillColor: z.string().optional().default('#000000'),
  }),
  execute: async ({ context }) => sendCommand('createText', context),
});

const createEllipseTool = createTool({
  id: 'createEllipse',
  description: 'Creates an ellipse or circle. Use for avatars, icons, decorative dots.',
  inputSchema: z.object({
    name: z.string(),
    x: z.number(),
    y: z.number(),
    width: z.number(),
    height: z.number(),
    fillColor: z.string().optional(),
  }),
  execute: async ({ context }) => sendCommand('createEllipse', context),
});

const getSelectionTool = createTool({
  id: 'getSelection',
  description: 'Returns the currently selected shapes on the canvas. Use to understand context before making changes.',
  inputSchema: z.object({}),
  execute: async () => sendCommand('getSelection'),
});

const getCurrentPageTool = createTool({
  id: 'getCurrentPage',
  description: 'Returns the current page name and id.',
  inputSchema: z.object({}),
  execute: async () => sendCommand('getCurrentPage'),
});

// ── Agent ──────────────────────────────────────────────────────────────

export function createPenpotAgent(apiKey: string) {
  return new Agent({
    name: 'PenpotDesignAgent',
    instructions: `You are a Penpot design assistant embedded inside the Penpot canvas.
When the user describes a UI screen, component, or layout:
1. Always start by creating a board as the container.
2. Break the design into rectangles (backgrounds, cards, inputs, buttons) and text elements.
3. Position elements relative to the board's top-left corner (x=0, y=0 is the board origin, but use absolute canvas coords).
4. Use mobile-first dimensions (360×640) by default unless the user specifies otherwise.
5. After creating shapes, describe briefly what you made.

Color conventions unless told otherwise:
- Primary button: fillColor #3B82F6, text #FFFFFF
- Background: #FFFFFF
- Secondary text: #6B7280
- Input background: #F3F4F6, border radius 8

Always call tools in sequence (board first, then children). Never skip createBoard.`,
    // TODO: replace with your actual model config
    // model: openai('gpt-4o') or anthropic('claude-3-5-sonnet') etc.
    model: {} as any,
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
EOF

# src/ui/main.tsx
cat > src/ui/main.tsx << 'EOF'
import { StrictMode, useState, useRef, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { createPenpotAgent } from './agent';

// TODO: Replace with your actual API key (use env var in production)
const API_KEY = import.meta.env.VITE_LLM_API_KEY ?? '';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hi! Describe a screen or component and I'll build it on your canvas." }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const agentRef = useRef(createPenpotAgent(API_KEY));

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setLoading(true);

    try {
      const response = await agentRef.current.generate([
        ...messages.map(m => ({ role: m.role, content: m.content })),
        { role: 'user', content: text },
      ]);
      setMessages(prev => [...prev, { role: 'assistant', content: response.text }]);
    } catch (err: any) {
      setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${err?.message}` }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>PenpotChat</div>
      <div style={styles.messages}>
        {messages.map((m, i) => (
          <div key={i} style={{ ...styles.bubble, ...(m.role === 'user' ? styles.userBubble : styles.assistantBubble) }}>
            {m.content}
          </div>
        ))}
        {loading && <div style={{ ...styles.bubble, ...styles.assistantBubble, opacity: 0.6 }}>
