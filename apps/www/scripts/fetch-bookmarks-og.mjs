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
 * Run: pnpm --filter www fetch:bookmarks
 */

import { promises as fs } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const CONFIG_FILE = path.resolve('src/content/bookmarks.config.json');
const SCHEMA =
  'Hand-edited. Add a collection (id, name, description) and bookmark `{ url }` objects. Run `pnpm --filter www fetch:bookmarks` to fill title and image. Fields you set are never overwritten.';
const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';
const force = process.argv.includes('--force');

function decodeEntities(text) {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCharCode(parseInt(n, 16)));
}

function absolutize(value, base) {
  if (!value) return null;
  try {
    return new URL(value, base).toString();
  } catch {
    return null;
  }
}

function pickMeta(html, selectors) {
  for (const sel of selectors) {
    const re = new RegExp(
      `<meta[^>]+(?:property|name)\\s*=\\s*["']${sel}["'][^>]*?content\\s*=\\s*["']([^"']+)["'][^>]*>`,
      'i',
    );
    const m = html.match(re);
    if (m?.[1]) return decodeEntities(m[1]);
    const re2 = new RegExp(
      `<meta[^>]+content\\s*=\\s*["']([^"']+)["'][^>]*?(?:property|name)\\s*=\\s*["']${sel}["'][^>]*>`,
      'i',
    );
    const m2 = html.match(re2);
    if (m2?.[1]) return decodeEntities(m2[1]);
  }
  return null;
}

function pickTitle(html) {
  const og = pickMeta(html, ['og:title', 'twitter:title']);
  if (og) return og;
  const m = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return m?.[1] ? decodeEntities(m[1].trim()) : null;
}

async function fetchOg(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10_000);
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': UA,
        Accept: 'text/html,application/xhtml+xml',
        'Accept-Language': 'en;q=0.9',
      },
      redirect: 'follow',
      signal: controller.signal,
    });
    if (!res.ok) return null;
    const ct = res.headers.get('content-type') ?? '';
    if (!ct.includes('html')) return null;
    const html = (await res.text()).slice(0, 1_500_000);
    const finalUrl = res.url || url;

    const title = pickTitle(html);
    const image = absolutize(
      pickMeta(html, ['og:image', 'og:image:url', 'twitter:image', 'twitter:image:src']),
      finalUrl,
    );

    return { title, image };
  } catch (err) {
    console.warn(`  ! ${url} — ${err instanceof Error ? err.message : 'fetch failed'}`);
    return null;
  } finally {
    clearTimeout(timer);
  }
}

function asBookmark(raw) {
  if (typeof raw === 'string') return { url: raw };
  return { url: raw.url, title: raw.title, image: raw.image };
}

function hasTitle(bookmark) {
  return typeof bookmark.title === 'string' && bookmark.title.trim().length > 0;
}

function hasImage(bookmark) {
  return typeof bookmark.image === 'string' && bookmark.image.length > 0;
}

function imageCheckedEmpty(bookmark) {
  return bookmark.image === null;
}

function needsFetch(bookmark) {
  if (!hasTitle(bookmark)) return true;
  if (hasImage(bookmark)) return false;
  if (imageCheckedEmpty(bookmark)) return force;
  return true;
}

function toWrittenBookmark(bookmark) {
  const out = { url: bookmark.url };
  if (hasTitle(bookmark)) out.title = bookmark.title.trim();
  if (hasImage(bookmark)) out.image = bookmark.image;
  else if (imageCheckedEmpty(bookmark)) out.image = null;
  return out;
}

async function main() {
  const config = JSON.parse(await fs.readFile(CONFIG_FILE, 'utf8'));
  if (!Array.isArray(config.collections)) {
    console.error('bookmarks.config.json is missing `collections`.');
    process.exit(1);
  }

  let fetched = 0;
  let skipped = 0;
  const missingTitle = [];
  const missingImage = [];

  const collections = [];

  for (const collection of config.collections) {
    console.log(`\n→ ${collection.name ?? collection.id}`);
    const bookmarks = [];

    for (const raw of collection.bookmarks ?? []) {
      const bookmark = asBookmark(raw);
      if (!bookmark.url) {
        console.warn('  ! skipping bookmark with no url');
        continue;
      }

      if (!needsFetch(bookmark)) {
        skipped += 1;
        console.log(`  · ${bookmark.url} (cached)`);
        bookmarks.push(toWrittenBookmark(bookmark));
        if (!hasImage(bookmark)) missingImage.push({ url: bookmark.url, collection: collection.name });
        continue;
      }

      process.stdout.write(`  · ${bookmark.url} `);
      const og = await fetchOg(bookmark.url);
      fetched += 1;

      if (og) {
        if (!hasTitle(bookmark) && og.title) bookmark.title = og.title;
        if (!hasImage(bookmark)) bookmark.image = og.image ?? null;
        console.log('✓');
      } else {
        console.log('✗');
      }

      bookmarks.push(toWrittenBookmark(bookmark));
      if (!hasTitle(bookmark)) missingTitle.push({ url: bookmark.url, collection: collection.name });
      else if (!hasImage(bookmark)) missingImage.push({ url: bookmark.url, collection: collection.name });
    }

    collections.push({
      id: collection.id,
      name: collection.name,
      description: collection.description ?? '',
      bookmarks,
    });
  }

  const output = {
    $schema: SCHEMA,
    collections,
  };
  await fs.writeFile(CONFIG_FILE, JSON.stringify(output, null, 2) + '\n', 'utf8');

  if (missingTitle.length) {
    console.log('\nNeeds you — no title. Add `title` by hand or fix the URL:\n');
    for (const row of missingTitle) {
      console.log(`  ${row.url}  (${row.collection})`);
    }
  }

  if (missingImage.length) {
    console.log('\nNo image — empty thumb until you set `image` or re-run with --force:\n');
    for (const row of missingImage) {
      console.log(`  ${row.url}  (${row.collection})`);
    }
  }

  console.log(
    `\nDone. ${fetched} fetched · ${skipped} skipped · ${missingTitle.length} need title · ${missingImage.length} no image`,
  );

  if (missingTitle.length) process.exit(1);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
