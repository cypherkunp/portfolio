import { defineConfig } from 'unlighthouse';

/**
 * Refer to the documentation for more information:
 * https://unlighthouse.dev/guide/guides/config
 */
export default defineConfig({
  site: 'devvrat.cc',
  ci: {
    budget: {
      performance: 0.9,
      accessibility: 0.9,
      'best-practices': 0.9,
      seo: 0.9,
    },
  },
  scanner: {
    exclude: ['/.*?pdf', '.*/amp', 'en-*', '.*?mp4'],
    samples: 1,
    device: 'desktop',
    throttle: false,
  },
  debug: true,
});
