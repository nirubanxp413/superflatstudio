import type { CSSProperties } from 'react';
import { StrictMode, useCallback, useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { runPenpotAgent } from './agent';
import { runPenpotAgentViaMastraWs } from './mastra-ws';
import { initThemeFromUrl, listenPenpotTheme } from './tools';

initThemeFromUrl();
listenPenpotTheme();

const API_KEY = import.meta.env.VITE_LLM_API_KEY ?? '';
const MASTRA_WS = import.meta.env.VITE_MASTRA_WS_URL ?? '';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const styles: Record<string, CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    background: 'var(--app-bg, #1e1e1e)',
    color: 'var(--app-fg, #fff)',
  },
  header: {
    padding: '12px 14px',
    borderBottom: '1px solid rgba(255,255,255,0.12)',
    fontWeight: 600,
    fontSize: 14,
    letterSpacing: '0.02em',
  },
  messages: {
    flex: 1,
    overflowY: 'auto',
    padding: 12,
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  bubble: {
    maxWidth: '92%',
    padding: '10px 12px',
    borderRadius: 8,
    fontSize: 13,
    lineHeight: 1.45,
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  },
  userBubble: {
    alignSelf: 'flex-end',
    background: '#0043CE',
    color: '#fff',
  },
  assistantBubble: {
    alignSelf: 'flex-start',
    background: 'rgba(255,255,255,0.08)',
    color: 'inherit',
  },
  composer: {
    display: 'flex',
    gap: 8,
    padding: 12,
    borderTop: '1px solid rgba(255,255,255,0.12)',
  },
  input: {
    flex: 1,
    padding: '10px 12px',
    borderRadius: 6,
    border: '1px solid rgba(255,255,255,0.2)',
    background: 'rgba(0,0,0,0.25)',
    color: 'inherit',
    fontSize: 13,
  },
  button: {
    padding: '10px 16px',
    borderRadius: 6,
    border: 'none',
    background: '#0043CE',
    color: '#fff',
    fontWeight: 600,
    fontSize: 13,
    cursor: 'pointer',
  },
  buttonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  hint: {
    padding: '0 12px 10px',
    fontSize: 11,
    opacity: 0.55,
  },
};

function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi! Describe a screen or component and I'll build it on your canvas.",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;
    if (!MASTRA_WS && !API_KEY) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            'Either set VITE_MASTRA_WS_URL (and run `cd server && npm start`) or set VITE_LLM_API_KEY for in-iframe chat, then rebuild.',
        },
      ]);
      return;
    }

    setInput('');
    const history = [...messages, { role: 'user' as const, content: text }];
    setMessages(history);
    setLoading(true);

    try {
      const modelMessages = history.map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      }));

      const text = MASTRA_WS
        ? await runPenpotAgentViaMastraWs(MASTRA_WS, modelMessages)
        : await runPenpotAgent(API_KEY, modelMessages);
      setMessages((prev) => [...prev, { role: 'assistant', content: text || '(no text)' }]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setMessages((prev) => [...prev, { role: 'assistant', content: `Error: ${msg}` }]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages]);

  return (
    <div style={styles.container}>
      <div style={styles.header}>PenpotChat</div>
      {!MASTRA_WS && !API_KEY ? (
        <div style={styles.hint}>Set VITE_MASTRA_WS_URL or VITE_LLM_API_KEY in .env, then rebuild.</div>
      ) : null}
      {MASTRA_WS ? <div style={styles.hint}>Mastra sidecar: {MASTRA_WS}</div> : null}
      <div style={styles.messages}>
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              ...styles.bubble,
              ...(m.role === 'user' ? styles.userBubble : styles.assistantBubble),
            }}
          >
            {m.content}
          </div>
        ))}
        {loading ? (
          <div style={{ ...styles.bubble, ...styles.assistantBubble, opacity: 0.6 }}>Thinking…</div>
        ) : null}
        <div ref={bottomRef} />
      </div>
      <div style={styles.composer}>
        <input
          style={styles.input}
          value={input}
          placeholder="Describe your layout…"
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              void send();
            }
          }}
        />
        <button
          type="button"
          style={{ ...styles.button, ...(loading ? styles.buttonDisabled : {}) }}
          disabled={loading}
          onClick={() => void send()}
        >
          Send
        </button>
      </div>
    </div>
  );
}

const rootEl = document.getElementById('root');
if (rootEl) {
  createRoot(rootEl).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
