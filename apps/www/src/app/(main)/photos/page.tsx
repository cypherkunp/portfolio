import type { Metadata } from 'next';

import { PhotoGallery } from '@/components/photos/photo-gallery';

export const metadata: Metadata = {
  title: 'Photos',
  description: 'A visual journal of moments captured through my lens.',
};

export default function PhotosPage() {
  return (
    <div className="py-8">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-100">Through the lens</h1>
        <p className="mt-2 text-sm leading-relaxed text-neutral-500">
          Moments, places, and textures I find worth remembering. A collection of visual stories
          from walks, travels, and the everyday in-between.
        </p>
      </header>

      <PhotoGallery />
    </div>
  );
}
