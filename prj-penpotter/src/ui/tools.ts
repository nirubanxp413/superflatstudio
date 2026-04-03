const COMMAND_TIMEOUT_MS = 60_000;

/** Sends a command to `plugin.ts` via `parent.postMessage` and waits for `penpot.ui.sendMessage` back to this iframe. */
export function sendCommand<T = unknown>(
  type: string,
  args: Record<string, unknown> = {},
): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = window.setTimeout(() => {
      window.removeEventListener('message', handler);
      reject(new Error(`Command "${type}" timed out after ${COMMAND_TIMEOUT_MS}ms`));
    }, COMMAND_TIMEOUT_MS);

    const handler = (e: MessageEvent) => {
      const data = e.data;
      if (!data || typeof data !== 'object') return;
      if (data.source === 'penpot' && data.type === 'themechange') return;
      if (data.type === `${type}:result`) {
        window.clearTimeout(timer);
        window.removeEventListener('message', handler);
        const res = data.result as { error?: string } | T;
        if (res && typeof res === 'object' && 'error' in res && typeof (res as { error: string }).error === 'string') {
          reject(new Error((res as { error: string }).error));
        } else {
          resolve(res as T);
        }
      }
    };

    window.addEventListener('message', handler);
    window.parent.postMessage({ type, args }, '*');
  });
}

/** Apply Penpot host theme from URL query (set by `plugin.ts` open URL). */
export function initThemeFromUrl(): void {
  const searchParams = new URLSearchParams(window.location.search);
  document.documentElement.dataset.theme = searchParams.get('theme') ?? 'light';
}

export function listenPenpotTheme(): void {
  window.addEventListener('message', (event) => {
    const d = event.data;
    if (d?.source === 'penpot' && d.type === 'themechange') {
      document.documentElement.dataset.theme = d.theme ?? 'light';
    }
  });
}
