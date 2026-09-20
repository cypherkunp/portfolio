import { expect, test } from '@playwright/test';

import { waitForDevReady } from './ready';

test.describe('home', () => {
  test('renders identity, posts, and primary nav', async ({ page }) => {
    await page.goto('/');
    await waitForDevReady(page);

    await expect(page.getByRole('heading', { level: 1, name: "Hi, I'm Devvrat" })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Posts' })).toBeVisible();
    await expect(page.getByRole('link', { name: /Hello world/ })).toBeVisible();

    const nav = page.getByRole('navigation');
    await expect(nav.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
    await expect(nav.getByRole('link', { name: 'About' })).toHaveAttribute('href', '/about');

    const connect = nav.getByRole('link', { name: 'Connect' });
    await expect(connect).toHaveAttribute('href', 'https://devvrat.uk');
    await expect(connect).toHaveAttribute('target', '_blank');
  });

  test('opens About from the nav', async ({ page }) => {
    await page.goto('/');
    await waitForDevReady(page);
    await page.getByRole('navigation').getByRole('link', { name: 'About' }).click();
    await page.waitForURL(/\/about$/);
    await waitForDevReady(page);
    await expect(page.getByRole('heading', { name: 'Work Experience' })).toBeVisible();
  });
});
