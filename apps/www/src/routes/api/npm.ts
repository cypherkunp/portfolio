import { createFileRoute } from '@tanstack/react-router';

import { handleNpmProxy } from '@/lib/npm-proxy';

export const Route = createFileRoute('/api/npm')({
  server: {
    handlers: {
      POST: ({ request }) => handleNpmProxy(request),
    },
  },
});
