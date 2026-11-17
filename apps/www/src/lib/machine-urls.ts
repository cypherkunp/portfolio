import { vercelFlags } from '@/flags';
import { getProviderData } from '@flags-sdk/vercel';
import type { FlagDefinitionType, ProviderData } from 'flags';
import type { KeyedFlagDefinitionType } from '@/lib/flag';

import { PORTFOLIO_BASE_URL } from '@/config/site-data';
import { getSitemapPaths } from '@/lib/app-flags';
import { getCollections } from '@/lib/bookmarks';
import { fetchOg, type OgData } from '@/lib/og';
import { getBlogPosts } from '@/lib/post.utils';
import { buildSitemapEntries, type SitemapEntry } from '@/lib/seo';

function xmlEscape(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function sitemapXml(entries: SitemapEntry[]) {
  const urls = entries
    .map(entry => {
      const lastmod = entry.lastModified
        ? `\n    <lastmod>${xmlEscape(entry.lastModified)}</lastmod>`
        : '';
      return `  <url>\n    <loc>${xmlEscape(entry.url)}</loc>${lastmod}\n  </url>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

export interface OgProxyResult {
  status: number;
  body: { error: string } | OgData;
  cacheControl: string | null;
}

export async function ogProxy(url: string | null): Promise<OgProxyResult> {
  if (!url) {
    return {
      status: 400,
      body: { error: 'Missing `url` query param.' },
      cacheControl: null,
    };
  }

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return { status: 400, body: { error: 'Invalid URL.' }, cacheControl: null };
  }
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return {
      status: 400,
      body: { error: 'Only http(s) URLs are allowed.' },
      cacheControl: null,
    };
  }

  const og = await fetchOg(parsed.toString());
  if (!og) {
    return { status: 502, body: { error: 'Could not fetch OG data.' }, cacheControl: null };
  }

  return {
    status: 200,
    body: og,
    cacheControl: 'public, s-maxage=86400, stale-while-revalidate=604800',
  };
}

export interface SecurityHeader {
  key: string;
  value: string;
}

export function securityHeaders(): SecurityHeader[] {
  return [
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    { key: 'X-Frame-Options', value: 'DENY' },
    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  ];
}

export interface LegacyRedirect {
  status: 308;
  location: 'https://devvrat.uk';
}

export function legacyRedirect(pathname: string): LegacyRedirect | null {
  if (pathname === '/connect' || pathname === '/contacts') {
    return { status: 308, location: 'https://devvrat.uk' };
  }
  return null;
}

export function robotsDocument() {
  return `User-Agent: *
Allow: /
Disallow: /api/

Host: ${PORTFOLIO_BASE_URL}
Sitemap: ${PORTFOLIO_BASE_URL}/sitemap.xml
`;
}

export async function sitemapDocument() {
  const paths = await getSitemapPaths();

  return sitemapXml(
    buildSitemapEntries({
      baseUrl: PORTFOLIO_BASE_URL,
      paths,
      posts: getBlogPosts().map(post => ({
        slug: post.slug,
        publishedOn: post.metadata.publishedOn,
      })),
      collections: getCollections().map(collection => ({ id: collection.id })),
    }),
  );
}

interface DeclaredFlag {
  key: string;
  description?: string;
  defaultValue?: FlagDefinitionType['defaultValue'];
  options?: FlagDefinitionType['options'];
  origin?: FlagDefinitionType['origin'];
  adapter?: {
    origin?: FlagDefinitionType['origin'] | ((key: string) => FlagDefinitionType['origin']);
  };
}

function originOf(flag: DeclaredFlag): FlagDefinitionType['origin'] {
  if (flag.origin) return flag.origin;
  const fromAdapter = flag.adapter?.origin;
  if (typeof fromAdapter === 'function') return fromAdapter(flag.key);
  return fromAdapter;
}

function declaredFlags() {
  const definitions: ProviderData['definitions'] = {};
  const normalized: Record<string, KeyedFlagDefinitionType> = {};

  for (const [name, value] of Object.entries(vercelFlags)) {
    if (Array.isArray(value)) continue;
    const flag = value as DeclaredFlag;
    if (typeof flag.key !== 'string') continue;

    const origin = originOf(flag);
    definitions[flag.key] = {
      options: flag.options,
      description: flag.description,
      defaultValue: flag.defaultValue,
      declaredInCode: true,
    };
    normalized[name] = {
      key: flag.key,
      options: flag.options,
      origin,
      description: flag.description,
      defaultValue: flag.defaultValue,
    };
  }

  return { definitions, normalized };
}

export async function flagsDiscovery(): Promise<ProviderData> {
  const { definitions, normalized } = declaredFlags();

  try {
    const provider = await getProviderData(normalized);
    if (provider?.definitions && Object.keys(provider.definitions).length > 0) return provider;
  } catch {
    // Unlinked local dev has no FLAGS datafile. Declared flags still answer.
  }

  return { definitions, hints: [] };
}
