import type { BookmarkCollection } from '@/lib/bookmarks';

interface BookmarksHeaderProps {
  collections: BookmarkCollection[];
  activeCollectionId?: string | null;
}

export function BookmarksHeader({ collections, activeCollectionId }: BookmarksHeaderProps) {
  const active = activeCollectionId ? collections.find(c => c.id === activeCollectionId) : null;

  return (
    <header className="px-1 py-5 sm:py-8">
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
    </header>
  );
}
