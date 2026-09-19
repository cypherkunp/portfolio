import { expect, test } from '@playwright/test';

import { waitForDevReady } from './ready';

test.describe('posts', () => {
  test('opens a post from the home catalog', async ({ page }) => {
    await page.goto('/');
    await waitForDevReady(page);
    await page.getByRole('link', { name: /Hello world/ }).click();
    await page.waitForURL(/\/posts\/hello-world$/);
    await waitForDevReady(page);
    await expect(page.getByRole('heading', { level: 1, name: 'Hello world' })).toBeVisible();
  });
});
