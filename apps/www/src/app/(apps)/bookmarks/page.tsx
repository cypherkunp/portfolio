import { Suspense } from 'react';
import type { Metadata } from 'next';

import { getAllEnrichedBookmarks, getCollections } from '@/lib/bookmarks';
import { AppEnabledGate, appPageMetadata } from '@/components/app-enabled-gate';
import { BookmarksHeader } from '@/components/bookmarks/bookmarks-header';
import { BookmarksShell } from '@/components/bookmarks/bookmarks-shell';
import { BookmarksSkeleton } from '@/components/bookmarks/bookmarks-skeleton';
import { ToolSubpageLayout } from '@/components/layout/tool-subpage-layout';

const pageMetadata = {
  title: 'Bookmarks',
  description: 'Collections of links worth sharing — articles, places, channels, design.',
} satisfies Metadata;

export function generateMetadata(): Promise<Metadata> {
  return appPageMetadata('bookmarks', pageMetadata);
}

export default function BookmarksPage() {
  const collections = getCollections();

  return (
    <AppEnabledGate id="bookmarks">
      <ToolSubpageLayout flush>
        <div className="pb-16">
          <BookmarksHeader collections={collections} />
          <Suspense fallback={<BookmarksSkeleton />}>
            <AllBookmarks />
          </Suspense>
        </div>
      </ToolSubpageLayout>
    </AppEnabledGate>
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
