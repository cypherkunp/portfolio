import { notFound } from 'next/navigation';
import {
  featureAppBookmarks,
  featureAppInspirations,
  featureAppMusic,
  featureAppPackageAnalyzer,
  featureAppPhotos,
} from '@/flags';

import { ALWAYS_ON_PATHS, appInSitemap, getApp, getAppIds, type AppId } from '@/lib/app-catalog';

const flags: Record<AppId, () => Promise<boolean>> = {
  musicPlayer: featureAppMusic,
  inspirations: featureAppInspirations,
  bookmarks: featureAppBookmarks,
  photos: featureAppPhotos,
  packageAnalyzer: featureAppPackageAnalyzer,
};

async function readAppFlags(): Promise<Record<AppId, boolean>> {
  const entries = await Promise.all(getAppIds().map(async id => [id, await flags[id]()] as const));
  return Object.fromEntries(entries) as Record<AppId, boolean>;
}

export async function getEnabledApps(): Promise<AppId[]> {
  const values = await readAppFlags();
  return getAppIds().filter(id => values[id]);
}

export async function isAppEnabled(id: AppId): Promise<boolean> {
  return flags[id]();
}

export async function assertAppEnabled(id: AppId): Promise<void> {
  if (!(await isAppEnabled(id))) notFound();
}

export async function getSitemapPaths(): Promise<string[]> {
  const values = await readAppFlags();
  return [
    ...ALWAYS_ON_PATHS,
    ...getAppIds()
      .filter(id => values[id] && appInSitemap(id))
      .map(id => getApp(id).path),
  ];
}
