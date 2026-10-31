import { createFileRoute } from '@tanstack/react-router';

import { legacyRedirect } from '@/lib/machine-urls';

export const Route = createFileRoute('/connect')({
  server: {
    handlers: {
      GET: ({ request }) => {
        const redirect = legacyRedirect(new URL(request.url).pathname);
        if (!redirect) return new Response(null, { status: 404 });
        return new Response(null, {
          status: redirect.status,
          headers: { Location: redirect.location },
        });
      },
    },
  },
});
