// Streamed npm registry proxy. Authenticated server-side requests avoid 429s.
import { NextResponse } from 'next/server';
import { z } from 'zod';

import { dedupePackagesByName, NpmBodySchema } from '@/lib/npm-api';
import { fetchPackagesBatch, type NpmPackageInfo } from '@/lib/npm-registry';
import { clientIp, consumeRateLimit } from '@/lib/rate-limit';
import { isAllowedRequestOrigin } from '@/lib/request-origin';

const RATE_LIMIT = { limit: 10, windowMs: 60_000 } as const;
const FETCH_CONCURRENCY = 6;

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
      error: 'api' | 'rate-limit' | 'not-found';
    };

export async function POST(request: Request) {
  if (!isAllowedRequestOrigin(request)) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }

  const ip = clientIp(request);
  const limited = consumeRateLimit(`npm:${ip}`, RATE_LIMIT);
  if (!limited.ok) {
    return NextResponse.json(
      { error: 'rate-limit' },
      {
        status: 429,
        headers: { 'Retry-After': String(limited.retryAfterSec) },
      },
    );
  }

  let parsed: z.infer<typeof NpmBodySchema>;
  try {
    const json = await request.json();
    parsed = NpmBodySchema.parse(json);
  } catch (err) {
    const message = err instanceof z.ZodError ? err.issues : 'invalid body';
    return NextResponse.json({ error: 'invalid request', details: message }, { status: 400 });
  }

  const versionByName = dedupePackagesByName(parsed.packages);
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
          { signal: abortController.signal, concurrency: FETCH_CONCURRENCY },
        );
      } catch (err) {
        // Surface a final error frame; client treats unknown errors as 'api'.
        const message = err instanceof Error && err.name === 'AbortError' ? 'aborted' : 'api';
        write({ ok: false, name: '', configuredVersion: '', error: message as 'api' });
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
