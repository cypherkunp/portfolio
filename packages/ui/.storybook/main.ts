import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { StorybookConfig } from '@storybook/react-vite';
import tailwindcss from '@tailwindcss/vite';

const storybookDir = path.dirname(fileURLToPath(import.meta.url));

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-a11y', '@storybook/addon-docs'],
  framework: '@storybook/react-vite',
  async viteFinal(viteConfig) {
    viteConfig.plugins = [...(viteConfig.plugins ?? []), tailwindcss()];
    viteConfig.resolve ??= {};
    viteConfig.resolve.alias = {
      ...(viteConfig.resolve.alias as Record<string, string> | undefined),
      'next/link': path.join(storybookDir, 'mocks/next-link.tsx'),
      'next/image': path.join(storybookDir, 'mocks/next-image.tsx'),
      'next/navigation': path.join(storybookDir, 'mocks/next-navigation.ts'),
      'next/font/google': path.join(storybookDir, 'mocks/next-font.ts'),
    };
    return viteConfig;
  },
};

export default config;
