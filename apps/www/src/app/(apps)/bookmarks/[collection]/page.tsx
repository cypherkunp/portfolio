import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { getCollection, getCollections } from '@/lib/bookmarks';
import { AppEnabledGate } from '@/components/app-enabled-gate';
import { BookmarkTable } from '@/components/bookmarks/bookmark-table';
import { BookmarksPageHeader } from '@/components/bookmarks/bookmarks-page-header';
import { ToolSubpageLayout } from '@/components/layout/tool-subpage-layout';

interface CollectionPageProps {
  params: Promise<{ collection: string }>;
}

export function generateStaticParams() {
  return getCollections().map(collection => ({ collection: collection.id }));
}

export async function generateMetadata({ params }: CollectionPageProps): Promise<Metadata> {
  const { collection: id } = await params;
  const collection = getCollection(id);
  if (!collection) return { title: 'Bookmarks' };
  return {
    title: `${collection.name} · Bookmarks`,
    description: collection.description || `Bookmarked links — ${collection.name}`,
  };
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { collection: id } = await params;
  const collection = getCollection(id);
  if (!collection) notFound();

  return (
    <AppEnabledGate id="bookmarks">
      <ToolSubpageLayout flush>
        <div className="pb-16">
          <BookmarksPageHeader
            title={collection.name}
            description={collection.description}
            backHref="/bookmarks"
          />
          <div className="mt-2 border-t border-neutral-900 px-1 pt-6 sm:pt-10">
            <BookmarkTable bookmarks={collection.bookmarks} />
          </div>
        </div>
      </ToolSubpageLayout>
    </AppEnabledGate>
  );
}
