import { describe, expect, it } from 'vitest';

import {
  fillSnapshots,
  getCollection,
  getCollections,
  hostnameOf,
  type BookmarksConfigFile,
} from '@/lib/bookmark-store';

function file(collections: BookmarksConfigFile['collections']): BookmarksConfigFile {
  return { collections };
}

describe('hostnameOf', () => {
  it('strips www from a valid URL', () => {
    expect(hostnameOf('https://www.example.com/path')).toBe('example.com');
  });

  it('keeps a hostname that is already bare', () => {
    expect(hostnameOf('https://dauntbooks.co.uk/shops/marylebone/')).toBe('dauntbooks.co.uk');
  });

  it('returns the original string when the URL is invalid', () => {
    expect(hostnameOf('not a url')).toBe('not a url');
  });
});

describe('getCollections', () => {
  it('normalizes bookmarks and fills a missing collection description', () => {
    const collections = getCollections(
      file([
        {
          id: 'design',
          name: 'Design',
          description: 'Visual systems.',
          chromeGuid: 'abc',
          bookmarks: [
            { url: 'https://www.example.com/a', title: '  Example  ', image: null },
            { url: 'https://example.com/untitled' },
          ],
        },
        {
          id: 'no-copy',
          name: 'Untitled Collection',
          bookmarks: [],
        },
      ]),
    );

    expect(collections).toEqual([
      {
        id: 'design',
        name: 'Design',
        description: 'Visual systems.',
        bookmarks: [
          { url: 'https://www.example.com/a', title: 'Example', image: null },
          { url: 'https://example.com/untitled', title: null, image: null },
        ],
      },
      {
        id: 'no-copy',
        name: 'Untitled Collection',
        description: '',
        bookmarks: [],
      },
    ]);
  });
});

describe('getCollection', () => {
  it('returns the named collection', () => {
    const config = file([{ id: 'design', name: 'Design', bookmarks: [] }]);
    expect(getCollection(config, 'design')?.name).toBe('Design');
  });

  it('returns undefined for an unknown id', () => {
    expect(getCollection(file([]), 'missing')).toBeUndefined();
  });
});

describe('fillSnapshots', () => {
  it('fills a missing title and image from the OG adapter', async () => {
    const result = await fillSnapshots(
      file([
        {
          id: 'reading-list',
          name: 'Reading List',
          bookmarks: [{ url: 'https://paulgraham.com/ds.html' }],
        },
      ]),
      async () => ({
        title: "Do Things that Don't Scale",
        image: 'https://paulgraham.com/ds.png',
      }),
    );

    expect(result.fetched).toBe(1);
    expect(result.skipped).toBe(0);
    expect(result.missingTitle).toEqual([]);
    expect(result.file.collections[0]?.bookmarks).toEqual([
      {
        url: 'https://paulgraham.com/ds.html',
        title: "Do Things that Don't Scale",
        image: 'https://paulgraham.com/ds.png',
      },
    ]);
  });

  it('never overwrites a title or image the curator set', async () => {
    const result = await fillSnapshots(
      file([
        {
          id: 'london-spots',
          name: 'Places to Visit in London',
          chromeGuid: 'guid-1',
          bookmarks: [
            {
              url: 'https://dauntbooks.co.uk/shops/marylebone/',
              title: 'Daunt Books Marylebone',
              image: 'https://dauntbooks.co.uk/cover.jpg',
            },
          ],
        },
      ]),
      async () => ({ title: 'NOPE', image: 'https://evil.example/x.png' }),
    );

    expect(result.fetched).toBe(0);
    expect(result.skipped).toBe(1);
    expect(result.file.collections[0]).toEqual({
      id: 'london-spots',
      name: 'Places to Visit in London',
      description: '',
      chromeGuid: 'guid-1',
      bookmarks: [
        {
          url: 'https://dauntbooks.co.uk/shops/marylebone/',
          title: 'Daunt Books Marylebone',
          image: 'https://dauntbooks.co.uk/cover.jpg',
        },
      ],
    });
  });

  it('treats image null as checked-empty unless force is set', async () => {
    const config = file([
      {
        id: 'reading-list',
        name: 'Reading List',
        bookmarks: [
          {
            url: 'https://grugbrain.dev/',
            title: 'The Grug Brained Developer',
            image: null,
          },
        ],
      },
    ]);

    const skipped = await fillSnapshots(config, async () => ({
      title: 'ignored',
      image: 'https://grugbrain.dev/og.png',
    }));
    expect(skipped.fetched).toBe(0);
    expect(skipped.file.collections[0]?.bookmarks[0]?.image).toBeNull();
    expect(skipped.missingImage).toEqual([
      { url: 'https://grugbrain.dev/', collection: 'Reading List' },
    ]);

    const forced = await fillSnapshots(
      config,
      async () => ({ title: 'ignored', image: 'https://grugbrain.dev/og.png' }),
      { force: true },
    );
    expect(forced.fetched).toBe(1);
    expect(forced.file.collections[0]?.bookmarks[0]?.image).toBe('https://grugbrain.dev/og.png');
  });

  it('reports a missing title when the OG adapter cannot supply one', async () => {
    const result = await fillSnapshots(
      file([
        {
          id: 'reading-list',
          name: 'Reading List',
          bookmarks: ['https://example.com/untitled'],
        },
      ]),
      async () => ({ title: null, image: null }),
    );

    expect(result.file.collections[0]?.bookmarks).toEqual([
      { url: 'https://example.com/untitled', image: null },
    ]);
    expect(result.missingTitle).toEqual([
      { url: 'https://example.com/untitled', collection: 'Reading List' },
    ]);
  });
});
