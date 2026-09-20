import { ArrowUpRight } from 'lucide-react';

import type { Bookmark } from '@/lib/bookmark-store';
import { hostnameOf } from '@/lib/bookmark-store';
import { BookmarkThumb } from '@/components/bookmarks/bookmark-thumb';
import {
  catalogArrowClassName,
  catalogAsideClassName,
  catalogMetaClassName,
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

  const showThumbs = bookmarks.some(bookmark => Boolean(bookmark.image));

  return (
    <ol className="m-0 w-full list-none p-0 text-left">
      {bookmarks.map((bookmark, index) => {
        const title = bookmark.title || hostnameOf(bookmark.url);
        const host = hostnameOf(bookmark.url);

        return (
          <li key={bookmark.url}>
            <a
              href={bookmark.url}
              target="_blank"
              rel="noopener noreferrer"
              className={catalogRowClassName}
            >
              <span className={catalogMetaClassName} aria-hidden="true">
                {index + 1}
              </span>
              {showThumbs ? (
                <span className="size-8 shrink-0" aria-hidden="true">
                  {bookmark.image ? <BookmarkThumb src={bookmark.image} /> : null}
                </span>
              ) : null}
              <span className={catalogTitleClassName}>{title}</span>
              {title !== host ? <span className={catalogAsideClassName}>{host}</span> : null}
              <ArrowUpRight className={catalogArrowClassName} />
            </a>
          </li>
        );
      })}
    </ol>
  );
}
