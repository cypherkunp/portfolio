import path from 'node:path';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import mdx from 'fumadocs-mdx/vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

import * as sourceConfig from './source.config.ts';

const root = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(async () => ({
  plugins: [
    // Keep generated indexes out of `.source`. That directory is the Next.js output.
    await mdx(sourceConfig, { outDir: 'node_modules/.cache/fumadocs-vitest' }),
    tsconfigPaths(),
    react(),
  ],
  resolve: {
    alias: {
      'server-only': path.join(root, 'src/test/stubs/server-only.ts'),
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['node_modules', '.next'],
  },
}));
