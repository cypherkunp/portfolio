import { defineConfig } from 'unlighthouse';

/**
 * Refer to the documentation for more information:
 * https://unlighthouse.dev/guide/guides/config
 */
export default defineConfig({
  site: 'devvrat.cc',
  ci: {
    budget: {
      performance: 90,
      accessibility: 90,
      'best-practices': 90,
      seo: 90,
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
