export interface NpmPackageInfo {
  name: string;
  description: string;
  latestVersion: string;
  lastPublished: string;
  githubUrl: string | null;
  openIssues: number;
}

interface NpmRegistryResponse {
  name: string;
  description?: string;
  'dist-tags'?: { latest?: string };
  time?: Record<string, string>;
  repository?: { type?: string; url?: string } | string;
  bugs?: { url?: string };
}

function cleanGithubUrl(repoField: unknown): string | null {
  let url = '';

  if (typeof repoField === 'string') {
    url = repoField;
  } else if (repoField && typeof repoField === 'object' && 'url' in repoField) {
    url = (repoField as { url: string }).url || '';
  }

  if (!url) return null;

  url = url
    .replace(/^git\+/, '')
    .replace(/^ssh:\/\/git@github\.com/, 'https://github.com')
    .replace(/^git:\/\//, 'https://')
    .replace(/\.git$/, '');

  if (!url.includes('github.com')) return null;

  if (!url.startsWith('http')) {
    url = `https://${url}`;
  }

  return url;
}

export async function fetchPackageInfo(
  packageName: string,
  signal?: AbortSignal,
): Promise<NpmPackageInfo> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10_000);

  const combinedSignal = signal
    ? AbortSignal.any([signal, controller.signal])
    : controller.signal;

  try {
    const response = await fetch(`https://registry.npmjs.org/${encodeURIComponent(packageName)}`, {
      signal: combinedSignal,
      headers: { Accept: 'application/json' },
    });

    if (response.status === 429) {
      throw new Error('rate-limit');
    }

    if (!response.ok) {
      throw new Error('api');
    }

    const contentType = response.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      throw new Error('api');
    }

    const data: NpmRegistryResponse = await response.json();
    const latestVersion = data['dist-tags']?.latest || 'unknown';
    const timeEntries = data.time || {};
    const lastPublished = timeEntries[latestVersion] || timeEntries.modified || '';

    return {
      name: data.name,
      description: data.description || '',
      latestVersion,
      lastPublished,
      githubUrl: cleanGithubUrl(data.repository),
      openIssues: 0,
    };
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function fetchPackagesSequentially(
  packages: Array<{ name: string; version: string }>,
  onProgress: (info: NpmPackageInfo & { configuredVersion: string }, index: number) => void,
  onError: (error: 'api' | 'rate-limit') => void,
  signal?: AbortSignal,
): Promise<void> {
  for (let i = 0; i < packages.length; i++) {
    if (signal?.aborted) return;

    const pkg = packages[i];
    try {
      const info = await fetchPackageInfo(pkg.name, signal);
      onProgress({ ...info, configuredVersion: pkg.version }, i);
    } catch (err) {
      if (signal?.aborted) return;

      const message = err instanceof Error ? err.message : 'api';
      if (message === 'rate-limit') {
        onError('rate-limit');
        return;
      }
      onError('api');
      return;
    }

    if (i < packages.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
}
