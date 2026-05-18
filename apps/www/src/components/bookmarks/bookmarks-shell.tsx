'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Bookmark as BookmarkIcon,
  BookOpen,
  Filter,
  LayoutGrid,
  Library,
  ListIcon,
  MapPin,
  Palette,
  Search,
  Youtube,
} from 'lucide-react';

import type { Bookmark, BookmarkAccent, BookmarkCollection } from '@/lib/bookmarks';
import { cn } from '@/lib/utils';
import { BookmarkCard } from '@/components/bookmarks/bookmark-card';
import { BookmarkRow } from '@/components/bookmarks/bookmark-row';
import { ShareButton } from '@/components/bookmarks/share-button';

type ViewMode = 'grid' | 'list';

interface BookmarksShellProps {
  collections: BookmarkCollection[];
  activeCollectionId: string | null;
  bookmarks: Bookmark[];
  shareUrl: string;
  heading?: string;
}

const ICON_MAP: Record<string, typeof Library> = {
  'book-open': BookOpen,
  'map-pin': MapPin,
  youtube: Youtube,
  palette: Palette,
  library: Library,
  bookmark: BookmarkIcon,
};

const ACCENT_DOT: Record<BookmarkAccent, string> = {
  default: 'bg-neutral-500',
  highlight: 'bg-yellow-400',
  accent: 'bg-teal-400',
  primary: 'bg-pink-500',
  mono: 'bg-emerald-400',
};

const ACCENT_BORDER: Record<BookmarkAccent, string> = {
  default: 'border-neutral-700',
  highlight: 'border-yellow-400/60',
  accent: 'border-teal-400/60',
  primary: 'border-pink-500/60',
  mono: 'border-emerald-400/60',
};

const STORAGE_KEY = 'bookmarks:view';

export function BookmarksShell({
  collections,
  activeCollectionId,
  bookmarks,
  shareUrl,
  heading,
}: BookmarksShellProps) {
  const [view, setView] = useState<ViewMode>('grid');
  const [query, setQuery] = useState('');
  const [activeTag, setActiveTag] = useState<string | null>(null);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === 'list' || saved === 'grid') setView(saved);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, view);
  }, [view]);

  useEffect(() => {
    setActiveTag(null);
    setQuery('');
  }, [activeCollectionId]);

  const tags = useMemo(() => {
    const counts = new Map<string, number>();
    for (const b of bookmarks)
      for (const t of b.tags ?? []) counts.set(t, (counts.get(t) ?? 0) + 1);
    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
  }, [bookmarks]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return bookmarks.filter(b => {
      if (activeTag && !b.tags?.includes(activeTag)) return false;
      if (!q) return true;
      const hay = [b.og.title, b.og.description, b.description, b.url, ...(b.tags ?? [])]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return hay.includes(q);
    });
  }, [bookmarks, query, activeTag]);

  const active = activeCollectionId ? collections.find(c => c.id === activeCollectionId) : null;

  return (
    <div className="mt-2 overflow-x-clip border-t border-neutral-900 pt-5 sm:pt-10">
      <div className="grid gap-5 md:grid-cols-[220px_1fr] md:gap-10">
        {/* Sidebar */}
        <aside className="md:sticky md:top-6 md:self-start">
          <div className="mb-3 flex items-center justify-between px-1">
            <span className="text-[11px] font-semibold tracking-[0.18em] text-neutral-500 uppercase">
              Collections
            </span>
            <span className="text-[11px] text-neutral-600 tabular-nums">{collections.length}</span>
          </div>

          <nav className="scrollbar-hide -mx-1 flex gap-2 overflow-x-auto px-1 md:flex-col md:gap-1 md:overflow-visible">
            <CollectionLink
              href="/bookmarks"
              isActive={!activeCollectionId}
              label="All"
              count={collections.reduce((n, c) => n + c.bookmarks.length, 0)}
              icon={<Library className="size-3.5" />}
            />
            {collections.map(c => {
              const Icon = ICON_MAP[c.icon] ?? BookmarkIcon;
              const isActive = activeCollectionId === c.id;
              return (
                <CollectionLink
                  key={c.id}
                  href={`/bookmarks/${c.id}`}
                  isActive={isActive}
                  label={c.name}
                  count={c.bookmarks.length}
                  icon={
                    <span
                      className={cn(
                        'flex size-5 items-center justify-center rounded-md border bg-neutral-950 text-neutral-400',
                        isActive ? ACCENT_BORDER[c.accent] : 'border-neutral-800',
                      )}
                    >
                      <Icon className="size-3" />
                    </span>
                  }
                  dotClass={ACCENT_DOT[c.accent]}
                />
              );
            })}
          </nav>
        </aside>

        {/* Main */}
        <section className="min-w-0">
          {/* Toolbar */}
          <div className="mb-5 flex items-center gap-2">
            <div className="relative min-w-0 flex-1 sm:max-w-xs">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-neutral-600" />
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder={`Search ${active ? active.name.toLowerCase() : 'bookmarks'}…`}
                className="w-full rounded-full border border-neutral-800 bg-neutral-950 py-1.5 pr-3 pl-9 text-xs text-neutral-200 placeholder:text-neutral-600 focus:border-neutral-600 focus:outline-none"
              />
            </div>

            <div className="hidden shrink-0 rounded-full border border-neutral-800 bg-neutral-950 p-0.5 sm:flex">
              <ViewToggleButton
                active={view === 'grid'}
                onClick={() => setView('grid')}
                aria-label="Grid view"
              >
                <LayoutGrid className="size-3.5" />
              </ViewToggleButton>
              <ViewToggleButton
                active={view === 'list'}
                onClick={() => setView('list')}
                aria-label="List view"
              >
                <ListIcon className="size-3.5" />
              </ViewToggleButton>
            </div>

            <div className="shrink-0">
              <ShareButton url={shareUrl} label={active ? `Share "${active.name}"` : 'Share'} />
            </div>
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="scrollbar-hide -mx-1 mb-5 flex gap-1.5 overflow-x-auto px-1">
              <TagChip
                isActive={activeTag === null}
                onClick={() => setActiveTag(null)}
                icon={<Filter className="size-3" />}
                label="All"
                count={bookmarks.length}
              />
              {tags.map(([tag, count]) => (
                <TagChip
                  key={tag}
                  isActive={activeTag === tag}
                  onClick={() => setActiveTag(t => (t === tag ? null : tag))}
                  label={tag}
                  count={count}
                />
              ))}
            </div>
          )}

          {heading && (
            <div className="mb-4 hidden md:block">
              <h2 className="text-lg font-medium text-neutral-100">{heading}</h2>
            </div>
          )}

          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-neutral-800 bg-neutral-950/40 py-14 text-center">
              <p className="text-sm text-neutral-500">Nothing matches that filter.</p>
              <button
                onClick={() => {
                  setQuery('');
                  setActiveTag(null);
                }}
                className="mt-3 text-xs text-neutral-400 underline-offset-4 hover:text-neutral-200 hover:underline"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <>
              {/* Mobile: always list */}
              <ul className="divide-y divide-neutral-900 overflow-hidden rounded-2xl border border-neutral-900 bg-neutral-950/30 sm:hidden">
                {filtered.map(b => {
                  const collection = collections.find(c => c.id === b.collectionId);
                  return (
                    <BookmarkRow
                      key={`${b.collectionId}:${b.id}`}
                      bookmark={b}
                      accent={collection?.accent ?? 'default'}
                      onTagClick={t => setActiveTag(t)}
                      showCollection={!activeCollectionId}
                      collectionName={collection?.name}
                      collectionId={collection?.id}
                    />
                  );
                })}
              </ul>

              {/* sm+: respect view toggle */}
              <div className="hidden sm:block">
                {view === 'grid' ? (
                  <div className="grid gap-5 md:grid-cols-2">
                    {filtered.map(b => {
                      const collection = collections.find(c => c.id === b.collectionId);
                      return (
                        <BookmarkCard
                          key={`${b.collectionId}:${b.id}`}
                          bookmark={b}
                          accent={collection?.accent ?? 'default'}
                          onTagClick={t => setActiveTag(t)}
                          showCollection={!activeCollectionId}
                          collectionName={collection?.name}
                          collectionId={collection?.id}
                        />
                      );
                    })}
                  </div>
                ) : (
                  <ul className="divide-y divide-neutral-900 overflow-hidden rounded-2xl border border-neutral-900 bg-neutral-950/30">
                    {filtered.map(b => {
                      const collection = collections.find(c => c.id === b.collectionId);
                      return (
                        <BookmarkRow
                          key={`${b.collectionId}:${b.id}`}
                          bookmark={b}
                          accent={collection?.accent ?? 'default'}
                          onTagClick={t => setActiveTag(t)}
                          showCollection={!activeCollectionId}
                          collectionName={collection?.name}
                          collectionId={collection?.id}
                        />
                      );
                    })}
                  </ul>
                )}
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}

