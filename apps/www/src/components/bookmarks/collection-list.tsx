import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

import type { BookmarkCollection } from '@/lib/bookmarks';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import {
  catalogArrowClassName,
  catalogMetaClassName,
  catalogRowClassName,
  catalogTitleClassName,
} from '@/components/bookmarks/catalog-row';

interface CollectionListProps {
  collections: BookmarkCollection[];
}

export function CollectionList({ collections }: CollectionListProps) {
  return (
    <ol className="m-0 w-full list-none p-0 text-left">
      {collections.map((collection, index) => {
        const count = collection.bookmarks.length;

        return (
          <li key={collection.id}>
            <Link
              href={`/bookmarks/${collection.id}`}
              className={cn(catalogRowClassName, 'mb-6 items-start')}
            >
              <span className={catalogMetaClassName} aria-hidden="true">
                {index + 1}
              </span>
              <span className="flex min-w-0 flex-1 flex-col items-start gap-1">
                <span className="flex w-full min-w-0 items-start gap-2">
                  <span className={cn(catalogTitleClassName, 'min-w-0')}>{collection.name}</span>
                  <Badge variant="outline" className="shrink-0" aria-label={`${count} links`}>
                    {count}
                  </Badge>
                  <ArrowUpRight className={catalogArrowClassName} />
                </span>
                {collection.description ? (
                  <span className="text-sm text-neutral-600 dark:text-neutral-500">
                    {collection.description}
                  </span>
                ) : null}
              </span>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
