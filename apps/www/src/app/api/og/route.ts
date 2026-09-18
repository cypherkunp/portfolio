import { NextResponse } from 'next/server';

import { fetchOg } from '@/lib/og';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'Missing `url` query param.' }, { status: 400 });
  }

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return NextResponse.json({ error: 'Invalid URL.' }, { status: 400 });
  }
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return NextResponse.json({ error: 'Only http(s) URLs are allowed.' }, { status: 400 });
  }

  const og = await fetchOg(parsed.toString());
  if (!og) {
    return NextResponse.json({ error: 'Could not fetch OG data.' }, { status: 502 });
  }

  return NextResponse.json(og, {
    headers: { 'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800' },
  });
}
