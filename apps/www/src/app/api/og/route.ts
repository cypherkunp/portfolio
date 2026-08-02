import { NextResponse } from 'next/server';

import { fetchOg } from '@/lib/og';
import { clientIp, consumeRateLimit } from '@/lib/rate-limit';
import { assertSafeFetchUrl, UnsafeUrlError } from '@/lib/safe-url';

const RATE_LIMIT = { limit: 30, windowMs: 60_000 } as const;

export async function GET(request: Request) {
  const ip = clientIp(request);
  const limited = consumeRateLimit(`og:${ip}`, RATE_LIMIT);
  if (!limited.ok) {
    return NextResponse.json(
      { error: 'Too many requests.' },
      {
        status: 429,
        headers: { 'Retry-After': String(limited.retryAfterSec) },
      },
    );
  }

  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'Missing `url` query param.' }, { status: 400 });
  }

  try {
    await assertSafeFetchUrl(url);
  } catch (err) {
    const message = err instanceof UnsafeUrlError ? err.message : 'Invalid URL.';
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const og = await fetchOg(url);
  if (!og) {
    return NextResponse.json({ error: 'Could not fetch OG data.' }, { status: 502 });
  }

  return NextResponse.json(og, {
    headers: { 'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800' },
  });
}
