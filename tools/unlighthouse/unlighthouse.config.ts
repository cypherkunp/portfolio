export default {
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
    samples: 3,
    device: 'desktop',
    throttle: false,
  },
  debug: true,
};
