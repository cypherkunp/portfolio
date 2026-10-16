import semver from 'semver';

const NON_REGISTRY = /^(workspace:|catalog:|file:|link:|portal:|git\+|github:|https?:|npm:)/i;

export type VersionStatus = 'outdated' | 'current' | 'unknown';

/** `current` when the published latest already satisfies the declared range. */
export function versionStatus(configured: string, latest: string): VersionStatus {
  const range = configured.trim();
  const latestVersion = latest.trim();
  if (!range || !latestVersion || latestVersion === 'unknown') return 'unknown';
  if (NON_REGISTRY.test(range)) return 'unknown';
  if (!semver.valid(latestVersion) || !semver.validRange(range)) return 'unknown';
  return semver.satisfies(latestVersion, range, { includePrerelease: true })
    ? 'current'
    : 'outdated';
}
