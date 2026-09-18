import { Suspense } from 'react';
import type { Metadata } from 'next';

import { getPhotos } from '@/lib/photos';
import { AppEnabledGate } from '@/components/app-enabled-gate';
import PageContainer from '@/components/layout/page-container';
import { Section } from '@/components/layout/section';
import { ToolSubpageLayout } from '@/components/layout/tool-subpage-layout';
import { PhotoGrid } from '@/components/photos/photo-grid';

export const metadata: Metadata = {
  title: 'Photos',
  description: 'A journal of places I stopped to look.',
};

function PhotoGridFallback() {
  return (
    <div className="grid grid-cols-3 gap-px sm:gap-0.5">
      {Array.from({ length: 9 }, (_, i) => (
        <div key={i} className="aspect-square bg-neutral-900" />
      ))}
    </div>
  );
}

async function Photos() {
  const photos = await getPhotos();
  return <PhotoGrid photos={photos} />;
}

export default function PhotosPage() {
  return (
    <AppEnabledGate id="photos">
      <ToolSubpageLayout flush>
        <PageContainer>
          <Section
            isFirstSection
            isLastSection
            title="Photos"
            description="A journal of places I stopped to look."
          >
            <Suspense fallback={<PhotoGridFallback />}>
              <Photos />
            </Suspense>
          </Section>
        </PageContainer>
      </ToolSubpageLayout>
    </AppEnabledGate>
  );
}
