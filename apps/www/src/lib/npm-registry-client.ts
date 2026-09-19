export interface NpmPackageInfo {
  name: string;
  description: string;
  latestVersion: string;
  lastPublished: string;
  githubUrl: string | null;
  openIssues: number;
}

export type NpmFetchErrorType = 'api' | 'rate-limit' | 'not-found';

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

/**
 * Calls the `/api/npm` route which streams NDJSON. The client never talks
 * to npm directly; the server uses an auth token so we don't get 429s.
 */
export async function streamPackagesFromApi({
  packages,
  signal,
  onResult,
  onError,
}: StreamPackagesArgs): Promise<void> {
  let response: Response;
  try {
    response = await fetch('/api/npm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ packages }),
      signal,
    });
  } catch (err) {
    if ((err as Error).name === 'AbortError') return;
    onError('api');
    return;
  }

  if (response.status === 429) {
    onError('rate-limit');
    return;
  }
  if (!response.ok || !response.body) {
    onError('api');
    return;
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
    if ((err as Error).name === 'AbortError') return;
    onError('api');
  } finally {
    reader.releaseLock();
  }
}
