import { Suspense } from 'react';
import type { Metadata } from 'next';

import { getAllEnrichedBookmarks, getCollections } from '@/lib/bookmarks';
import { BookmarksHeader } from '@/components/bookmarks/bookmarks-header';
import { BookmarksShell } from '@/components/bookmarks/bookmarks-shell';
import { BookmarksSkeleton } from '@/components/bookmarks/bookmarks-skeleton';
import { ToolSubpageLayout } from '@/components/layout/tool-subpage-layout';

export const metadata: Metadata = {
  title: 'Bookmarks',
  description: 'Collections of links worth sharing — articles, places, channels, design.',
};

export default function BookmarksPage() {
  const collections = getCollections();

  return (
    <ToolSubpageLayout flush>
      <div className="pb-16">
        <BookmarksHeader collections={collections} />
        <Suspense fallback={<BookmarksSkeleton />}>
          <AllBookmarks />
        </Suspense>
      </div>
    </ToolSubpageLayout>
  );
}

async function AllBookmarks() {
  const [bookmarks, collections] = await Promise.all([
    getAllEnrichedBookmarks(),
    Promise.resolve(getCollections()),
  ]);

  return (
    <BookmarksShell
      collections={collections}
      activeCollectionId={null}
      bookmarks={bookmarks}
      shareUrl="/bookmarks"
    />
  );
}
