import { notFound } from 'next/navigation';
import { flag } from 'flags/next';
import { vercelAdapter } from '@flags-sdk/vercel';

const booleanOptions = [
  { value: false, label: 'Off' },
  { value: true, label: 'On' },
] as const;

function createAppFlag(key: string, description: string) {
  return flag<boolean>({
    key,
    description,
    // Visible in local dev when FLAGS isn't linked; Production uses Vercel Flags.
    defaultValue: process.env.NODE_ENV === 'development',
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

/** 404 when a given app flag is off. */
export async function assertAppEnabled(id: AppFlagId): Promise<void> {
  const enabled = await appFlagsById[id]();
  if (!enabled) notFound();
}
