import 'server-only';

import { assertSafeFetchUrl, UnsafeUrlError } from '@/lib/safe-url';

export interface OgData {
  title: string;
  description: string | null;
  image: string | null;
  siteName: string | null;
  favicon: string | null;
  fetchedAt: string | null;
}

/** Honest bot UA — do not impersonate a browser. */
export const OG_USER_AGENT =
  'Mozilla/5.0 (compatible; PortfolioBookmarksBot/1.0; +https://devvrat.uk/bookmarks)';

/** Cap HTML read to keep memory bounded under concurrent fetches. */
export const OG_HTML_MAX_CHARS = 200_000;

const MAX_REDIRECTS = 5;

function decodeEntities(text: string): string {
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

function absolutize(value: string | null, base: string): string | null {
  if (!value) return null;
  try {
    return new URL(value, base).toString();
  } catch {
    return null;
  }
}

function pickMeta(html: string, selectors: string[]): string | null {
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

function pickTitle(html: string): string | null {
  const og = pickMeta(html, ['og:title', 'twitter:title']);
  if (og) return og;
  const m = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return m?.[1] ? decodeEntities(m[1].trim()) : null;
}

function pickFavicon(html: string, base: string): string | null {
  const re =
    /<link[^>]+rel\s*=\s*["'](?:icon|shortcut icon|apple-touch-icon)["'][^>]*?href\s*=\s*["']([^"']+)["'][^>]*>/i;
  const m = html.match(re);
  return absolutize(m?.[1] ?? '/favicon.ico', base);
}

export interface FetchOgOptions {
  /** Skip Next's data cache; use only on the build script. */
  force?: boolean;
  timeoutMs?: number;
}

async function fetchWithSafeRedirects(
  startUrl: string,
  init: RequestInit & { next?: { revalidate: number | false } },
): Promise<Response | null> {
  let current = await assertSafeFetchUrl(startUrl);

  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    const res = await fetch(current.toString(), { ...init, redirect: 'manual' });

    if (res.status >= 300 && res.status < 400) {
      const location = res.headers.get('location');
      if (!location) return null;
      const nextUrl = new URL(location, current).toString();
      current = await assertSafeFetchUrl(nextUrl);
      continue;
    }

    return res;
  }

  return null;
}

export async function fetchOg(url: string, opts: FetchOgOptions = {}): Promise<OgData | null> {
  const { force = false, timeoutMs = 8000 } = opts;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const init: RequestInit & { next?: { revalidate: number | false } } = {
      headers: {
        'User-Agent': OG_USER_AGENT,
        Accept: 'text/html,application/xhtml+xml',
        'Accept-Language': 'en;q=0.9',
      },
      signal: controller.signal,
    };
    if (!force) {
      init.next = { revalidate: 60 * 60 * 24 * 7 };
    } else {
      init.cache = 'no-store';
    }

    const res = await fetchWithSafeRedirects(url, init);
    if (!res || !res.ok) return null;
    const ct = res.headers.get('content-type') ?? '';
    if (!ct.includes('html')) return null;

    const html = (await res.text()).slice(0, OG_HTML_MAX_CHARS);
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
      fetchedAt: null,
    };
  } catch (err) {
    if (err instanceof UnsafeUrlError) return null;
    return null;
  } finally {
    clearTimeout(timer);
  }
}
