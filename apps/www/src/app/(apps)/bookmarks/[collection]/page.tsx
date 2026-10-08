import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Badge } from '@repo/ui/components/badge';
import { Breadcrumbs } from '@repo/ui/components/breadcrumbs';
import PageContainer from '@repo/ui/components/layout/page-container';
import UnderlineText from '@repo/ui/components/underline-text';

import { getCollection, getCollections } from '@/lib/bookmarks';
import { brandedTitle, breadcrumbJsonLd, serializeJsonLd, socialMetadata } from '@/lib/seo';
import { AppEnabledGate } from '@/components/app-enabled-gate';
import { BookmarkList } from '@/components/bookmarks/bookmark-list';
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
  const title = `${collection.name} · Bookmarks`;
  const description = collection.description || `Bookmarked links — ${collection.name}`;
  return {
    title,
    description,
    ...socialMetadata({
      title: brandedTitle(title),
      description,
      url: `/bookmarks/${id}`,
    }),
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
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: serializeJsonLd(
                breadcrumbJsonLd([
                  { name: 'Bookmarks', path: '/bookmarks' },
                  { name: collection.name, path: `/bookmarks/${collection.id}` },
                ]),
              ),
            }}
          />
          <section className="flex w-full flex-col items-start text-left">
            <header className="mb-4 flex w-full flex-col items-start gap-4">
              <Breadcrumbs
                items={[{ label: 'Bookmarks', href: '/bookmarks' }, { label: collection.name }]}
              />
              <div className="flex items-center gap-2 pb-2">
                <h1 className="text-lg font-bold tracking-tight">
                  <UnderlineText>{collection.name}</UnderlineText>
                </h1>
                <Badge
                  variant="outline"
                  className="shrink-0"
                  aria-label={`${collection.bookmarks.length} links`}
                >
                  {collection.bookmarks.length}
                </Badge>
              </div>
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
