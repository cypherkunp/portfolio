import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { getCollection, getCollections } from '@/lib/bookmarks';
import { AppEnabledGate } from '@/components/app-enabled-gate';
import { BookmarkList } from '@/components/bookmarks/bookmark-list';
import { Breadcrumbs } from '@/components/breadcrumbs';
import PageContainer from '@/components/layout/page-container';
import { ToolSubpageLayout } from '@/components/layout/tool-subpage-layout';
import UnderlineText from '@/components/underline-text';

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
        <PageContainer>
          <section className="flex w-full flex-col">
            <header className="mb-4 flex w-full flex-col gap-4">
              <Breadcrumbs
                items={[
                  { label: 'Bookmarks', href: '/bookmarks' },
                  { label: collection.name },
                ]}
              />
              <h2 className="text-lg font-bold tracking-tight pb-2">
                <UnderlineText>{collection.name}</UnderlineText>
              </h2>
              {collection.description ? (
                <p className="text-muted-foreground text-sm">{collection.description}</p>
              ) : null}
            </header>
            <BookmarkList bookmarks={collection.bookmarks} />
          </section>
        </PageContainer>
      </ToolSubpageLayout>
    </AppEnabledGate>
  );
}
