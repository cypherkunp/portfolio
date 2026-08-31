import type { Metadata } from 'next';

import { getCollections } from '@/lib/bookmarks';
import { AppEnabledGate } from '@/components/app-enabled-gate';
import { CollectionList } from '@/components/bookmarks/collection-list';
import PageContainer from '@/components/layout/page-container';
import { Section } from '@/components/layout/section';
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
        <PageContainer>
          <Section
            isFirstSection
            isLastSection
            title="Bookmarks"
            description="Collections of links worth keeping."
          >
            <CollectionList collections={collections} />
          </Section>
        </PageContainer>
      </ToolSubpageLayout>
    </AppEnabledGate>
  );
}
