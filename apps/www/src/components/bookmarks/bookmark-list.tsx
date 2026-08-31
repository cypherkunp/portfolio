import { ArrowUpRight } from 'lucide-react';

import type { Bookmark } from '@/lib/bookmarks';
import { hostnameOf } from '@/lib/bookmarks';
import { BookmarkThumb } from '@/components/bookmarks/bookmark-thumb';

interface BookmarkListProps {
  bookmarks: Bookmark[];
}

export function BookmarkList({ bookmarks }: BookmarkListProps) {
  if (bookmarks.length === 0) {
    return <div className="text-neutral-500">No bookmarks in this collection yet.</div>;
  }

  return (
    <div>
      {bookmarks.map(bookmark => {
        const title = bookmark.title || hostnameOf(bookmark.url);
        const host = hostnameOf(bookmark.url);

        return (
          <a
            key={bookmark.url}
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group mb-4 flex items-center gap-2"
          >
            <span className="w-8 shrink-0">
              <BookmarkThumb src={bookmark.image} title={title} />
            </span>
            <span className="group-hover:decoration-tertiary tracking-tight text-neutral-900 group-hover:underline group-hover:underline-offset-8 dark:text-neutral-100">
              {title}
            </span>
            {title !== host ? (
              <span className="hidden text-sm text-neutral-600 sm:inline dark:text-neutral-500">
                {host}
              </span>
            ) : null}
            <ArrowUpRight className="ml-auto size-4 shrink-0 text-neutral-600 opacity-0 transition-opacity group-hover:opacity-100 dark:text-neutral-400" />
          </a>
        );
      })}
    </div>
  );
}
