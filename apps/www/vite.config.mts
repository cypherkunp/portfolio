import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react';
import mdx from 'fumadocs-mdx/vite';
import { defineConfig } from 'vite';

import * as sourceConfig from './source.config.ts';

const root = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

function exact(find: string, replacement: string) {
  return { find: new RegExp(`^${find}$`), replacement };
}

export default defineConfig(async () => ({
  server: {
    port: 3333,
    host: '127.0.0.1',
  },
  preview: {
    port: 3333,
    host: '127.0.0.1',
  },
  resolve: {
    tsconfigPaths: true,
    alias: [
      { find: /^@\//, replacement: `${path.join(root, 'src')}/` },
      exact('node:path', path.join(path.dirname(require.resolve('pathe')), 'index.mjs')),
      exact('next-intl/server', path.join(root, 'src/shims/next-intl-server.ts')),
      exact('next-intl', path.join(root, 'src/shims/next-intl.tsx')),
      exact('server-only', path.join(root, 'src/test/stubs/server-only.ts')),
      // Vite's SSR runner loads exifr's CJS build, which has no named `parse` export.
      exact('exifr', require.resolve('exifr/dist/full.esm.mjs')),
    ],
  },
  plugins: [
    await mdx(sourceConfig),
    tailwindcss(),
    tanstackStart({
      router: {
        quoteStyle: 'single',
        semicolons: true,
      },
    }),
    viteReact(),
  ],
}));
