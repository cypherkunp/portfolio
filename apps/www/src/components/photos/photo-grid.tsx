'use client';

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import Image, { type ImageLoaderProps } from 'next/image';
import { cn } from '@repo/ui/lib/utils';
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Grid, type CellComponentProps } from 'react-window';

import type { Photo } from '@/lib/photo';

const COLUMN_COUNT = 3;
const INITIAL_GRID_WIDTH = 900;
const INITIAL_GRID_HEIGHT = 600;
const THUMB_WIDTH = 320;
const FULL_WIDTH = 960;
const THUMB_WIDTHS = [384, 640] as const;
const FULL_WIDTHS = [1080, 1920] as const;

function formatDate(dateStr: string) {
  const value = dateStr.includes('T') ? dateStr : `${dateStr}T00:00:00`;
  return new Date(value).toLocaleString('en-us', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  });
}

function clampedWidth(widths: readonly number[], width: number) {
  for (const size of widths) {
    if (size >= width) return size;
  }
  return widths[widths.length - 1] ?? width;
}

function optimizedSrc(src: string, width: number) {
  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=75`;
}

function thumbLoader({ src, width }: ImageLoaderProps) {
  return optimizedSrc(src, clampedWidth(THUMB_WIDTHS, width));
}

function fullLoader({ src, width }: ImageLoaderProps) {
  return optimizedSrc(src, clampedWidth(FULL_WIDTHS, width));
}

function scaledHeight(photo: Photo, width: number) {
  return Math.max(1, Math.round((width * photo.height) / Math.max(photo.width, 1)));
}

interface PhotoCellProps {
  photos: readonly Photo[];
  onOpen: (index: number) => void;
  loaded: ReadonlySet<string>;
  onLoad: (id: string) => void;
}

function PhotoCell({
  ariaAttributes,
  columnIndex,
  rowIndex,
  style,
  photos,
  onOpen,
  loaded,
  onLoad,
}: CellComponentProps<PhotoCellProps>) {
  const index = rowIndex * COLUMN_COUNT + columnIndex;
  const photo = photos[index];

  if (!photo) {
    return <div style={style} {...ariaAttributes} />;
  }

  return (
    <div style={style} {...ariaAttributes}>
      <button
        type="button"
        onClick={() => onOpen(index)}
        className="group absolute inset-px overflow-hidden bg-neutral-900 focus-visible:ring-2 focus-visible:ring-neutral-200 focus-visible:outline-none sm:inset-0.5"
        aria-label={`Open photo: ${photo.alt}`}
      >
        {/* `sizes` makes Next set `src` to the largest configured width. */}
        <Image
          loader={thumbLoader}
          src={photo.src}
          alt={photo.alt}
          width={THUMB_WIDTH}
          height={THUMB_WIDTH}
          priority={rowIndex === 0 && columnIndex === 0}
          className={cn(
            'h-full w-full object-cover transition-[opacity,transform] duration-500',
            loaded.has(photo.id) ? 'scale-100 opacity-100' : 'scale-105 opacity-0',
            'group-hover:scale-[1.02]',
          )}
          onLoad={() => onLoad(photo.id)}
        />

        <div
          aria-hidden
          className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/55 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
        >
          <span className="text-sm text-neutral-300 tabular-nums">{formatDate(photo.date)}</span>
          {photo.location ? (
            <span className="px-3 text-center text-sm tracking-tight text-white">
              {photo.location}
            </span>
          ) : null}
        </div>
      </button>
    </div>
  );
}

interface PhotoGridProps {
  photos: Photo[];
}

export function PhotoGrid({ photos }: PhotoGridProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [loaded, setLoaded] = useState<Set<string>>(new Set());
  const [fullLoadedId, setFullLoadedId] = useState<string | null>(null);
  const [gridWidth, setGridWidth] = useState(INITIAL_GRID_WIDTH);
  const [frameHeight, setFrameHeight] = useState(INITIAL_GRID_HEIGHT);
  const frameRef = useRef<HTMLDivElement>(null);
  const lightboxRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);

  const total = photos.length;
  const selected = selectedIndex === null ? null : photos[selectedIndex];
  const cellSize = Math.max(1, Math.floor(gridWidth / COLUMN_COUNT));
  const rowCount = Math.ceil(total / COLUMN_COUNT);

  const onLoad = useCallback((id: string) => {
    setLoaded(prev => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  const onGridResize = useCallback(({ width }: { width: number }) => {
    if (width <= 0) return;
    setGridWidth(current => (Math.abs(current - width) < 1 ? current : width));
  }, []);

  useLayoutEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    function measure() {
      const top = frame?.getBoundingClientRect().top ?? 0;
      const next = Math.max(320, Math.floor(window.innerHeight - Math.max(top, 0) - 16));
      setFrameHeight(current => (Math.abs(current - next) < 1 ? current : next));
    }

    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
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

  if (photos.length === 0) {
    return <p className="text-sm text-neutral-500">Drop images into public/photos.</p>;
  }

  return (
    <>
      <div ref={frameRef} className="w-full" style={{ height: frameHeight }}>
        <Grid
          cellComponent={PhotoCell}
          cellProps={{ photos, onOpen: open, loaded, onLoad }}
          columnCount={COLUMN_COUNT}
          columnWidth={cellSize}
          defaultHeight={INITIAL_GRID_HEIGHT}
          defaultWidth={INITIAL_GRID_WIDTH}
          onResize={onGridResize}
          overscanCount={1}
          rowCount={rowCount}
          rowHeight={cellSize}
          className="overscroll-y-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          style={{ height: '100%', width: '100%' }}
        />
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
            <div className="flex min-w-0 items-center gap-2">
              <span className="text-sm text-neutral-400 tabular-nums">
                {formatDate(selected.date)}
              </span>
              {selected.location && (
                <span className="truncate tracking-tight text-neutral-100">
                  {selected.location}
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-neutral-500 tabular-nums">
                {(selectedIndex ?? 0) + 1} / {total}
              </span>
              <button
                type="button"
                onClick={close}
                className="rounded-full bg-neutral-900/80 p-2 text-neutral-400 transition-colors hover:bg-neutral-800 hover:text-neutral-100"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={prev}
            className="absolute top-1/2 left-4 z-10 hidden -translate-y-1/2 rounded-full bg-neutral-900/60 p-2.5 text-neutral-400 transition-all hover:bg-neutral-800 hover:text-neutral-100 sm:block"
            aria-label="Previous photo"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={next}
            className="absolute top-1/2 right-4 z-10 hidden -translate-y-1/2 rounded-full bg-neutral-900/60 p-2.5 text-neutral-400 transition-all hover:bg-neutral-800 hover:text-neutral-100 sm:block"
            aria-label="Next photo"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="relative flex h-[80vh] w-[92vw] max-w-6xl items-center justify-center">
            <Image
              loader={thumbLoader}
              src={selected.src}
              alt=""
              width={THUMB_WIDTH}
              height={scaledHeight(selected, THUMB_WIDTH)}
              aria-hidden
              className="max-h-full max-w-full object-contain opacity-80 blur-md"
            />
            <Image
              key={selected.id}
              loader={fullLoader}
              src={selected.src}
              alt={selected.alt}
              width={FULL_WIDTH}
              height={scaledHeight(selected, FULL_WIDTH)}
              priority
              className={cn(
                'absolute max-h-full max-w-full object-contain transition-opacity duration-200',
                fullLoadedId === selected.id ? 'opacity-100' : 'opacity-0',
              )}
              onLoad={() => setFullLoadedId(selected.id)}
            />
          </div>

          <div className="absolute inset-x-0 bottom-0 px-4 py-6 text-center lg:px-8">
            <p className="text-xs leading-relaxed text-neutral-500">{selected.alt}</p>
          </div>

          <div className="absolute inset-x-0 bottom-14 flex items-center justify-center gap-6 sm:hidden">
            <button
              type="button"
              onClick={prev}
              className="rounded-full bg-neutral-900/80 p-3 text-neutral-400"
              aria-label="Previous"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
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
