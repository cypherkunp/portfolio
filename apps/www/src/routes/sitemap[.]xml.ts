import { createFileRoute } from '@tanstack/react-router';

import { sitemapDocument } from '@/lib/machine-urls';

export const Route = createFileRoute('/sitemap.xml')({
  server: {
    handlers: {
      GET: async () =>
        new Response(await sitemapDocument(), {
          headers: { 'Content-Type': 'application/xml' },
        }),
    },
  },
});
