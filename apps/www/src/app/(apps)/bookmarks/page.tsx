import type { Metadata } from 'next';

import { getCollections } from '@/lib/bookmarks';
import { brandedTitle, socialMetadata } from '@/lib/seo';
import { AppEnabledGate } from '@/components/app-enabled-gate';
import { CollectionList } from '@/components/bookmarks/collection-list';
import PageContainer from '@/components/layout/page-container';
import { ToolSubpageLayout } from '@/components/layout/tool-subpage-layout';
import UnderlineText from '@/components/underline-text';

const title = 'Bookmarks';
const description = 'Collections of links worth keeping.';

export const metadata: Metadata = {
  title,
  description,
  ...socialMetadata({
    title: brandedTitle(title),
    description,
    url: '/bookmarks',
  }),
};

export default function BookmarksPage() {
  const collections = getCollections();

  return (
    <AppEnabledGate id="bookmarks">
      <ToolSubpageLayout flush>
        <PageContainer>
          <section className="flex w-full flex-col items-start text-left">
            <header className="mb-4 flex w-full flex-col items-start gap-4">
              <h1 className="pb-2 text-lg font-bold tracking-tight">
                <UnderlineText>Bookmarks</UnderlineText>
              </h1>
              <p className="text-muted-foreground text-sm">Collections of links worth keeping.</p>
            </header>
            <CollectionList collections={collections} />
          </section>
        </PageContainer>
      </ToolSubpageLayout>
    </AppEnabledGate>
  );
}
