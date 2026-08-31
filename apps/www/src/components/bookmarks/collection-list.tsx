import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

import type { BookmarkCollection } from '@/lib/bookmarks';

interface CollectionListProps {
  collections: BookmarkCollection[];
}

export function CollectionList({ collections }: CollectionListProps) {
  return (
    <div>
      {collections.map(collection => (
        <Link
          key={collection.id}
          href={`/bookmarks/${collection.id}`}
          className="group mb-4 flex items-center gap-2"
        >
          <span className="w-8 shrink-0 text-sm tabular-nums text-neutral-600 dark:text-neutral-400">
            {collection.bookmarks.length}
          </span>
          <span className="group-hover:decoration-tertiary tracking-tight text-neutral-900 group-hover:underline group-hover:underline-offset-8 dark:text-neutral-100">
            {collection.name}
          </span>
          {collection.description ? (
            <span className="hidden text-sm text-neutral-600 sm:inline dark:text-neutral-500">
              {collection.description}
            </span>
          ) : null}
          <ArrowUpRight className="ml-auto size-4 shrink-0 text-neutral-600 opacity-0 transition-opacity group-hover:opacity-100 dark:text-neutral-400" />
        </Link>
      ))}
    </div>
  );
}
