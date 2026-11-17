import { describe, expect, it } from 'vitest';

import { npmProxy } from '@/lib/npm-proxy';

function post(body: string) {
  return new Request('http://127.0.0.1/api/npm', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body,
  });
}

describe('npmProxy', () => {
  it('rejects invalid JSON with HTTP 400', async () => {
    const response = await npmProxy(post('{'));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({ error: 'invalid request' });
  });

  it('rejects an empty packages array', async () => {
    const response = await npmProxy(post(JSON.stringify({ packages: [] })));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({ error: 'invalid request' });
  });
});
