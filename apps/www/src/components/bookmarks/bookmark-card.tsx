'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Globe } from 'lucide-react';

import type { Bookmark, BookmarkAccent } from '@/lib/bookmarks';
import { cn } from '@/lib/utils';

interface BookmarkCardProps {
  bookmark: Bookmark;
  accent: BookmarkAccent;
  onTagClick?: (tag: string) => void;
  showCollection?: boolean;
  collectionName?: string;
  collectionId?: string;
}

const ACCENT_BG: Record<BookmarkAccent, string> = {
  default: 'from-neutral-800 to-neutral-900',
  highlight: 'from-yellow-500/20 via-neutral-900 to-neutral-950',
  accent: 'from-teal-500/20 via-neutral-900 to-neutral-950',
  primary: 'from-pink-500/20 via-neutral-900 to-neutral-950',
  mono: 'from-emerald-500/15 via-neutral-900 to-neutral-950',
};

const ACCENT_BORDER: Record<BookmarkAccent, string> = {
  default: 'border-neutral-800/80 hover:border-neutral-700',
  highlight: 'border-neutral-800/80 hover:border-yellow-400/40',
  accent: 'border-neutral-800/80 hover:border-teal-400/40',
  primary: 'border-neutral-800/80 hover:border-pink-500/40',
  mono: 'border-neutral-800/80 hover:border-emerald-400/40',
};

function domainOf(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

export function BookmarkCard({
  bookmark,
  accent,
  onTagClick,
  showCollection,
  collectionName,
  collectionId,
}: BookmarkCardProps) {
  const [imgFailed, setImgFailed] = useState(false);
  const domain = domainOf(bookmark.url);
  const { og } = bookmark;

  return (
    <article
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-2xl border bg-neutral-950/50 transition-all duration-300',
        ACCENT_BORDER[accent],
        'hover:-translate-y-0.5 hover:shadow-[0_8px_30px_-12px_rgba(0,0,0,0.6)]',
      )}
    >
      <a
        href={bookmark.url}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute inset-0 z-10"
        aria-label={og.title}
      />

      {/* Cover */}
      <div
        className={cn(
          'relative aspect-[16/9] w-full overflow-hidden bg-linear-to-br',
          ACCENT_BG[accent],
        )}
      >
        {og.image && !imgFailed ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={og.image}
            alt=""
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            onError={() => setImgFailed(true)}
            className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            {og.favicon ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={og.favicon}
                alt=""
                loading="lazy"
                referrerPolicy="no-referrer"
                className="size-10 rounded opacity-80"
              />
            ) : (
              <Globe className="size-10 text-neutral-700" />
            )}
          </div>
        )}

        <span className="absolute top-3 left-3 z-20 flex items-center gap-1.5 rounded-full border border-neutral-800/80 bg-neutral-950/80 px-2 py-0.5 text-[10px] text-neutral-400 backdrop-blur">
          {og.favicon && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={og.favicon}
              alt=""
              loading="lazy"
              referrerPolicy="no-referrer"
              className="size-3 rounded-sm"
            />
          )}
          {domain}
        </span>

        <span className="absolute top-3 right-3 z-20 flex size-7 items-center justify-center rounded-full border border-neutral-800/80 bg-neutral-950/80 text-neutral-400 opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
          <ArrowUpRight className="size-3.5" />
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-2 p-4 sm:p-5">
        <h3 className="line-clamp-2 text-sm font-medium tracking-tight text-neutral-100 sm:text-base">
          {og.title}
        </h3>
        {(bookmark.description || og.description) && (
          <p className="line-clamp-2 text-xs leading-relaxed text-neutral-500 sm:text-[13px]">
            {bookmark.description ?? og.description}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between gap-2 pt-3">
          <div className="flex flex-wrap gap-1">
            {bookmark.tags?.slice(0, 3).map(tag => (
              <button
                key={tag}
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  onTagClick?.(tag);
                }}
                className="relative z-20 rounded-full border border-neutral-800 bg-neutral-950 px-2 py-0.5 text-[10px] text-neutral-500 transition-colors hover:border-neutral-700 hover:text-neutral-300"
              >
                {tag}
              </button>
            ))}
          </div>
          {showCollection && collectionName && collectionId && (
            <Link
              href={`/bookmarks/${collectionId}`}
              className="relative z-20 truncate text-[10px] text-neutral-600 hover:text-neutral-400"
            >
              {collectionName}
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
