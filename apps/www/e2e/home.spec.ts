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

  test('applies the shared design system tokens and canvas', async ({ page }) => {
    await page.goto('/');
    await waitForDevReady(page);

    const styles = await page.evaluate(() => {
      const ctx = document.createElement('canvas').getContext('2d', { willReadFrequently: true })!;
      const resolve = (color: string) => {
        const probe = document.createElement('span');
        probe.style.color = color;
        document.body.append(probe);
        ctx.clearRect(0, 0, 1, 1);
        ctx.fillStyle = getComputedStyle(probe).color;
        ctx.fillRect(0, 0, 1, 1);
        probe.remove();
        return Array.from(ctx.getImageData(0, 0, 1, 1).data.slice(0, 3));
      };
      return {
        background: [resolve('var(--background)'), resolve('oklch(0.1649 0.0352 281.8285)')],
        primary: [resolve('var(--primary)'), resolve('oklch(0.9168 0.1915 101.407)')],
        bodyImage: getComputedStyle(document.body).backgroundImage,
      };
    });

    for (const [actual, expected] of [styles.background, styles.primary]) {
      actual.forEach((channel, i) =>
        expect(Math.abs(channel - expected[i])).toBeLessThanOrEqual(1),
      );
    }
    expect(styles.bodyImage).toContain('data:image/svg+xml');
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
