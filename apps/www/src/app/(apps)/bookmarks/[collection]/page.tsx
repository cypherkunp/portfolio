import { Suspense } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { getCollection, getCollections, getEnrichedCollection } from '@/lib/bookmarks';
import { AppEnabledGate, appPageMetadata } from '@/components/app-enabled-gate';
import { BookmarksHeader } from '@/components/bookmarks/bookmarks-header';
import { BookmarksShell } from '@/components/bookmarks/bookmarks-shell';
import { BookmarksSkeleton } from '@/components/bookmarks/bookmarks-skeleton';
import { ToolSubpageLayout } from '@/components/layout/tool-subpage-layout';

interface CollectionPageProps {
  params: Promise<{ collection: string }>;
}

export function generateStaticParams() {
  return getCollections().map(c => ({ collection: c.id }));
}

export async function generateMetadata({ params }: CollectionPageProps): Promise<Metadata> {
  const { collection: id } = await params;
  const c = getCollection(id);
  if (!c) return appPageMetadata('bookmarks', { title: 'Bookmarks' });
  return appPageMetadata('bookmarks', {
    title: `${c.name} · Bookmarks`,
    description: c.description ?? `Bookmarked links — ${c.name}`,
  });
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { collection: id } = await params;
  const exists = getCollection(id);
  if (!exists) notFound();

  const collections = getCollections();

  return (
    <AppEnabledGate id="bookmarks">
      <ToolSubpageLayout flush>
        <div className="pb-16">
          <BookmarksHeader collections={collections} activeCollectionId={id} />
          <Suspense fallback={<BookmarksSkeleton />}>
            <CollectionView id={id} />
          </Suspense>
        </div>
      </ToolSubpageLayout>
    </AppEnabledGate>
  );
}

async function CollectionView({ id }: { id: string }) {
  const enriched = await getEnrichedCollection(id);
  if (!enriched) notFound();

  return (
    <BookmarksShell
      collections={getCollections()}
      activeCollectionId={id}
      bookmarks={enriched.bookmarks}
      shareUrl={`/bookmarks/${id}`}
      heading={enriched.name}
    />
  );
}
