import path from 'node:path';
import { fileURLToPath } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react';
import mdx from 'fumadocs-mdx/vite';
import { defineConfig } from 'vite';

import * as sourceConfig from './source.config.ts';

const root = path.dirname(fileURLToPath(import.meta.url));

function exact(find: string, replacement: string) {
  return { find: new RegExp(`^${find}$`), replacement };
}

export default defineConfig(async () => ({
  server: {
    port: 3334,
  },
  resolve: {
    tsconfigPaths: true,
    alias: [
      { find: /^@\//, replacement: `${path.join(root, 'src')}/` },
      exact('node:path', 'pathe'),
      exact('next/link', path.join(root, 'src/shims/next-link.tsx')),
      exact('next/navigation', path.join(root, 'src/shims/next-navigation.ts')),
      exact('next/image', path.join(root, 'src/shims/next-image.tsx')),
      exact('next/font/google', path.join(root, 'src/shims/next-font.ts')),
      exact('next-intl/server', path.join(root, 'src/shims/next-intl-server.ts')),
      exact('next-intl', path.join(root, 'src/shims/next-intl.tsx')),
      exact('flags/next', path.join(root, 'src/shims/flags-next.ts')),
      exact('server-only', path.join(root, 'src/test/stubs/server-only.ts')),
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
