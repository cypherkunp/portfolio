import { Suspense } from 'react';
import { loadPhotos } from '@/server/photos';
import PageContainer from '@repo/ui/components/layout/page-container';
import { RouteViewTransition } from '@repo/ui/components/layout/route-view-transition';
import { Section } from '@repo/ui/components/layout/section';
import { createFileRoute } from '@tanstack/react-router';

import { photosPageHead } from '@/lib/apps-page';
import { ToolSubpageLayout } from '@/components/layout/tool-subpage-layout';
import { PhotoGrid } from '@/components/photos/photo-grid';

import { requireEnabledApp } from './-require-app';

export const Route = createFileRoute('/photos')({
  loader: async () => {
    await requireEnabledApp('photos');
    return loadPhotos();
  },
  head: () => photosPageHead(),
  component: PhotosPage,
});

function PhotoGridFallback() {
  return (
    <div className="grid grid-cols-3 gap-px sm:gap-0.5">
      {Array.from({ length: 9 }, (_, i) => (
        <div key={i} className="aspect-square bg-neutral-900" />
      ))}
    </div>
  );
}

function PhotosPage() {
  const photos = Route.useLoaderData();

  return (
    <RouteViewTransition>
      <ToolSubpageLayout flush>
        <PageContainer>
          <Section
            isFirstSection
            isLastSection
            title="Photos"
            description="A journal of places I stopped to look."
          >
            <Suspense fallback={<PhotoGridFallback />}>
              <PhotoGrid photos={photos} />
            </Suspense>
          </Section>
        </PageContainer>
      </ToolSubpageLayout>
    </RouteViewTransition>
  );
}
