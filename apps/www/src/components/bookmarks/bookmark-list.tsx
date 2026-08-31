import { ArrowUpRight } from 'lucide-react';

import type { Bookmark } from '@/lib/bookmarks';
import { hostnameOf } from '@/lib/bookmarks';
import { BookmarkThumb } from '@/components/bookmarks/bookmark-thumb';
import {
  catalogArrowClassName,
  catalogAsideClassName,
  catalogRowClassName,
  catalogTitleClassName,
} from '@/components/bookmarks/catalog-row';

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
            className={catalogRowClassName}
          >
            {bookmark.image ? (
              <span className="size-8 shrink-0">
                <BookmarkThumb src={bookmark.image} />
              </span>
            ) : null}
            <span className={catalogTitleClassName}>{title}</span>
            {title !== host ? <span className={catalogAsideClassName}>{host}</span> : null}
            <ArrowUpRight className={catalogArrowClassName} />
          </a>
        );
      })}
    </div>
  );
}
