#!/usr/bin/env node
/**
 * Fills empty `title` / `image` on bookmark objects in
 * `src/content/bookmarks.config.json`. Never overwrites fields you set.
 *
 * After fetch:
 *   Needs you  — no title. Type it by hand. Exit 1.
 *   No image   — title exists, image is null. Warning, exit 0.
 *
 * `--force` retries empty image/title fields only. Still won't clobber
 * a non-empty title or image.
 *
 * Run: pnpm --filter www bookmarks:fetch
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

import { fillSnapshots } from '../src/lib/bookmark-store.ts';
import { fetchOg } from '../src/lib/og.ts';
import { BOOKMARKS_SCHEMA } from './lib/bookmarks-schema.mjs';

const CONFIG_FILE = path.resolve('src/content/bookmarks.config.json');
const force = process.argv.includes('--force');

async function main() {
  const config = JSON.parse(await fs.readFile(CONFIG_FILE, 'utf8'));
  if (!Array.isArray(config.collections)) {
    console.error('bookmarks.config.json is missing `collections`.');
    process.exit(1);
  }

  const result = await fillSnapshots(config, url => fetchOg(url, { force: true }), { force });

  await fs.writeFile(
    CONFIG_FILE,
    JSON.stringify({ $schema: BOOKMARKS_SCHEMA, collections: result.file.collections }, null, 2) +
      '\n',
    'utf8',
  );

  if (result.missingTitle.length) {
    console.log('\nNeeds you — no title. Add `title` by hand or fix the URL:\n');
    for (const row of result.missingTitle) {
      console.log(`  ${row.url}  (${row.collection})`);
    }
  }

  if (result.missingImage.length) {
    console.log('\nNo image — empty thumb until you set `image` or re-run with `--force`:\n');
    for (const row of result.missingImage) {
      console.log(`  ${row.url}  (${row.collection})`);
    }
  }

  console.log(
    `\nDone. ${result.fetched} fetched · ${result.skipped} skipped · ${result.missingTitle.length} need title · ${result.missingImage.length} no image`,
  );

  if (result.missingTitle.length) process.exit(1);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
