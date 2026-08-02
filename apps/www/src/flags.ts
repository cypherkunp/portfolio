import { notFound } from 'next/navigation';
import { vercelAdapter } from '@flags-sdk/vercel';
import { flag } from 'flags/next';

import { resolveFlagDefaultValue } from '@/lib/flag-defaults';

export { resolveFlagDefaultValue } from '@/lib/flag-defaults';

const booleanOptions = [
  { value: false, label: 'Off' },
  { value: true, label: 'On' },
] as const;

function createAppFlag(key: string, description: string) {
  return flag<boolean>({
    key,
    description,
    // Off unless Vercel Flags says otherwise, or FEATURE_APPS_DEV_DEFAULT=true locally.
    defaultValue: resolveFlagDefaultValue(),
    options: [...booleanOptions],
    adapter: vercelAdapter(),
  });
}

/** Master switch for the Apps section on the homepage. */
export const featureAppsSupport = createAppFlag(
  'feature-apps-support',
  'Controls visibility of the Apps section on the homepage',
);

export const featureAppMusic = createAppFlag(
  'feature-app-music',
  'Controls access to the Music Player app (/music)',
);

export const featureAppInspirations = createAppFlag(
  'feature-app-inspirations',
  'Controls access to the Inspirations app (/inspirations)',
);

export const featureAppBookmarks = createAppFlag(
  'feature-app-bookmarks',
  'Controls access to the Bookmarks app (/bookmarks)',
);

export const featureAppPhotos = createAppFlag(
  'feature-app-photos',
  'Controls access to the Photos app (/photos)',
);

export const featureAppPackageAnalyzer = createAppFlag(
  'feature-app-package-analyzer',
  'Controls access to the Package Analyzer app (/analyzer)',
);

/** Flag definitions for the Vercel Flags discovery endpoint. */
export const vercelFlags = {
  featureAppsSupport,
  featureAppMusic,
  featureAppInspirations,
  featureAppBookmarks,
  featureAppPhotos,
  featureAppPackageAnalyzer,
};

export const APP_FLAG_IDS = [
  'musicPlayer',
  'inspirations',
  'bookmarks',
  'photos',
  'packageAnalyzer',
] as const;

export type AppFlagId = (typeof APP_FLAG_IDS)[number];

const appFlagsById = {
  musicPlayer: featureAppMusic,
  inspirations: featureAppInspirations,
  bookmarks: featureAppBookmarks,
  photos: featureAppPhotos,
  packageAnalyzer: featureAppPackageAnalyzer,
} as const satisfies Record<AppFlagId, (typeof vercelFlags)[keyof typeof vercelFlags]>;

/** Resolve which portfolio apps are currently enabled. */
export async function getEnabledApps(): Promise<AppFlagId[]> {
  const results = await Promise.all(
    APP_FLAG_IDS.map(async id => {
      const enabled = await appFlagsById[id]();
      return enabled ? id : null;
    }),
  );

  return results.filter((id): id is AppFlagId => id !== null);
}

export async function isAppEnabled(id: AppFlagId): Promise<boolean> {
  return appFlagsById[id]();
}

/** 404 when a given app flag is off. */
export async function assertAppEnabled(id: AppFlagId): Promise<void> {
  const enabled = await isAppEnabled(id);
  if (!enabled) notFound();
}
