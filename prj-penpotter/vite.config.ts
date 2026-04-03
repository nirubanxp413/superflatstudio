import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

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
    strictPort: true,
  },
});
