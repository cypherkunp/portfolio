import { createFileRoute } from '@tanstack/react-router';

import { robotsDocument } from '@/lib/machine-urls';

export const Route = createFileRoute('/robots.txt')({
  server: {
    handlers: {
      GET: () =>
        new Response(robotsDocument(), {
          headers: { 'Content-Type': 'text/plain' },
        }),
    },
  },
});
