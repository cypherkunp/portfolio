import type { BookmarkCollection } from '@/lib/bookmarks';

interface BookmarksHeaderProps {
  collections: BookmarkCollection[];
  activeCollectionId?: string | null;
}

export function BookmarksHeader({ collections, activeCollectionId }: BookmarksHeaderProps) {
  const total = collections.reduce((n, c) => n + c.bookmarks.length, 0);
  const active = activeCollectionId ? collections.find(c => c.id === activeCollectionId) : null;

  return (
    <header className="flex flex-col gap-5 px-1 py-6 sm:gap-6 sm:py-10">
      <h1 className="text-2xl font-light tracking-tight text-neutral-100 sm:text-4xl">
        {active ? (
          <>
            {active.name.split(' ').slice(0, -1).join(' ') || active.name}{' '}
            <span className="text-yellow-400 italic">{active.name.split(' ').slice(-1)}</span>
          </>
        ) : (
          <>
            Links worth <span className="text-yellow-400 italic">keeping.</span>
          </>
        )}
      </h1>
      <p className="max-w-2xl text-sm leading-relaxed text-neutral-400 sm:text-base">
        {active?.description ??
          `${total} bookmarks across ${collections.length} collections — articles, places, channels, and design systems I steal from. Each collection has its own shareable link.`}
      </p>
    </header>
  );
}
