import { afterEach, describe, expect, it, vi } from 'vitest';

import { fetchOg } from '@/lib/og';

function htmlResponse(html: string) {
  return new Response(html, {
    status: 200,
    headers: { 'content-type': 'text/html; charset=utf-8' },
  });
}

describe('fetchOg', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('reads Open Graph title, description, and image from HTML', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        htmlResponse(
          `<html><head>
            <title>Fallback</title>
            <meta property="og:title" content="OG Title" />
            <meta property="og:description" content="Desc &amp; more" />
            <meta property="og:image" content="/cover.png" />
            <meta property="og:site_name" content="Example" />
            <link rel="icon" href="/favicon.ico" />
          </head></html>`,
        ),
      ),
    );

    await expect(fetchOg('https://example.com/post')).resolves.toEqual({
      title: 'OG Title',
      description: 'Desc & more',
      image: 'https://example.com/cover.png',
      siteName: 'Example',
      favicon: 'https://example.com/favicon.ico',
    });
  });

  it('decodes each entity once', async () => {
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValue(
          htmlResponse(
            '<html><head><meta property="og:description" content="A &amp;lt; B &#39; C" /></head></html>',
          ),
        ),
    );

    const data = await fetchOg('https://example.com/post');
    expect(data?.description).toBe("A &lt; B ' C");
  });

  it('falls back to the document title when og:title is missing', async () => {
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValue(htmlResponse('<html><head><title> Page Title </title></head></html>')),
    );

    const data = await fetchOg('https://example.com/post');
    expect(data?.title).toBe('Page Title');
  });

  it('leaves title null when the page has no title', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(htmlResponse('<html><head></head><body>Hi</body></html>')),
    );

    const data = await fetchOg('https://example.com/post');
    expect(data?.title).toBeNull();
    expect(data?.siteName).toBe('example.com');
  });

  it('returns null when the response is not HTML', async () => {
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValue(
          new Response('{}', { status: 200, headers: { 'content-type': 'application/json' } }),
        ),
    );

    await expect(fetchOg('https://example.com/api')).resolves.toBeNull();
  });

  it('returns null when the request fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('', { status: 404 })));

    await expect(fetchOg('https://example.com/missing')).resolves.toBeNull();
  });
});
