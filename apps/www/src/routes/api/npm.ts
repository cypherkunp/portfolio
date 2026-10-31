import { createFileRoute } from '@tanstack/react-router';

import { npmProxy } from '@/lib/npm-proxy';

export const Route = createFileRoute('/api/npm')({
  server: {
    handlers: {
      POST: ({ request }) => npmProxy(request),
    },
  },
});
