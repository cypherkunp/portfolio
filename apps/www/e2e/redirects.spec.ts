import { expect, test } from '@playwright/test';

test.describe('legacy redirects', () => {
  for (const path of ['/connect', '/contacts']) {
    test(`${path} returns 308 to devvrat.uk with the security headers`, async ({ request }) => {
      const response = await request.get(path, { maxRedirects: 0 });

      expect(response.status()).toBe(308);
      expect(response.headers().location).toBe('https://devvrat.uk');
      expect(response.headers()['x-content-type-options']).toBe('nosniff');
      expect(response.headers()['x-frame-options']).toBe('DENY');
      expect(response.headers()['referrer-policy']).toBe('strict-origin-when-cross-origin');
    });
  }
});
