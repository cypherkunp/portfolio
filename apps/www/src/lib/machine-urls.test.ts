import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  flagsDiscovery,
  legacyRedirect,
  ogProxy,
  robotsDocument,
  securityHeaders,
  sitemapDocument,
} from '@/lib/machine-urls';

const flagValues: Record<string, boolean> = {};

vi.mock('flags/next', () => ({
  flag: (opts: { key: string }) => Object.assign(async () => flagValues[opts.key] ?? false, opts),
}));

vi.mock('@flags-sdk/vercel', () => ({
  vercelAdapter: () => ({}),
  getProviderData: async () => {
    throw new Error('FLAGS datafile unavailable');
  },
}));

vi.mock('next/navigation', () => ({
  notFound: () => {
    throw new Error('NEXT_NOT_FOUND');
  },
}));

const ALL_ON = {
  'feature-app-music': true,
  'feature-app-inspirations': true,
  'feature-app-bookmarks': true,
  'feature-app-photos': true,
  'feature-app-package-analyzer': true,
};

beforeEach(() => {
  for (const key of Object.keys(flagValues)) delete flagValues[key];
  Object.assign(flagValues, ALL_ON);
});

describe('flagsDiscovery', () => {
  it('lists the catalog flag keys', async () => {
    const payload = await flagsDiscovery();

    expect(Object.keys(payload.definitions).sort()).toEqual([
      'feature-app-bookmarks',
      'feature-app-inspirations',
      'feature-app-music',
      'feature-app-package-analyzer',
      'feature-app-photos',
      'feature-apps-support',
    ]);
  });
});

describe('sitemapDocument', () => {
  it('lists public pages, posts, and collections, and omits a flagged-off app', async () => {
    flagValues['feature-app-music'] = false;

    const xml = await sitemapDocument();

    expect(xml).toContain('<loc>https://www.devvrat.cc</loc>');
    expect(xml).toContain('<loc>https://www.devvrat.cc/about</loc>');
    expect(xml).toContain('<loc>https://www.devvrat.cc/posts</loc>');
    expect(xml).toContain('<loc>https://www.devvrat.cc/inspirations</loc>');
    expect(xml).toContain('<loc>https://www.devvrat.cc/bookmarks</loc>');
    expect(xml).toContain('<loc>https://www.devvrat.cc/bookmarks/reading-list</loc>');
    expect(xml).toContain('<loc>https://www.devvrat.cc/posts/hello-world</loc>');
    expect(xml).toContain('<lastmod>2025-01-01</lastmod>');
    expect(xml).not.toContain('https://www.devvrat.cc/music');
  });
});

describe('ogProxy', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns 400 when the url query param is missing', async () => {
    await expect(ogProxy(null)).resolves.toEqual({
      status: 400,
      body: { error: 'Missing `url` query param.' },
      cacheControl: null,
    });
    await expect(ogProxy('')).resolves.toEqual({
      status: 400,
      body: { error: 'Missing `url` query param.' },
      cacheControl: null,
    });
  });

  it('returns 400 when the url cannot be parsed', async () => {
    await expect(ogProxy('not a url')).resolves.toEqual({
      status: 400,
      body: { error: 'Invalid URL.' },
      cacheControl: null,
    });
  });

  it('returns 400 when the url is not http(s)', async () => {
    await expect(ogProxy('ftp://example.com/file')).resolves.toEqual({
      status: 400,
      body: { error: 'Only http(s) URLs are allowed.' },
      cacheControl: null,
    });
  });

  it('returns 502 when Open Graph data cannot be fetched', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('', { status: 404 })));

    await expect(ogProxy('https://example.com/missing')).resolves.toEqual({
      status: 502,
      body: { error: 'Could not fetch OG data.' },
      cacheControl: null,
    });
  });

  it('returns Open Graph data and a public cache header for an https url', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(
          `<html><head>
            <title>Fallback</title>
            <meta property="og:title" content="OG Title" />
            <meta property="og:description" content="Desc &amp; more" />
            <meta property="og:image" content="/cover.png" />
            <meta property="og:site_name" content="Example" />
            <link rel="icon" href="/favicon.ico" />
          </head></html>`,
          { status: 200, headers: { 'content-type': 'text/html; charset=utf-8' } },
        ),
      ),
    );

    await expect(ogProxy('https://example.com/post')).resolves.toEqual({
      status: 200,
      body: {
        title: 'OG Title',
        description: 'Desc & more',
        image: 'https://example.com/cover.png',
        siteName: 'Example',
        favicon: 'https://example.com/favicon.ico',
      },
      cacheControl: 'public, s-maxage=86400, stale-while-revalidate=604800',
    });
  });
});

describe('securityHeaders', () => {
  it('sends nosniff, DENY, and strict-origin-when-cross-origin', () => {
    expect(securityHeaders()).toEqual([
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    ]);
  });
});

describe('legacyRedirect', () => {
  it('sends /connect to https://devvrat.uk with status 308', () => {
    expect(legacyRedirect('/connect')).toEqual({
      status: 308,
      location: 'https://devvrat.uk',
    });
  });

  it('sends /contacts to https://devvrat.uk with status 308', () => {
    expect(legacyRedirect('/contacts')).toEqual({
      status: 308,
      location: 'https://devvrat.uk',
    });
  });

  it('returns null for any other path', () => {
    expect(legacyRedirect('/about')).toBeNull();
    expect(legacyRedirect('/connect/extra')).toBeNull();
    expect(legacyRedirect('')).toBeNull();
  });
});

describe('robotsDocument', () => {
  it('allows /, disallows /api/, and points at the sitemap', () => {
    expect(robotsDocument()).toBe(`User-Agent: *
Allow: /
Disallow: /api/

Host: https://www.devvrat.cc
Sitemap: https://www.devvrat.cc/sitemap.xml
`);
  });
});
