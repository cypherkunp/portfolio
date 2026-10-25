import { Suspense } from 'react';
import PageContainer from '@repo/ui/components/layout/page-container';
import { RouteViewTransition } from '@repo/ui/components/layout/route-view-transition';
import { Section } from '@repo/ui/components/layout/section';
import { createFileRoute } from '@tanstack/react-router';

import { inspirationsPageHead } from '@/lib/apps-page';
import { InspirationGrid } from '@/components/inspirations/inspiration-grid';
import { ToolSubpageLayout } from '@/components/layout/tool-subpage-layout';

import { requireEnabledApp } from './-require-app';

export const Route = createFileRoute('/inspirations')({
  loader: () => requireEnabledApp('inspirations'),
  head: () => inspirationsPageHead(),
  component: InspirationsPage,
});

function InspirationsPage() {
  return (
    <RouteViewTransition>
      <ToolSubpageLayout flush>
        <PageContainer>
          <Section
            isFirstSection
            isLastSection
            title="Inspirations"
            description="A pinboard of quotes, ideas, and small truths I keep coming back to."
          >
            <Suspense fallback={null}>
              <InspirationGrid />
            </Suspense>
          </Section>
        </PageContainer>
      </ToolSubpageLayout>
    </RouteViewTransition>
  );
}
