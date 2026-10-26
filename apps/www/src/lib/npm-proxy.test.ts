import { afterEach, describe, expect, it, vi } from 'vitest';

import { handleNpmProxy } from '@/lib/npm-proxy';

function post(body: unknown) {
  return new Request('http://localhost/api/npm', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('handleNpmProxy', () => {
  it('returns HTTP 400 for an invalid body', async () => {
    const response = await handleNpmProxy(post({ packages: [] }));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({ error: 'invalid request' });
  });

  it('returns HTTP 400 for a package name the registry would reject', async () => {
    const response = await handleNpmProxy(
      post({ packages: [{ name: 'react native', version: '1.0.0' }] }),
    );

    expect(response.status).toBe(400);
  });

  it('streams NDJSON rows for a valid body', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            name: 'react',
            description: 'UI library',
            'dist-tags': { latest: '19.0.0' },
            time: { '19.0.0': '2026-01-01T00:00:00.000Z' },
            repository: { url: 'https://github.com/facebook/react.git' },
          }),
          { status: 200, headers: { 'content-type': 'application/json' } },
        ),
      ),
    );

    const response = await handleNpmProxy(
      post({ packages: [{ name: 'react', version: '^18.2.0' }] }),
    );

    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toContain('application/x-ndjson');

    const row = JSON.parse((await response.text()).trim());
    expect(row).toEqual({
      ok: true,
      name: 'react',
      configuredVersion: '^18.2.0',
      info: {
        name: 'react',
        description: 'UI library',
        latestVersion: '19.0.0',
        lastPublished: '2026-01-01T00:00:00.000Z',
        githubUrl: 'https://github.com/facebook/react',
        openIssues: 0,
      },
    });
  });
});
