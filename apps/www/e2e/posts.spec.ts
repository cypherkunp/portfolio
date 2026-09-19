import { expect, test } from '@playwright/test';

import { waitForDevReady } from './ready';

test.describe('posts', () => {
  test('opens a post from the home catalog', async ({ page }) => {
    await page.goto('/');
    await waitForDevReady(page);
    await page.getByRole('link', { name: /GitHub stacked pull requests/ }).click();
    await page.waitForURL(/\/posts\/github-stacked-prs$/);
    await waitForDevReady(page);
    await expect(
      page.getByRole('heading', { level: 1, name: 'GitHub stacked pull requests' }),
    ).toBeVisible();
  });
});
