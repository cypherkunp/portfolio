import { loadBookmarkIndex } from '@/server/bookmarks';
import PageContainer from '@repo/ui/components/layout/page-container';
import { RouteViewTransition } from '@repo/ui/components/layout/route-view-transition';
import UnderlineText from '@repo/ui/components/underline-text';
import { createFileRoute } from '@tanstack/react-router';

import { bookmarksIndexHead } from '@/lib/apps-page';
import { CollectionList } from '@/components/bookmarks/collection-list';
import { ToolSubpageLayout } from '@/components/layout/tool-subpage-layout';

import { requireEnabledApp } from '../-require-app';

export const Route = createFileRoute('/bookmarks/')({
  loader: async () => {
    await requireEnabledApp('bookmarks');
    return loadBookmarkIndex();
  },
  head: () => bookmarksIndexHead(),
  component: BookmarksPage,
});

function BookmarksPage() {
  const collections = Route.useLoaderData();

  return (
    <RouteViewTransition>
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
    </RouteViewTransition>
  );
}
