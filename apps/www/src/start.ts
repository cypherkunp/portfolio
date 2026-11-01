import { createCsrfMiddleware, createMiddleware, createStart } from '@tanstack/react-start';

import { securityHeaders } from '@/lib/machine-urls';

const securityHeaderMiddleware = createMiddleware().server(async ({ next }) => {
  const result = await next();
  for (const header of securityHeaders()) {
    result.response.headers.set(header.key, header.value);
  }
  return result;
});

// Document loads send Sec-Fetch-Site: none. Limit the check to server functions.
const csrfMiddleware = createCsrfMiddleware({
  filter: ctx => ctx.handlerType === 'serverFn',
});

export const startInstance = createStart(() => ({
  requestMiddleware: [securityHeaderMiddleware, csrfMiddleware],
}));
