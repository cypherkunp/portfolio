// Streamed npm registry proxy. Authenticated server-side requests avoid 429s.
import { NextResponse } from 'next/server';
import { z } from 'zod';

import {
  fetchPackagesBatch,
  isValidPackageName,
  type NpmPackageInfo,
} from '@/lib/npm-registry';

const MAX_PACKAGES = 1500;

const PackageInput = z.object({
  name: z
    .string()
    .min(1)
    .max(214)
    .refine(isValidPackageName, { message: 'invalid npm package name' }),
  version: z.string().max(64).default(''),
});

const Body = z.object({
  packages: z.array(PackageInput).min(1).max(MAX_PACKAGES),
});

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
  let parsed: z.infer<typeof Body>;
  try {
    const json = await request.json();
    parsed = Body.parse(json);
  } catch (err) {
    const message = err instanceof z.ZodError ? err.issues : 'invalid body';
    return NextResponse.json({ error: 'invalid request', details: message }, { status: 400 });
  }

  // Dedupe by name; keep the first configured version we saw for each.
  const versionByName = new Map<string, string>();
  for (const p of parsed.packages) {
    if (!versionByName.has(p.name)) versionByName.set(p.name, p.version);
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
          { signal: abortController.signal, concurrency: 10 },
        );
      } catch (err) {
        // Surface a final error frame; client treats unknown errors as 'api'.
        const message =
          err instanceof Error && err.name === 'AbortError' ? 'aborted' : 'api';
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
