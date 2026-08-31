import type { Metadata } from 'next';

import { getCollections } from '@/lib/bookmarks';
import { AppEnabledGate } from '@/components/app-enabled-gate';
import { CollectionList } from '@/components/bookmarks/collection-list';
import PageContainer from '@/components/layout/page-container';
import { ToolSubpageLayout } from '@/components/layout/tool-subpage-layout';
import UnderlineText from '@/components/underline-text';

export const metadata: Metadata = {
  title: 'Bookmarks',
  description: 'Collections of links worth keeping.',
};

export default function BookmarksPage() {
  const collections = getCollections();

  return (
    <AppEnabledGate id="bookmarks">
      <ToolSubpageLayout flush>
        <PageContainer>
          <section className="flex w-full flex-col">
            <header className="mb-4 flex w-full flex-col gap-4">
              <h2 className="text-lg font-bold tracking-tight pb-2">
                <UnderlineText>Bookmarks</UnderlineText>
              </h2>
              <p className="text-muted-foreground text-sm">Collections of links worth keeping.</p>
            </header>
            <CollectionList collections={collections} />
          </section>
        </PageContainer>
      </ToolSubpageLayout>
    </AppEnabledGate>
  );
}
