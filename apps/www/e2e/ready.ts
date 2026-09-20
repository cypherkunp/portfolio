import { expect, type Page } from '@playwright/test';

/** Next's first compile of a route can sit under a "Compiling" overlay and swallow clicks. */
export async function waitForDevReady(page: Page) {
  await expect(page.getByText('Compiling')).toHaveCount(0, { timeout: 60_000 });
}
