import Link from 'next/link';

import type { BookmarkCollection } from '@/lib/bookmarks';

interface CollectionTableProps {
  collections: BookmarkCollection[];
}

export function CollectionTable({ collections }: CollectionTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-neutral-900 text-[11px] font-medium tracking-[0.14em] text-neutral-500 uppercase">
            <th className="py-2 pr-6 font-medium">Name</th>
            <th className="py-2 pr-6 font-medium">Description</th>
            <th className="py-2 text-right font-medium">Count</th>
          </tr>
        </thead>
        <tbody>
          {collections.map(collection => (
            <tr
              key={collection.id}
              className="border-b border-neutral-900/70 transition-colors hover:bg-neutral-900/40"
            >
              <td className="py-3 pr-6">
                <Link
                  href={`/bookmarks/${collection.id}`}
                  className="font-medium text-neutral-100 hover:text-yellow-400"
                >
                  {collection.name}
                </Link>
              </td>
              <td className="max-w-xl py-3 pr-6 text-neutral-500">{collection.description}</td>
              <td className="py-3 text-right font-mono text-xs text-neutral-500 tabular-nums">
                {collection.bookmarks.length}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
