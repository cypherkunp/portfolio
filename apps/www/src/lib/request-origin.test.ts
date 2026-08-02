import assert from 'node:assert/strict';
import { afterEach, describe, it } from 'node:test';

import { isAllowedRequestOrigin } from './request-origin.ts';

const originalNodeEnv = process.env.NODE_ENV;
const originalAppUrl = process.env.NEXT_PUBLIC_APP_URL;

afterEach(() => {
  process.env.NODE_ENV = originalNodeEnv;
  if (originalAppUrl === undefined) delete process.env.NEXT_PUBLIC_APP_URL;
  else process.env.NEXT_PUBLIC_APP_URL = originalAppUrl;
});

describe('isAllowedRequestOrigin', () => {
  it('allows any origin in development', () => {
    process.env.NODE_ENV = 'development';
    const req = new Request('http://localhost/api/npm', { method: 'POST' });
    assert.equal(isAllowedRequestOrigin(req), true);
  });

  it('requires matching Origin in production', () => {
    process.env.NODE_ENV = 'production';
    process.env.NEXT_PUBLIC_APP_URL = 'https://devvrat.uk';

    const ok = new Request('https://devvrat.uk/api/npm', {
      method: 'POST',
      headers: { origin: 'https://devvrat.uk' },
    });
    assert.equal(isAllowedRequestOrigin(ok), true);

    const bad = new Request('https://devvrat.uk/api/npm', {
      method: 'POST',
      headers: { origin: 'https://evil.example' },
    });
    assert.equal(isAllowedRequestOrigin(bad), false);

    const missing = new Request('https://devvrat.uk/api/npm', { method: 'POST' });
    assert.equal(isAllowedRequestOrigin(missing), false);
  });
});
