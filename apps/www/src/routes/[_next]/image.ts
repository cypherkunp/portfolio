import { createFileRoute } from '@tanstack/react-router';

import { renditionFor } from '@/lib/photo-rendition';

export const Route = createFileRoute('/_next/image')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const rendition = await renditionFor({
          url: url.searchParams.get('url'),
          width: url.searchParams.get('w'),
        });
        if (!rendition) return new Response(null, { status: 404 });

        return new Response(new Uint8Array(rendition.bytes), {
          headers: {
            'Content-Type': rendition.contentType,
            'Cache-Control': 'public, max-age=86400',
          },
        });
      },
    },
  },
});
