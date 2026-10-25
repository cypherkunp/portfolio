import { loadBookmarkCollection } from '@/server/bookmarks';
import { Badge } from '@repo/ui/components/badge';
import { Breadcrumbs } from '@repo/ui/components/breadcrumbs';
import PageContainer from '@repo/ui/components/layout/page-container';
import { RouteViewTransition } from '@repo/ui/components/layout/route-view-transition';
import UnderlineText from '@repo/ui/components/underline-text';
import { createFileRoute, notFound } from '@tanstack/react-router';

import { collectionPageHead } from '@/lib/apps-page';
import { serializeJsonLd } from '@/lib/seo';
import { BookmarkList } from '@/components/bookmarks/bookmark-list';
import { ToolSubpageLayout } from '@/components/layout/tool-subpage-layout';

import { requireEnabledApp } from '../-require-app';

export const Route = createFileRoute('/bookmarks/$collection')({
  loader: async ({ params }) => {
    await requireEnabledApp('bookmarks');
    const collection = await loadBookmarkCollection({ data: params.collection });
    if (!collection) throw notFound();
    return collection;
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const head = collectionPageHead(loaderData);
    return { meta: head.meta, links: head.links };
  },
  component: CollectionPage,
});

function CollectionPage() {
  const collection = Route.useLoaderData();
  const jsonLd = serializeJsonLd(collectionPageHead(collection).jsonLd);

  return (
    <RouteViewTransition>
      <ToolSubpageLayout flush>
        <PageContainer>
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
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
    </RouteViewTransition>
  );
}
