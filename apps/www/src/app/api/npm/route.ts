// Streamed npm registry proxy. Authenticated server-side requests avoid 429s.
import { NextResponse } from 'next/server';
import { featureAppPackageAnalyzer } from '@/flags';
import { z } from 'zod';

import { fetchPackagesBatch, isValidPackageName, type NpmPackageInfo } from '@/lib/npm-registry';

const MAX_PACKAGES = 200;
const CONCURRENCY = 4;
const RATE_LIMIT = 20;
const RATE_WINDOW_MS = 60_000;

const hits = new Map<string, { count: number; resetAt: number }>();

const PackageItem = z.object({
  name: z.string(),
  version: z.union([z.string(), z.number()]).optional(),
});

const Body = z.object({
  packages: z.array(z.unknown()).min(1).max(MAX_PACKAGES),
});

export type NpmStreamError = 'api' | 'rate-limit' | 'not-found' | 'invalid';

export type NpmStreamRow =
  | {
      ok: true;
      name: string;
      configuredVersion: string;
      info: NpmPackageInfo;
    }
  | {
      ok: false;
      name: string;
      configuredVersion: string;
      error: NpmStreamError;
    };

function clientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (!forwarded) return 'unknown';
  return forwarded.split(',')[0]?.trim() || 'unknown';
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || entry.resetAt <= now) {
    hits.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_LIMIT;
}

export function resetNpmRateLimit() {
  hits.clear();
}

export async function POST(request: Request) {
  if (!(await featureAppPackageAnalyzer())) {
    return NextResponse.json({ error: 'not found' }, { status: 404 });
  }

  if (isRateLimited(clientIp(request))) {
    return NextResponse.json({ error: 'rate limit' }, { status: 429 });
  }

  let parsed: z.infer<typeof Body>;
  try {
    parsed = Body.parse(await request.json());
  } catch {
    return NextResponse.json({ error: 'invalid request' }, { status: 400 });
  }

  const versionByName = new Map<string, string>();
  const invalid: NpmStreamRow[] = [];

  for (const raw of parsed.packages) {
    const item = PackageItem.safeParse(raw);
    const name = item.success ? item.data.name : '';
    const configuredVersion = item.success ? String(item.data.version ?? '') : '';
    if (!item.success || !isValidPackageName(name)) {
      invalid.push({ ok: false, name, configuredVersion, error: 'invalid' });
      continue;
    }
    if (!versionByName.has(name)) versionByName.set(name, configuredVersion);
  }

  const uniqueNames = Array.from(versionByName.keys());
  const encoder = new TextEncoder();
  const abortController = new AbortController();
  request.signal.addEventListener('abort', () => abortController.abort());

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const write = (row: NpmStreamRow) => {
        controller.enqueue(encoder.encode(JSON.stringify(row) + '\n'));
      };

      try {
        for (const row of invalid) write(row);
        if (uniqueNames.length === 0) return;

        await fetchPackagesBatch(
          uniqueNames,
          (name, result) => {
            const configuredVersion = versionByName.get(name) ?? '';
            if (result.ok) {
              write({ ok: true, name, configuredVersion, info: result.info });
            } else {
              write({ ok: false, name, configuredVersion, error: result.error });
            }
          },
          { signal: abortController.signal, concurrency: CONCURRENCY },
        );
      } catch (err) {
        const error = err instanceof Error && err.name === 'AbortError' ? 'aborted' : 'api';
        if (error !== 'aborted') {
          write({ ok: false, name: '', configuredVersion: '', error: 'api' });
        }
      } finally {
        controller.close();
      }
    },
    cancel() {
      abortController.abort();
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'application/x-ndjson; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Accel-Buffering': 'no',
    },
  });
}
