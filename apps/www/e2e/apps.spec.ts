import { expect, test } from '@playwright/test';

import { waitForDevReady } from './ready';

test.describe('apps', () => {
  test('opens Inspirations from the home Apps list', async ({ page }) => {
    await page.goto('/');
    await waitForDevReady(page);
    await page.getByRole('link', { name: /Inspirations/ }).click();
    await page.waitForURL(/\/inspirations$/);
    await waitForDevReady(page);
    await expect(page.getByRole('heading', { name: 'Inspirations' })).toBeVisible();
    await expect(page.getByRole('blockquote').first()).toBeVisible();
  });

  test('lists Bookmarks and Inspirations in the sitemap', async ({ request }) => {
    const response = await request.get('/sitemap.xml');
    expect(response.ok()).toBeTruthy();
    const xml = await response.text();
    expect(xml).toContain('https://www.devvrat.cc/bookmarks');
    expect(xml).toContain('https://www.devvrat.cc/inspirations');
    expect(xml).toContain('https://www.devvrat.cc/posts/hello-world');
    expect(xml).toContain('<lastmod>2025-01-01</lastmod>');
  });

  test('opens a bookmark collection from the catalog', async ({ page }) => {
    await page.goto('/bookmarks');
    await waitForDevReady(page);
    await expect(page.getByRole('heading', { name: 'Bookmarks' })).toBeVisible();
    await page.getByRole('link', { name: /Reading List/ }).click();
    await page.waitForURL(/\/bookmarks\/reading-list$/);
    await waitForDevReady(page);
    await expect(page.getByRole('link', { name: /Do Things that Don't Scale/ })).toBeVisible();
  });
});
