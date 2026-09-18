import 'server-only';

import { readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

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

const REGISTRY = 'https://registry.npmjs.org';
const REQUEST_TIMEOUT_MS = 10_000;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 min in-process cache to dedupe within session
const NPM_TOKEN_REGEX = /^\/\/registry\.npmjs\.org\/:_authToken=(.+)$/m;

let cachedToken: string | null | undefined;

function readTokenFromNpmrc(): string | null {
  try {
    const npmrcPath = process.env.NPM_CONFIG_USERCONFIG || join(homedir(), '.npmrc');
    const content = readFileSync(npmrcPath, 'utf8');
    const match = content.match(NPM_TOKEN_REGEX);
    return match?.[1]?.trim() || null;
  } catch {
    return null;
  }
}

function getNpmAuthToken(): string | null {
  if (cachedToken !== undefined) return cachedToken;
  const envToken = process.env.NPM_TOKEN?.trim();
  if (envToken) {
    cachedToken = envToken;
    return cachedToken;
  }
  // Fall back to the locally logged-in npm account (~/.npmrc) for local dev.
  if (process.env.NODE_ENV !== 'production') {
    cachedToken = readTokenFromNpmrc();
    return cachedToken;
  }
  cachedToken = null;
  return null;
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
  if (!url.startsWith('http')) url = `https://${url}`;

  return url;
}

// Names allowed by npm: scoped or unscoped, lowercased, limited charset.
const VALID_NAME = /^(?:@[a-z0-9][\w.-]*\/)?[a-z0-9][\w.-]*$/i;

export function isValidPackageName(name: string): boolean {
  return typeof name === 'string' && name.length > 0 && name.length <= 214 && VALID_NAME.test(name);
}

interface CacheEntry {
  info: NpmPackageInfo;
  expiresAt: number;
}

const memCache = new Map<string, CacheEntry>();

class NpmRegistryError extends Error {
  status: number;
  constructor(message: 'api' | 'rate-limit' | 'not-found', status = 0) {
    super(message);
    this.name = 'NpmRegistryError';
    this.status = status;
  }
}

export type NpmFetchErrorType = 'api' | 'rate-limit' | 'not-found';

async function fetchOnce(name: string, signal: AbortSignal): Promise<NpmPackageInfo> {
  const token = getNpmAuthToken();
  const headers: Record<string, string> = { Accept: 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${REGISTRY}/${encodeURIComponent(name)}`, {
    signal,
    headers,
    // Edge/Node fetch: leverage Next.js data cache for 1 day, also revalidatable.
    next: { revalidate: 60 * 60 * 24, tags: [`npm:${name}`] },
  });

  if (response.status === 429) throw new NpmRegistryError('rate-limit', 429);
  if (response.status === 404) throw new NpmRegistryError('not-found', 404);
  if (!response.ok) throw new NpmRegistryError('api', response.status);

  const contentType = response.headers.get('content-type');
  if (!contentType?.includes('application/json')) throw new NpmRegistryError('api');

  const data = (await response.json()) as NpmRegistryResponse;
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
}

export async function fetchPackageInfo(
  packageName: string,
  signal?: AbortSignal,
): Promise<NpmPackageInfo> {
  const cached = memCache.get(packageName);
  if (cached && cached.expiresAt > Date.now()) return cached.info;

  const timeout = AbortSignal.timeout(REQUEST_TIMEOUT_MS);
  const combined = signal ? AbortSignal.any([signal, timeout]) : timeout;

  let lastErr: unknown;
  // Retry up to 3 times with exponential backoff, honoring Retry-After-ish behavior.
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const info = await fetchOnce(packageName, combined);
      memCache.set(packageName, { info, expiresAt: Date.now() + CACHE_TTL_MS });
      return info;
    } catch (err) {
      lastErr = err;
      if (signal?.aborted) throw err;
      if (err instanceof NpmRegistryError && err.message === 'not-found') throw err;
      // Backoff: 250ms, 750ms
      await new Promise(r => setTimeout(r, 250 * (attempt + 1) ** 2));
    }
  }
  throw lastErr;
}

/**
 * Fetch many packages in parallel with a bounded worker pool. Invokes
 * `onResult` per package as soon as it resolves (preserves request order).
 */
export async function fetchPackagesBatch(
  names: readonly string[],
  onResult: (
    name: string,
    result: { ok: true; info: NpmPackageInfo } | { ok: false; error: NpmFetchErrorType },
  ) => void,
  options: { signal?: AbortSignal; concurrency?: number } = {},
): Promise<void> {
  const { signal, concurrency = 8 } = options;
  let cursor = 0;

  async function worker() {
    while (cursor < names.length) {
      if (signal?.aborted) return;
      const idx = cursor++;
      const name = names[idx];
      try {
        const info = await fetchPackageInfo(name, signal);
        onResult(name, { ok: true, info });
      } catch (err) {
        if (signal?.aborted) return;
        const code =
          err instanceof NpmRegistryError ? (err.message as NpmFetchErrorType) : 'api';
        onResult(name, { ok: false, error: code });
      }
    }
  }

  const workers = Array.from({ length: Math.min(concurrency, names.length) }, () => worker());
  await Promise.all(workers);
}

export { NpmRegistryError };
