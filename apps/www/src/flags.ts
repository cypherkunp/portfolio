import { vercelAdapter } from '@flags-sdk/vercel';
import { flag } from 'flags/next';

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
