export interface OgData {
  title: string | null;
  description: string | null;
  image: string | null;
  siteName: string | null;
  favicon: string | null;
}

const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

const NAMED_ENTITIES: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
};

function decodeEntities(text: string): string {
  return text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (entity, body: string) => {
    if (body[0] === '#') {
      const code =
        body[1] === 'x' || body[1] === 'X' ? parseInt(body.slice(2), 16) : Number(body.slice(1));
      if (
        !Number.isFinite(code) ||
        code < 0 ||
        code > 0x10ffff ||
        (code >= 0xd800 && code <= 0xdfff)
      ) {
        return entity;
      }
      return String.fromCodePoint(code);
    }
    return NAMED_ENTITIES[body.toLowerCase()] ?? entity;
  });
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

export async function fetchOg(url: string, opts: FetchOgOptions = {}): Promise<OgData | null> {
  const { force = false, timeoutMs = 8000 } = opts;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const init: RequestInit & { next?: { revalidate: number | false } } = {
      headers: {
        'User-Agent': UA,
        Accept: 'text/html,application/xhtml+xml',
        'Accept-Language': 'en;q=0.9',
      },
      redirect: 'follow',
      signal: controller.signal,
    };
    if (!force) {
      init.next = { revalidate: 60 * 60 * 24 * 7 };
    } else {
      init.cache = 'no-store';
    }

    const res = await fetch(url, init);
    if (!res.ok) return null;
    const ct = res.headers.get('content-type') ?? '';
    if (!ct.includes('html')) return null;

    const html = (await res.text()).slice(0, 1_500_000);
    const finalUrl = res.url || url;

    const title = pickTitle(html);
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
    };
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}
