'use client';

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

import type { Bookmark, BookmarkAccent } from '@/lib/bookmarks';
import { cn } from '@/lib/utils';

interface BookmarkRowProps {
  bookmark: Bookmark;
  accent: BookmarkAccent;
  onTagClick?: (tag: string) => void;
  showCollection?: boolean;
  collectionName?: string;
  collectionId?: string;
}

const ACCENT_DOT: Record<BookmarkAccent, string> = {
  default: 'bg-neutral-600',
  highlight: 'bg-yellow-400',
  accent: 'bg-teal-400',
  primary: 'bg-pink-500',
  mono: 'bg-emerald-400',
};

function domainOf(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

export function BookmarkRow({
  bookmark,
  accent,
  onTagClick,
  showCollection,
  collectionName,
  collectionId,
}: BookmarkRowProps) {
  const domain = domainOf(bookmark.url);
  const { og } = bookmark;

  return (
    <li className="group relative">
      <a
        href={bookmark.url}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute inset-0 z-10"
        aria-label={og.title}
      />

      <div className="flex items-start gap-3 px-4 py-3 transition-colors group-hover:bg-neutral-900/40 sm:px-5 sm:py-4">
        <span
          className={cn('mt-1.5 size-1.5 shrink-0 rounded-full', ACCENT_DOT[accent])}
          aria-hidden
        />

        <div className="flex size-6 shrink-0 items-center justify-center overflow-hidden rounded border border-neutral-800/80 bg-neutral-950">
          {og.favicon ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={og.favicon}
              alt=""
              loading="lazy"
              referrerPolicy="no-referrer"
              className="size-4"
            />
          ) : (
            <span className="text-[10px] text-neutral-500">{domain.charAt(0).toUpperCase()}</span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-sm font-medium text-neutral-200 group-hover:text-neutral-100">
              {og.title}
            </h3>
            <span className="hidden truncate text-[11px] text-neutral-600 sm:inline">{domain}</span>
          </div>
          <p className="mt-0.5 line-clamp-1 text-xs text-neutral-500">
            {bookmark.description ?? og.description ?? domain}
          </p>
        </div>

        <div className="hidden items-center gap-1 sm:flex">
          {bookmark.tags?.slice(0, 2).map(tag => (
            <button
              key={tag}
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();
                onTagClick?.(tag);
              }}
              className="relative z-20 rounded-full border border-neutral-800 px-2 py-0.5 text-[10px] text-neutral-500 hover:border-neutral-700 hover:text-neutral-300"
            >
              {tag}
            </button>
          ))}
          {showCollection && collectionName && collectionId && (
            <Link
              href={`/bookmarks/${collectionId}`}
              className="relative z-20 ml-1 truncate text-[10px] text-neutral-600 hover:text-neutral-400"
            >
              {collectionName}
            </Link>
          )}
        </div>

        <ArrowUpRight className="mt-0.5 size-3.5 shrink-0 text-neutral-700 transition-colors group-hover:text-neutral-400" />
      </div>
    </li>
  );
}
