import { afterEach, describe, expect, it, vi } from 'vitest';

import { POST, resetNpmRateLimit } from '@/app/api/npm/route';

const { analyzerEnabled } = vi.hoisted(() => ({
  analyzerEnabled: vi.fn(async () => true),
}));

vi.mock('@/flags', () => ({
  featureAppPackageAnalyzer: () => analyzerEnabled(),
}));

function post(body: unknown, ip = '203.0.113.10') {
  return POST(
    new Request('http://localhost/api/npm', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-forwarded-for': ip,
      },
      body: JSON.stringify(body),
    }),
  );
}

describe('POST /api/npm', () => {
  afterEach(() => {
    analyzerEnabled.mockResolvedValue(true);
    resetNpmRateLimit();
    vi.unstubAllGlobals();
  });

  it('returns 404 when the analyzer flag is off', async () => {
    analyzerEnabled.mockResolvedValue(false);
    const response = await post({ packages: [{ name: 'react', version: '1.0.0' }] });
    expect(response.status).toBe(404);
  });

  it('returns a generic 400 and no parser details', async () => {
    const response = await POST(
      new Request('http://localhost/api/npm', {
        method: 'POST',
        headers: { 'x-forwarded-for': '203.0.113.11' },
        body: '{',
      }),
    );
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: 'invalid request' });
  });

  it('rejects a batch over 200 packages', async () => {
    const packages = Array.from({ length: 201 }, (_, index) => ({
      name: `pkg-${index}`,
      version: '1.0.0',
    }));
    const response = await post({ packages }, '203.0.113.12');
    expect(response.status).toBe(400);
  });

  it('streams invalid names and fetches the rest', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        return new Response(
          JSON.stringify({
            name: 'react',
            description: 'ui',
            'dist-tags': { latest: '19.0.0' },
            time: { '19.0.0': '2026-01-01T00:00:00.000Z' },
            repository: 'git@github.com:facebook/react.git',
          }),
          { status: 200, headers: { 'content-type': 'application/json' } },
        );
      }),
    );

    const response = await post(
      {
        packages: [
          { name: 'not a package', version: '1.0.0' },
          { name: 'react', version: '^19.0.0' },
        ],
      },
      '203.0.113.13',
    );

    expect(response.status).toBe(200);
    const rows = (await response.text())
      .trim()
      .split('\n')
      .map(line => JSON.parse(line));

    expect(rows[0]).toMatchObject({ ok: false, name: 'not a package', error: 'invalid' });
    expect(rows[1]).toMatchObject({
      ok: true,
      name: 'react',
      info: { githubUrl: 'https://github.com/facebook/react', latestVersion: '19.0.0' },
    });
    expect(rows[1].info.openIssues).toBeUndefined();
  });

  it('returns 429 after the per-ip limit', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(
        async () =>
          new Response('{}', { status: 404, headers: { 'content-type': 'application/json' } }),
      ),
    );

    const ip = '203.0.113.14';
    for (let i = 0; i < 20; i++) {
      const response = await post({ packages: [{ name: 'react', version: '1.0.0' }] }, ip);
      expect(response.status).toBe(200);
    }
    const blocked = await post({ packages: [{ name: 'react', version: '1.0.0' }] }, ip);
    expect(blocked.status).toBe(429);
  });
});
