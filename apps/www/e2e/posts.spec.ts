import { expect, test } from '@playwright/test';

import { waitForDevReady } from './ready';

test.describe('posts', () => {
  test('aligns the date with the first line of a wrapped title', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/posts');
    await waitForDevReady(page);

    const rows = await page.locator('a[href^="/posts/"]').evaluateAll(anchors =>
      anchors.map(anchor => {
        const [date, title] = anchor.querySelectorAll('p');
        const range = document.createRange();
        range.selectNodeContents(title!);
        const lines = [...range.getClientRects()];
        const dateRect = date!.getBoundingClientRect();
        const first = lines[0]!;
        const dateMid = dateRect.top + dateRect.height / 2;
        const firstMid = first.top + first.height / 2;
        const blockMid = (first.top + lines[lines.length - 1]!.bottom) / 2;

        return {
          lines: lines.length,
          deltaFirst: Math.abs(dateMid - firstMid),
          deltaBlock: Math.abs(dateMid - blockMid),
        };
      }),
    );

    const wrapped = rows.filter(row => row.lines > 1);
    expect(wrapped.length).toBeGreaterThan(0);

    for (const row of wrapped) {
      expect(row.deltaFirst).toBeLessThan(row.deltaBlock);
      expect(row.deltaFirst).toBeLessThan(4);
    }
  });

  test('opens every post from the catalog', async ({ page }) => {
    test.setTimeout(180_000);

    await page.goto('/posts');
    await waitForDevReady(page);
    await expect(page.getByRole('heading', { name: 'Posts' })).toBeVisible();

    const hrefs = await page
      .locator('a[href^="/posts/"]')
      .evaluateAll(anchors =>
        anchors
          .map(anchor => anchor.getAttribute('href'))
          .filter((href): href is string => href !== null),
      );

    expect(hrefs.length).toBeGreaterThan(0);

    for (const href of hrefs) {
      await test.step(href, async () => {
        const pageErrors: string[] = [];
        const onPageError = (error: Error) => pageErrors.push(error.message);
        page.on('pageerror', onPageError);

        await page.goto('/posts');
        await waitForDevReady(page);
        await page.locator(`a[href="${href}"]`).click();
        await page.waitForURL(url => url.pathname === href);
        await waitForDevReady(page);

        await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
        await expect(page.getByRole('main').getByText('Loading...', { exact: true })).toHaveCount(
          0,
        );
        await expect(page.getByText('Unhandled Runtime Error')).toHaveCount(0);
        await expect(page.getByText('Post Not Found')).toHaveCount(0);
        expect(pageErrors).toEqual([]);

        page.off('pageerror', onPageError);
      });
    }
  });
});
