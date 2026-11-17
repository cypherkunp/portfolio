import { Suspense } from 'react';
import PageContainer from '@repo/ui/components/layout/page-container';
import { RouteViewTransition } from '@repo/ui/components/layout/route-view-transition';
import { Section } from '@repo/ui/components/layout/section';
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
      <ToolSubpageLayout flush>
        <PageContainer>
          <Section
            isFirstSection
            isLastSection
            title="Music"
            description="Songs made in collaboration with AI artists."
          >
            <Suspense fallback={null}>
              <MusicPlayer />
            </Suspense>
          </Section>
        </PageContainer>
      </ToolSubpageLayout>
    </RouteViewTransition>
  );
}
