import { createFileRoute } from '@tanstack/react-router';
import { verifyAccess, version } from 'flags';

import { flagsDiscovery } from '@/lib/machine-urls';

export const Route = createFileRoute('/.well-known/vercel/flags')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const access = await verifyAccess(request.headers.get('Authorization'));
        if (!access) return Response.json(null, { status: 401 });

        return Response.json(await flagsDiscovery(), {
          headers: { 'x-flags-sdk-version': version },
        });
      },
    },
  },
});
