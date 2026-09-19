import { describe, expect, it, vi } from 'vitest';

import { getCollection, getCollections, hostnameOf } from '@/lib/bookmarks';

vi.mock('@/content/bookmarks.config.json', () => ({
  default: {
    collections: [
      {
        id: 'design',
        name: 'Design',
        description: 'Visual systems.',
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
    ],
  },
}));

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
    const collections = getCollections();

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
    expect(getCollection('design')?.name).toBe('Design');
  });

  it('returns undefined for an unknown id', () => {
    expect(getCollection('missing')).toBeUndefined();
  });
});
