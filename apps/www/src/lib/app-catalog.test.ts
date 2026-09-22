import { beforeEach, describe, expect, it, vi } from 'vitest';

import { assertAppEnabled, getApp, getEnabledApps, getSitemapPaths } from '@/lib/app-catalog';

const flagValues: Record<string, boolean> = {};

vi.mock('flags/next', () => ({
  flag: (opts: { key: string }) => async () => flagValues[opts.key] ?? false,
}));

vi.mock('@flags-sdk/vercel', () => ({
  vercelAdapter: () => ({}),
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

function setFlags(values: Record<string, boolean>) {
  for (const key of Object.keys(flagValues)) delete flagValues[key];
  Object.assign(flagValues, values);
}

beforeEach(() => {
  setFlags(ALL_ON);
});

describe('getApp', () => {
  it('returns the Music Player path and listing abbreviation', () => {
    expect(getApp('musicPlayer')).toEqual({ path: '/music', abbreviation: 'MP' });
  });

  it('returns the Inspirations path and listing abbreviation', () => {
    expect(getApp('inspirations')).toEqual({ path: '/inspirations', abbreviation: 'IN' });
  });

  it('returns the Bookmarks path and listing abbreviation', () => {
    expect(getApp('bookmarks')).toEqual({ path: '/bookmarks', abbreviation: 'BM' });
  });

  it('returns the Photos path and listing abbreviation', () => {
    expect(getApp('photos')).toEqual({ path: '/photos', abbreviation: 'PH' });
  });

  it('returns the Package Analyzer path and listing abbreviation', () => {
    expect(getApp('packageAnalyzer')).toEqual({ path: '/analyzer', abbreviation: 'PA' });
  });
});

describe('getEnabledApps', () => {
  it('returns every catalog id when all flags are on', async () => {
    await expect(getEnabledApps()).resolves.toEqual([
      'musicPlayer',
      'inspirations',
      'bookmarks',
      'photos',
      'packageAnalyzer',
    ]);
  });

  it('omits catalog ids whose flags are off', async () => {
    setFlags({
      ...ALL_ON,
      'feature-app-music': false,
      'feature-app-photos': false,
    });

    await expect(getEnabledApps()).resolves.toEqual([
      'inspirations',
      'bookmarks',
      'packageAnalyzer',
    ]);
  });
});

describe('getSitemapPaths', () => {
  it('includes always-on routes and every enabled app, including Bookmarks and Inspirations', async () => {
    await expect(getSitemapPaths()).resolves.toEqual([
      '/',
      '/about',
      '/music',
      '/inspirations',
      '/bookmarks',
      '/photos',
      '/analyzer',
    ]);
  });

  it('omits an app whose flag is off', async () => {
    setFlags({ ...ALL_ON, 'feature-app-inspirations': false });

    await expect(getSitemapPaths()).resolves.toEqual([
      '/',
      '/about',
      '/music',
      '/bookmarks',
      '/photos',
      '/analyzer',
    ]);
  });

  it('keeps / and /about when every app flag is off', async () => {
    setFlags({
      'feature-app-music': false,
      'feature-app-inspirations': false,
      'feature-app-bookmarks': false,
      'feature-app-photos': false,
      'feature-app-package-analyzer': false,
    });

    await expect(getSitemapPaths()).resolves.toEqual(['/', '/about']);
  });
});

describe('assertAppEnabled', () => {
  it('allows an app whose catalog flag is on', async () => {
    await expect(assertAppEnabled('musicPlayer')).resolves.toBeUndefined();
  });

  it('404s when the catalog flag is off', async () => {
    setFlags({ ...ALL_ON, 'feature-app-music': false });
    await expect(assertAppEnabled('musicPlayer')).rejects.toThrow('NEXT_NOT_FOUND');
  });
});
