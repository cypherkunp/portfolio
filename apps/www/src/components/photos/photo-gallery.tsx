'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Camera,
  ChevronLeft,
  ChevronRight,
  MapPin,
  X,
} from 'lucide-react';

import { PHOTOS, type Photo } from '@/config/photos';
import { cn } from '@/lib/utils';

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function groupByMonth(photos: Photo[]) {
  const groups: { label: string; photos: Photo[] }[] = [];
  const map = new Map<string, Photo[]>();

  for (const photo of photos) {
    const d = new Date(photo.date);
    const key = `${d.getFullYear()}-${String(d.getMonth()).padStart(2, '0')}`;
    const label = d.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
    if (!map.has(key)) {
      map.set(key, []);
      groups.push({ label, photos: map.get(key)! });
    }
    map.get(key)!.push(photo);
  }

  return groups;
}

export function PhotoGallery() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const lightboxRef = useRef<HTMLDivElement>(null);

  const filtered = PHOTOS;
  const groups = useMemo(() => groupByMonth(filtered), [filtered]);

  const handleImageLoad = useCallback((id: string) => {
    setLoadedImages(prev => new Set(prev).add(id));
  }, []);

  const openLightbox = useCallback(
    (photo: Photo) => {
      const idx = filtered.findIndex(p => p.id === photo.id);
      setSelectedIndex(idx);
    },
    [filtered],
  );

  const closeLightbox = useCallback(() => setSelectedIndex(null), []);

  const goNext = useCallback(() => {
    if (selectedIndex === null) return;
    setSelectedIndex((selectedIndex + 1) % filtered.length);
  }, [selectedIndex, filtered.length]);

  const goPrev = useCallback(() => {
    if (selectedIndex === null) return;
    setSelectedIndex((selectedIndex - 1 + filtered.length) % filtered.length);
  }, [selectedIndex, filtered.length]);

  useEffect(() => {
    if (selectedIndex === null) return;

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    }

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [selectedIndex, closeLightbox, goNext, goPrev]);

  const selectedPhoto = selectedIndex !== null ? filtered[selectedIndex] : null;

  return (
    <>
      <div>
        {groups.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-neutral-600">
            <Camera className="mb-4 h-10 w-10 text-neutral-700" />
            <p className="text-sm">No photos in this category yet.</p>
          </div>
        )}

        {groups.map(group => (
          <section key={group.label} className="mb-10">
            <h2 className="mb-3 text-xs font-medium tracking-widest text-neutral-500 uppercase">
              {group.label}
            </h2>

            <div className="grid grid-cols-2 gap-1 sm:grid-cols-3">
              {group.photos.map((photo, i) => {
                const isPortrait = photo.height > photo.width;

                return (
                  <button
                    key={photo.id}
                    onClick={() => openLightbox(photo)}
                    className={cn(
                      'group relative overflow-hidden rounded-sm bg-neutral-900',
                      isPortrait && 'row-span-2',
                    )}
                    style={{
                      aspectRatio: isPortrait ? `${photo.width} / ${photo.height}` : '1 / 1',
                    }}
                  >
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      fill
                      sizes="(max-width: 640px) 50vw, 33vw"
                      className={cn(
                        'object-cover transition-all duration-500',
                        loadedImages.has(photo.id)
                          ? 'scale-100 opacity-100'
                          : 'scale-105 opacity-0',
                        'group-hover:scale-[1.03]',
                      )}
                      onLoad={() => handleImageLoad(photo.id)}
                      style={{ animationDelay: `${i * 50}ms` }}
                    />

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <div className="absolute inset-x-0 bottom-0 translate-y-2 p-2.5 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                      {photo.location && (
                        <span className="flex items-center gap-1 text-[10px] font-medium tracking-wide text-neutral-300">
                          <MapPin className="h-2.5 w-2.5" />
                          {photo.location}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      {/* Lightbox */}
      {selectedPhoto && (
        <div
          ref={lightboxRef}
          className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/95 duration-200"
          onClick={e => {
            if (e.target === e.currentTarget) closeLightbox();
          }}
          role="dialog"
          aria-modal="true"
          aria-label={selectedPhoto.alt}
        >
          {/* Top bar */}
          <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-4 py-4 lg:px-8">
            <div className="flex items-center gap-3">
              {selectedPhoto.location && (
                <span className="flex items-center gap-1.5 text-xs text-neutral-400">
                  <MapPin className="h-3 w-3" />
                  {selectedPhoto.location}
                </span>
              )}
              <span className="flex items-center gap-1.5 text-xs text-neutral-500">
                <Calendar className="h-3 w-3" />
                {formatDate(selectedPhoto.date)}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-neutral-600 tabular-nums">
                {selectedIndex! + 1} / {filtered.length}
              </span>
              <button
                onClick={closeLightbox}
                className="rounded-full bg-neutral-900/80 p-2 text-neutral-400 transition-colors hover:bg-neutral-800 hover:text-neutral-100"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Nav arrows */}
          <button
            onClick={goPrev}
            className="absolute top-1/2 left-4 z-10 -translate-y-1/2 rounded-full bg-neutral-900/60 p-2.5 text-neutral-400 opacity-0 transition-all hover:bg-neutral-800 hover:text-neutral-100 sm:opacity-100"
            aria-label="Previous photo"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={goNext}
            className="absolute top-1/2 right-4 z-10 -translate-y-1/2 rounded-full bg-neutral-900/60 p-2.5 text-neutral-400 opacity-0 transition-all hover:bg-neutral-800 hover:text-neutral-100 sm:opacity-100"
            aria-label="Next photo"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Image */}
          <div className="relative h-[80vh] w-[90vw] max-w-6xl">
            <Image
              key={selectedPhoto.id}
              src={selectedPhoto.src}
              alt={selectedPhoto.alt}
              fill
              priority
              sizes="90vw"
              className="animate-in fade-in zoom-in-95 object-contain duration-300"
            />
          </div>

          {/* Bottom caption */}
          <div className="absolute inset-x-0 bottom-0 px-4 py-6 text-center lg:px-8">
            <p className="text-xs leading-relaxed text-neutral-500">{selectedPhoto.alt}</p>
          </div>

          {/* Mobile nav */}
          <div className="absolute inset-x-0 bottom-14 flex items-center justify-center gap-6 sm:hidden">
            <button
              onClick={goPrev}
              className="rounded-full bg-neutral-900/80 p-3 text-neutral-400"
              aria-label="Previous"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              onClick={goNext}
              className="rounded-full bg-neutral-900/80 p-3 text-neutral-400"
              aria-label="Next"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
