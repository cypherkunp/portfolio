#!/usr/bin/env node
/**
 * Reads `src/content/bookmarks.config.json` (hand-edited) and writes
 * Open Graph metadata to `src/content/bookmarks.og.json` (URL-keyed cache).
 *
 * Idempotent — pass `--force` to re-fetch URLs that are already cached.
 * Stale URLs (no longer in config) are pruned automatically.
 *
 * Run: pnpm --filter www fetch:bookmarks
 */

import { promises as fs } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const CONFIG_FILE = path.resolve('src/content/bookmarks.config.json');
const OG_FILE = path.resolve('src/content/bookmarks.og.json');
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

function pickFavicon(html, base) {
  const re =
    /<link[^>]+rel\s*=\s*["'](?:icon|shortcut icon|apple-touch-icon)["'][^>]*?href\s*=\s*["']([^"']+)["'][^>]*>/i;
  const m = html.match(re);
  return absolutize(m?.[1] ?? '/favicon.ico', base);
}

function fallbackOg(url) {
  const domain = (() => {
    try {
      return new URL(url).hostname.replace(/^www\./, '');
    } catch {
      return url;
    }
  })();
  return {
    title: domain,
    description: null,
    image: null,
    siteName: domain,
    favicon: `https://www.google.com/s2/favicons?domain=${domain}&sz=64`,
    fetchedAt: new Date().toISOString(),
  };
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

    const title = pickTitle(html) ?? new URL(finalUrl).hostname.replace(/^www\./, '');
    const description = pickMeta(html, ['og:description', 'twitter:description', 'description']);
    const image = absolutize(
      pickMeta(html, ['og:image', 'og:image:url', 'twitter:image', 'twitter:image:src']),
      finalUrl,
    );
    const siteName = pickMeta(html, ['og:site_name', 'application-name']);
    const favicon = pickFavicon(html, finalUrl);

    return {
      title,
      description,
      image,
      siteName: siteName ?? new URL(finalUrl).hostname.replace(/^www\./, ''),
      favicon,
      fetchedAt: new Date().toISOString(),
    };
  } catch (err) {
    console.warn(`  ! ${url} — ${err instanceof Error ? err.message : 'fetch failed'}`);
    return null;
  } finally {
    clearTimeout(timer);
  }
}

async function readJson(file, fallback) {
  try {
    return JSON.parse(await fs.readFile(file, 'utf8'));
  } catch (err) {
    if (err.code === 'ENOENT') return fallback;
    throw err;
  }
}

async function main() {
  const config = await readJson(CONFIG_FILE, { collections: [] });
  const ogFile = await readJson(OG_FILE, { entries: {} });
  const prevEntries = ogFile.entries ?? {};
  const nextEntries = {};

  let ok = 0;
  let failed = 0;
  let skipped = 0;

  for (const collection of config.collections) {
    console.log(`\n→ ${collection.name}`);
    for (const b of collection.bookmarks) {
      const cached = prevEntries[b.url];
      if (!force && cached && cached.title) {
        nextEntries[b.url] = cached;
        skipped += 1;
        console.log(`  · ${b.url} (cached)`);
        continue;
      }
      process.stdout.write(`  · ${b.url} `);
      const og = await fetchOg(b.url);
      if (og) {
        nextEntries[b.url] = og;
        ok += 1;
        console.log('✓');
      } else {
        nextEntries[b.url] = cached ?? fallbackOg(b.url);
        failed += 1;
      }
    }
  }

  const pruned = Object.keys(prevEntries).filter(url => !(url in nextEntries));
  if (pruned.length) {
    console.log(`\nPruning ${pruned.length} stale ${pruned.length === 1 ? 'entry' : 'entries'}:`);
    for (const url of pruned) console.log(`  - ${url}`);
  }

  const output = {
    $schema: 'Auto-generated by `pnpm --filter www fetch:bookmarks`. Do not hand-edit. Keyed by bookmark URL.',
    entries: nextEntries,
  };
  await fs.writeFile(OG_FILE, JSON.stringify(output, null, 2) + '\n', 'utf8');
  console.log(
    `\nDone. ${ok} fetched · ${skipped} skipped · ${failed} failed · ${pruned.length} pruned`,
  );
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
