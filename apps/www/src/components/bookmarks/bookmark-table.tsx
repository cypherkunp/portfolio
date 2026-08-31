import type { Bookmark } from '@/lib/bookmarks';
import { hostnameOf } from '@/lib/bookmarks';
import { BookmarkThumb } from '@/components/bookmarks/bookmark-thumb';

interface BookmarkTableProps {
  bookmarks: Bookmark[];
}

export function BookmarkTable({ bookmarks }: BookmarkTableProps) {
  if (bookmarks.length === 0) {
    return <p className="px-1 text-sm text-neutral-500">No bookmarks in this collection yet.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-neutral-900 text-[11px] font-medium tracking-[0.14em] text-neutral-500 uppercase">
            <th className="w-12 py-2 pr-3 font-medium">
              <span className="sr-only">Image</span>
            </th>
            <th className="py-2 pr-6 font-medium">Name</th>
            <th className="hidden py-2 font-medium sm:table-cell">Link</th>
          </tr>
        </thead>
        <tbody>
          {bookmarks.map(bookmark => {
            const title = bookmark.title || hostnameOf(bookmark.url);
            const host = hostnameOf(bookmark.url);

            return (
              <tr
                key={bookmark.url}
                className="border-b border-neutral-900/70 transition-colors hover:bg-neutral-900/40"
              >
                <td className="py-2 pr-3">
                  <a
                    href={bookmark.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    tabIndex={-1}
                    aria-hidden
                  >
                    <BookmarkThumb src={bookmark.image} title={title} />
                  </a>
                </td>
                <td className="py-2 pr-6">
                  <a
                    href={bookmark.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-neutral-100 hover:text-yellow-400"
                  >
                    {title}
                  </a>
                </td>
                <td className="hidden py-2 sm:table-cell">
                  <a
                    href={bookmark.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-xs text-neutral-500 hover:text-neutral-300"
                  >
                    {host}
                  </a>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