interface CollectionLinkProps {
  href: string;
  isActive: boolean;
  label: string;
  count: number;
  icon: React.ReactNode;
  dotClass?: string;
}

function CollectionLink({ href, isActive, label, count, icon, dotClass }: CollectionLinkProps) {
  return (
    <Link
      href={href}
      prefetch
      className={cn(
        'group flex shrink-0 items-center gap-2.5 rounded-lg border px-3 py-2 text-xs transition-all md:shrink',
        isActive
          ? 'border-neutral-800 bg-neutral-900 text-neutral-100'
          : 'border-transparent text-neutral-400 hover:border-neutral-800 hover:bg-neutral-900/40 hover:text-neutral-200',
      )}
    >
      {icon}
      <span className="flex-1 truncate text-left">{label}</span>
      {dotClass && (
        <span className={cn('size-1.5 rounded-full opacity-60', dotClass)} aria-hidden />
      )}
      <span className="font-mono text-[10px] text-neutral-600 tabular-nums group-hover:text-neutral-500">
        {count}
      </span>
    </Link>
  );
}

interface ViewToggleButtonProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  'aria-label': string;
}

function ViewToggleButton({ active, onClick, children, ...props }: ViewToggleButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'rounded-full p-1.5 transition-colors',
        active ? 'bg-neutral-800 text-neutral-100' : 'text-neutral-500 hover:text-neutral-300',
      )}
      {...props}
    >
      {children}
    </button>
  );
}

interface TagChipProps {
  isActive: boolean;
  onClick: () => void;
  label: string;
  count: number;
  icon?: React.ReactNode;
}

function TagChip({ isActive, onClick, label, count, icon }: TagChipProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-medium tracking-wide transition-all',
        isActive
          ? 'border-neutral-100 bg-neutral-100 text-neutral-950'
          : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200',
      )}
    >
      {icon}
      <span>{label}</span>
      <span
        className={cn(
          'font-mono text-[10px] tabular-nums',
          isActive ? 'text-neutral-700' : 'text-neutral-600',
        )}
      >
        {count}
      </span>
    </button>
  );
}
