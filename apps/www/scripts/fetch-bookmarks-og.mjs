#!/usr/bin/env node
/**
 * Enriches `src/content/bookmarks.json` with Open Graph metadata for every
 * bookmark URL. Idempotent — pass `--force` to re-fetch everything.
 *
 * Run: pnpm --filter www fetch:bookmarks
 */

import { promises as fs } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const FILE = path.resolve('src/content/bookmarks.json');
const UA =
  'Mozilla/5.0 (compatible; PortfolioBookmarksBot/1.0; +https://devvrat.uk/bookmarks)';
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
    const html = (await res.text()).slice(0, 200_000);
    const finalUrl = res.url || url;

    const title =
      pickTitle(html) ?? new URL(finalUrl).hostname.replace(/^www\./, '');
    const description = pickMeta(html, [
      'og:description',
      'twitter:description',
      'description',
    ]);
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

async function main() {
  const raw = await fs.readFile(FILE, 'utf8');
  const data = JSON.parse(raw);

  let ok = 0;
  let failed = 0;
  let skipped = 0;

  for (const collection of data.collections) {
    console.log(`\n→ ${collection.name}`);
    for (const b of collection.bookmarks) {
      if (!force && b.og && b.og.title) {
        skipped += 1;
        console.log(`  · ${b.url} (cached)`);
        continue;
      }
      process.stdout.write(`  · ${b.url} `);
      const og = await fetchOg(b.url);
      if (og) {
        b.og = og;
        ok += 1;
        console.log('✓');
      } else {
        failed += 1;
        b.og = b.og ?? {
          title: new URL(b.url).hostname.replace(/^www\./, ''),
          description: null,
          image: null,
          siteName: new URL(b.url).hostname.replace(/^www\./, ''),
          favicon: `https://www.google.com/s2/favicons?domain=${new URL(b.url).hostname}&sz=64`,
          fetchedAt: new Date().toISOString(),
        };
      }
    }
  }

  await fs.writeFile(FILE, JSON.stringify(data, null, 2) + '\n', 'utf8');
  console.log(`\nDone. ${ok} fetched · ${skipped} skipped · ${failed} failed`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
