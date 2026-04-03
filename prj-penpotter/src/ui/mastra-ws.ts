import { sendCommand } from './tools';

type ChatMessage = { role: 'user' | 'assistant'; content: string };

/**
 * Runs chat through the Node Mastra sidecar (`server/src/ws-server.ts`).
 * Tool calls are executed in this iframe via `sendCommand` → `plugin.ts`.
 */
export function runPenpotAgentViaMastraWs(wsUrl: string, messages: ChatMessage[]): Promise<string> {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(wsUrl);

    const cleanup = () => {
      try {
        ws.close();
      } catch {
        /* ignore */
      }
    };

    ws.onerror = () => {
      cleanup();
      reject(new Error(`WebSocket error connecting to ${wsUrl}`));
    };

    ws.onopen = () => {
      ws.send(JSON.stringify({ type: 'generate', messages }));
    };

    ws.onmessage = async (ev) => {
      let msg: Record<string, unknown>;
      try {
        msg = JSON.parse(String(ev.data)) as Record<string, unknown>;
      } catch {
        cleanup();
        reject(new Error('Invalid JSON from Mastra sidecar'));
        return;
      }

      if (msg.type === 'assistant-done') {
        cleanup();
        resolve(typeof msg.text === 'string' ? msg.text : '');
        return;
      }

      if (msg.type === 'error') {
        cleanup();
        reject(new Error(typeof msg.message === 'string' ? msg.message : 'Unknown server error'));
        return;
      }

      if (msg.type === 'exec' && typeof msg.requestId === 'string' && typeof msg.tool === 'string') {
        const args = (msg.args && typeof msg.args === 'object' ? msg.args : {}) as Record<string, unknown>;
        try {
          const result = await sendCommand(msg.tool, args);
          ws.send(JSON.stringify({ type: 'result', requestId: msg.requestId, result }));
        } catch (e) {
          const err = e instanceof Error ? e.message : String(e);
          ws.send(JSON.stringify({ type: 'result', requestId: msg.requestId, error: err }));
        }
      }
    };
  });
}
