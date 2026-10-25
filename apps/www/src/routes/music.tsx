import { Suspense } from 'react';
import { RouteViewTransition } from '@repo/ui/components/layout/route-view-transition';
import { createFileRoute } from '@tanstack/react-router';

import { musicPageHead } from '@/lib/apps-page';
import { ToolSubpageLayout } from '@/components/layout/tool-subpage-layout';
import MusicPlayer from '@/components/music-player';

import { requireEnabledApp } from './-require-app';

export const Route = createFileRoute('/music')({
  loader: () => requireEnabledApp('musicPlayer'),
  head: () => musicPageHead(),
  component: MusicPage,
});

function MusicPage() {
  return (
    <RouteViewTransition>
      <ToolSubpageLayout title="Music" flush>
        <Suspense fallback={null}>
          <MusicPlayer />
        </Suspense>
      </ToolSubpageLayout>
    </RouteViewTransition>
  );
}
