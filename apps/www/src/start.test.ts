import { describe, expect, it, vi } from 'vitest';

import { startInstance } from './start';

vi.mock('@/lib/machine-urls', () => ({
  securityHeaders: () => [],
}));

const csrfSymbol = Symbol.for('tanstack-start:csrf-middleware');

type CsrfCtx = {
  handlerType: 'serverFn' | 'router';
  request: Request;
  next: () => Promise<{ continued: true }>;
};

function csrfServer() {
  const options = startInstance.getOptions();
  if (options instanceof Promise) {
    throw new Error('start options must be synchronous');
  }

  const middleware = options.requestMiddleware?.find(item => csrfSymbol in item);
  expect(middleware).toBeDefined();

  const server = (middleware as { options?: { server?: (ctx: CsrfCtx) => unknown } }).options
    ?.server;
  expect(server).toEqual(expect.any(Function));
  return server as (ctx: CsrfCtx) => Promise<unknown>;
}

function request(fetchSite: string) {
  return new Request('https://kunal.dev/_serverFn/loadHomeApps', {
    headers: { 'sec-fetch-site': fetchSite },
  });
}

describe('startInstance', () => {
  it('rejects cross-site server function requests', async () => {
    const result = await csrfServer()({
      handlerType: 'serverFn',
      request: request('cross-site'),
      next: async () => ({ continued: true }),
    });

    expect(result).toBeInstanceOf(Response);
    expect(result).toHaveProperty('status', 403);
  });

  it('allows same-origin server function requests', async () => {
    const result = await csrfServer()({
      handlerType: 'serverFn',
      request: request('same-origin'),
      next: async () => ({ continued: true }),
    });

    expect(result).toEqual({ continued: true });
  });

  it('skips CSRF checks for document requests', async () => {
    const result = await csrfServer()({
      handlerType: 'router',
      request: request('none'),
      next: async () => ({ continued: true }),
    });

    expect(result).toEqual({ continued: true });
  });
});
