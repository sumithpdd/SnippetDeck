import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig(({ mode }) => {
  // Load .env.local so the extension shares the same Firebase credentials
  const env = loadEnv(mode, process.cwd(), '');

  // Map NEXT_PUBLIC_* vars to process.env.* so src/lib/firebase.ts works unchanged
  const define: Record<string, string> = {};
  for (const [key, value] of Object.entries(env)) {
    if (key.startsWith('NEXT_PUBLIC_')) {
      define[`process.env.${key}`] = JSON.stringify(value);
    }
  }

  return {
    plugins: [react()],
    define,
    root: resolve(__dirname, 'extension'),
    publicDir: resolve(__dirname, 'extension/public'),
    build: {
      outDir: resolve(__dirname, 'dist-ext'),
      emptyOutDir: true,
      rollupOptions: {
        input: resolve(__dirname, 'extension/index.html'),
      },
    },
    resolve: {
      alias: { '@': resolve(__dirname, 'src') },
    },
  };
});
