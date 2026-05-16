'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Heart,
  MapPin,
  MessageCircle,
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

interface PhotoGridProps {
  photos?: Photo[];
}

export function PhotoGrid({ photos = PHOTOS }: PhotoGridProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [loaded, setLoaded] = useState<Set<string>>(new Set());
  const lightboxRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);

  const total = photos.length;
  const selected = useMemo(
    () => (selectedIndex === null ? null : photos[selectedIndex]),
    [photos, selectedIndex],
  );

  const onLoad = useCallback((id: string) => {
    setLoaded(prev => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  const open = useCallback((idx: number) => setSelectedIndex(idx), []);
  const close = useCallback(() => setSelectedIndex(null), []);

  const next = useCallback(() => {
    setSelectedIndex(i => (i === null ? i : (i + 1) % total));
  }, [total]);

  const prev = useCallback(() => {
    setSelectedIndex(i => (i === null ? i : (i - 1 + total) % total));
  }, [total]);

  useEffect(() => {
    if (selectedIndex === null) return;

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight') next();
      else if (e.key === 'ArrowLeft') prev();
    }

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [selectedIndex, close, next, prev]);

  return (
    <>
      <div className="grid grid-cols-3 gap-px sm:gap-0.5">
        {photos.map((photo, i) => (
          <button
            key={photo.id}
            onClick={() => open(i)}
            className="group relative aspect-square overflow-hidden bg-neutral-900 focus-visible:ring-2 focus-visible:ring-neutral-200 focus-visible:outline-none"
            aria-label={`Open photo: ${photo.alt}`}
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="(max-width: 768px) 33vw, (max-width: 1024px) 25vw, 280px"
              priority={i < 6}
              className={cn(
                'object-cover transition-[opacity,transform] duration-500 will-change-transform',
                loaded.has(photo.id) ? 'scale-100 opacity-100' : 'scale-105 opacity-0',
                'group-hover:scale-[1.02]',
              )}
              onLoad={() => onLoad(photo.id)}
            />

            <div
              aria-hidden
              className="absolute inset-0 flex items-center justify-center gap-5 bg-black/55 text-sm font-semibold text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100"
            >
              <span className="flex items-center gap-1.5">
                <Heart className="h-4 w-4 fill-white" />
                {((Number(photo.id) * 73) % 900) + 12}
              </span>
              <span className="flex items-center gap-1.5">
                <MessageCircle className="h-4 w-4 fill-white" />
                {((Number(photo.id) * 17) % 60) + 1}
              </span>
            </div>
          </button>
        ))}
      </div>

      {selected && (
        <div
          ref={lightboxRef}
          className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/95 duration-150"
          onClick={e => {
            if (e.target === e.currentTarget) close();
          }}
          onTouchStart={e => {
            touchStartX.current = e.touches[0]?.clientX ?? null;
          }}
          onTouchEnd={e => {
            if (touchStartX.current === null) return;
            const dx = (e.changedTouches[0]?.clientX ?? 0) - touchStartX.current;
            touchStartX.current = null;
            if (Math.abs(dx) < 50) return;
            if (dx < 0) next();
            else prev();
          }}
          role="dialog"
          aria-modal="true"
          aria-label={selected.alt}
        >
          <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-4 py-4 lg:px-8">
            <div className="flex items-center gap-3">
              {selected.location && (
                <span className="flex items-center gap-1.5 text-xs text-neutral-400">
                  <MapPin className="h-3 w-3" />
                  {selected.location}
                </span>
              )}
              <span className="flex items-center gap-1.5 text-xs text-neutral-500">
                <Calendar className="h-3 w-3" />
                {formatDate(selected.date)}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-neutral-500 tabular-nums">
                {(selectedIndex ?? 0) + 1} / {total}
              </span>
              <button
                onClick={close}
                className="rounded-full bg-neutral-900/80 p-2 text-neutral-400 transition-colors hover:bg-neutral-800 hover:text-neutral-100"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <button
            onClick={prev}
            className="absolute top-1/2 left-4 z-10 hidden -translate-y-1/2 rounded-full bg-neutral-900/60 p-2.5 text-neutral-400 transition-all hover:bg-neutral-800 hover:text-neutral-100 sm:block"
            aria-label="Previous photo"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={next}
            className="absolute top-1/2 right-4 z-10 hidden -translate-y-1/2 rounded-full bg-neutral-900/60 p-2.5 text-neutral-400 transition-all hover:bg-neutral-800 hover:text-neutral-100 sm:block"
            aria-label="Next photo"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="relative h-[80vh] w-[92vw] max-w-6xl">
            <Image
              key={selected.id}
              src={selected.src}
              alt={selected.alt}
              fill
              priority
              sizes="92vw"
              className="animate-in fade-in zoom-in-95 object-contain duration-200"
            />
          </div>

          <div className="absolute inset-x-0 bottom-0 px-4 py-6 text-center lg:px-8">
            <p className="text-xs leading-relaxed text-neutral-500">{selected.alt}</p>
          </div>

          <div className="absolute inset-x-0 bottom-14 flex items-center justify-center gap-6 sm:hidden">
            <button
              onClick={prev}
              className="rounded-full bg-neutral-900/80 p-3 text-neutral-400"
              aria-label="Previous"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              onClick={next}
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
