import type { Metadata } from 'next';

import { getCollections } from '@/lib/bookmarks';
import { AppEnabledGate } from '@/components/app-enabled-gate';
import { BookmarksPageHeader } from '@/components/bookmarks/bookmarks-page-header';
import { CollectionTable } from '@/components/bookmarks/collection-table';
import { ToolSubpageLayout } from '@/components/layout/tool-subpage-layout';

export const metadata: Metadata = {
  title: 'Bookmarks',
  description: 'Collections of links worth keeping.',
};

export default function BookmarksPage() {
  const collections = getCollections();

  return (
    <AppEnabledGate id="bookmarks">
      <ToolSubpageLayout flush>
        <div className="pb-16">
          <BookmarksPageHeader title="Links worth keeping." />
          <div className="mt-2 border-t border-neutral-900 px-1 pt-6 sm:pt-10">
            <CollectionTable collections={collections} />
          </div>
        </div>
      </ToolSubpageLayout>
    </AppEnabledGate>
  );
}
