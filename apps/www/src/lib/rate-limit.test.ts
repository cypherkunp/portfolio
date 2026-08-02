import assert from 'node:assert/strict';
import { beforeEach, describe, it } from 'node:test';

import { consumeRateLimit, resetRateLimitStore } from './rate-limit.ts';

describe('consumeRateLimit', () => {
  beforeEach(() => {
    resetRateLimitStore();
  });

  it('allows up to the limit within a window', () => {
    assert.equal(consumeRateLimit('a', { limit: 2, windowMs: 60_000 }).ok, true);
    assert.equal(consumeRateLimit('a', { limit: 2, windowMs: 60_000 }).ok, true);
    const blocked = consumeRateLimit('a', { limit: 2, windowMs: 60_000 });
    assert.equal(blocked.ok, false);
    if (!blocked.ok) assert.ok(blocked.retryAfterSec >= 1);
  });

  it('isolates keys', () => {
    assert.equal(consumeRateLimit('a', { limit: 1, windowMs: 60_000 }).ok, true);
    assert.equal(consumeRateLimit('b', { limit: 1, windowMs: 60_000 }).ok, true);
    assert.equal(consumeRateLimit('a', { limit: 1, windowMs: 60_000 }).ok, false);
  });
});
