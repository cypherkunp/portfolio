import { createFileRoute } from '@tanstack/react-router';

import { ogProxy } from '@/lib/machine-urls';

export const Route = createFileRoute('/api/og')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const result = await ogProxy(new URL(request.url).searchParams.get('url'));
        const headers = new Headers({ 'content-type': 'application/json' });
        if (result.cacheControl) headers.set('Cache-Control', result.cacheControl);
        return new Response(JSON.stringify(result.body), { status: result.status, headers });
      },
    },
  },
});
