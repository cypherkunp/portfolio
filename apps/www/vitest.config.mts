import path from 'node:path';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import mdx from 'fumadocs-mdx/vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

import * as sourceConfig from './source.config.ts';

const root = path.dirname(fileURLToPath(import.meta.url));

function exact(find: string, replacement: string) {
  return { find: new RegExp(`^${find}$`), replacement };
}

export default defineConfig(async () => ({
  plugins: [
    // Vitest must not rewrite apps/www/.source. That directory is the app's fumadocs output.
    await mdx(sourceConfig, { outDir: 'node_modules/.cache/fumadocs-vitest' }),
    tsconfigPaths(),
    react(),
  ],
  resolve: {
    alias: [
      exact('next-intl/server', path.join(root, 'src/shims/next-intl-server.ts')),
      exact('next-intl', path.join(root, 'src/shims/next-intl.tsx')),
      exact('server-only', path.join(root, 'src/test/stubs/server-only.ts')),
    ],
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['node_modules'],
  },
}));
