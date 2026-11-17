const APP_IDS = ['musicPlayer', 'inspirations', 'bookmarks', 'photos', 'packageAnalyzer'] as const;

export type AppId = (typeof APP_IDS)[number];

export interface AppListing {
  path: string;
  abbreviation: string;
}

const apps: Record<AppId, AppListing & { sitemap: boolean }> = {
  musicPlayer: {
    path: '/music',
    abbreviation: 'MP',
    sitemap: true,
  },
  inspirations: {
    path: '/inspirations',
    abbreviation: 'IN',
    sitemap: true,
  },
  bookmarks: {
    path: '/bookmarks',
    abbreviation: 'BM',
    sitemap: true,
  },
  photos: {
    path: '/photos',
    abbreviation: 'PH',
    sitemap: true,
  },
  packageAnalyzer: {
    path: '/analyzer',
    abbreviation: 'PA',
    sitemap: true,
  },
};

export const ALWAYS_ON_PATHS = ['/', '/about', '/posts'] as const;

export function getAppIds() {
  return APP_IDS;
}

export function getApp(id: AppId): AppListing {
  const { path, abbreviation } = apps[id];
  return { path, abbreviation };
}

export function appInSitemap(id: AppId) {
  return apps[id].sitemap;
}
