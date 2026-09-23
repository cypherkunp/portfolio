import { notFound } from 'next/navigation';
import {
  featureAppBookmarks,
  featureAppInspirations,
  featureAppMusic,
  featureAppPackageAnalyzer,
  featureAppPhotos,
} from '@/flags';

const APP_IDS = ['musicPlayer', 'inspirations', 'bookmarks', 'photos', 'packageAnalyzer'] as const;

export type AppId = (typeof APP_IDS)[number];

export interface AppListing {
  path: string;
  abbreviation: string;
}

interface AppEntry extends AppListing {
  sitemap: boolean;
  flag: () => Promise<boolean>;
}

const ALWAYS_ON_PATHS = ['/', '/about', '/posts'] as const;

const apps: Record<AppId, AppEntry> = {
  musicPlayer: {
    path: '/music',
    abbreviation: 'MP',
    sitemap: true,
    flag: featureAppMusic,
  },
  inspirations: {
    path: '/inspirations',
    abbreviation: 'IN',
    sitemap: true,
    flag: featureAppInspirations,
  },
  bookmarks: {
    path: '/bookmarks',
    abbreviation: 'BM',
    sitemap: true,
    flag: featureAppBookmarks,
  },
  photos: {
    path: '/photos',
    abbreviation: 'PH',
    sitemap: true,
    flag: featureAppPhotos,
  },
  packageAnalyzer: {
    path: '/analyzer',
    abbreviation: 'PA',
    sitemap: true,
    flag: featureAppPackageAnalyzer,
  },
};

export function getApp(id: AppId): AppListing {
  const { path, abbreviation } = apps[id];
  return { path, abbreviation };
}

async function readAppFlags(): Promise<Record<AppId, boolean>> {
  const entries = await Promise.all(APP_IDS.map(async id => [id, await apps[id].flag()] as const));
  return Object.fromEntries(entries) as Record<AppId, boolean>;
}

export async function getEnabledApps(): Promise<AppId[]> {
  const flags = await readAppFlags();
  return APP_IDS.filter(id => flags[id]);
}

export async function assertAppEnabled(id: AppId): Promise<void> {
  const enabled = await apps[id].flag();
  if (!enabled) notFound();
}

export async function getSitemapPaths(): Promise<string[]> {
  const flags = await readAppFlags();
  return [
    ...ALWAYS_ON_PATHS,
    ...APP_IDS.filter(id => flags[id] && apps[id].sitemap).map(id => apps[id].path),
  ];
}
