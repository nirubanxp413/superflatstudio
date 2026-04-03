/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_LLM_API_KEY: string;
  /** When set (e.g. ws://127.0.0.1:3456), chat uses the Node Mastra sidecar instead of in-iframe AI SDK. */
  readonly VITE_MASTRA_WS_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
