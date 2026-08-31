import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { getCollection, getCollections } from '@/lib/bookmarks';
import { AppEnabledGate } from '@/components/app-enabled-gate';
import { BookmarkList } from '@/components/bookmarks/bookmark-list';
import PageContainer from '@/components/layout/page-container';
import { Section } from '@/components/layout/section';
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
        <PageContainer>
          <Link
            href="/bookmarks"
            className="mb-4 inline-block text-sm text-neutral-600 hover:underline hover:underline-offset-8 dark:text-neutral-400"
          >
            Bookmarks
          </Link>
          <Section
            isFirstSection
            isLastSection
            title={collection.name}
            description={collection.description || undefined}
          >
            <BookmarkList bookmarks={collection.bookmarks} />
          </Section>
        </PageContainer>
      </ToolSubpageLayout>
    </AppEnabledGate>
  );
}
