export interface NpmPackageInfo {
  name: string;
  description: string;
  latestVersion: string;
  lastPublished: string;
  githubUrl: string | null;
}

export type NpmFetchErrorType = 'api' | 'rate-limit' | 'not-found' | 'invalid';

export type NpmStreamRow =
  | { ok: true; name: string; configuredVersion: string; info: NpmPackageInfo }
  | { ok: false; name: string; configuredVersion: string; error: NpmFetchErrorType };

export interface StreamPackagesArgs {
  packages: Array<{ name: string; version: string }>;
  signal?: AbortSignal;
  onResult: (row: NpmStreamRow) => void;
  /** Fatal stream-level errors (network, parse, abort, HTTP non-200). */
  onError: (error: 'api' | 'rate-limit') => void;
}

/** Must match `MAX_PACKAGES` on `/api/npm`. */
export const MAX_PACKAGES_PER_REQUEST = 200;

/**
 * Calls the `/api/npm` route which streams NDJSON. The client never talks
 * to npm directly; the server uses an auth token so we don't get 429s.
 * Large manifests are split into batches under the server's package cap.
 */
export async function streamPackagesFromApi({
  packages,
  signal,
  onResult,
  onError,
}: StreamPackagesArgs): Promise<void> {
  // Dedupe by name before batching so duplicates that span batch boundaries
  // (e.g. deps then devDeps) are not fetched twice. Keep first occurrence,
  // matching `/api/npm` within a single request.
  const seen = new Set<string>();
  const unique: typeof packages = [];
  for (const pkg of packages) {
    if (seen.has(pkg.name)) continue;
    seen.add(pkg.name);
    unique.push(pkg);
  }

  for (let i = 0; i < unique.length; i += MAX_PACKAGES_PER_REQUEST) {
    if (signal?.aborted) return;
    const batch = unique.slice(i, i + MAX_PACKAGES_PER_REQUEST);
    const ok = await streamPackagesBatch({ packages: batch, signal, onResult, onError });
    if (!ok) return;
  }
}

async function streamPackagesBatch({
  packages,
  signal,
  onResult,
  onError,
}: StreamPackagesArgs): Promise<boolean> {
  let response: Response;
  try {
    response = await fetch('/api/npm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ packages }),
      signal,
    });
  } catch (err) {
    if ((err as Error).name === 'AbortError') return false;
    onError('api');
    return false;
  }

  if (response.status === 429) {
    onError('rate-limit');
    return false;
  }
  if (!response.ok || !response.body) {
    onError('api');
    return false;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      let nl = buffer.indexOf('\n');
      while (nl !== -1) {
        const line = buffer.slice(0, nl).trim();
        buffer = buffer.slice(nl + 1);
        if (line) {
          try {
            const row = JSON.parse(line) as NpmStreamRow;
            onResult(row);
          } catch {
            // Skip malformed line; keep streaming.
          }
        }
        nl = buffer.indexOf('\n');
      }
    }

    const tail = buffer.trim();
    if (tail) {
      try {
        onResult(JSON.parse(tail) as NpmStreamRow);
      } catch {
        // ignore
      }
    }
  } catch (err) {
    if ((err as Error).name === 'AbortError') return false;
    onError('api');
    return false;
  } finally {
    reader.releaseLock();
  }

  return true;
}
