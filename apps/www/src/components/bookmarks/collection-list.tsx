import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

import type { BookmarkCollection } from '@/lib/bookmarks';
import { cn } from '@/lib/utils';
import {
  catalogArrowClassName,
  catalogAsideClassName,
  catalogMetaClassName,
  catalogRowClassName,
  catalogTitleClassName,
} from '@/components/bookmarks/catalog-row';

interface CollectionListProps {
  collections: BookmarkCollection[];
}

export function CollectionList({ collections }: CollectionListProps) {
  return (
    <div>
      {collections.map(collection => (
        <Link key={collection.id} href={`/bookmarks/${collection.id}`} className={catalogRowClassName}>
          <span className={cn(catalogMetaClassName, 'text-right')}>
            {collection.bookmarks.length}
          </span>
          <span className={catalogTitleClassName}>{collection.name}</span>
          {collection.description ? (
            <span className={catalogAsideClassName}>{collection.description}</span>
          ) : null}
          <ArrowUpRight className={catalogArrowClassName} />
        </Link>
      ))}
    </div>
  );
}
