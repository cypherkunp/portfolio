import 'server-only';

import { fetchOg, type OgData } from '@/lib/og';
import bookmarksConfig from '@/content/bookmarks.config.json';
import bookmarksOg from '@/content/bookmarks.og.json';

export type BookmarkAccent = 'default' | 'highlight' | 'accent' | 'primary' | 'mono';

/** Hand-edited shape — no OG data. */
export interface BookmarkInput {
  id: string;
  url: string;
  description?: string;
  tags?: string[];
  addedAt: string;
}

export interface BookmarkCollectionInput {
  id: string;
  name: string;
  description?: string;
  icon: string;
  accent: BookmarkAccent;
  bookmarks: BookmarkInput[];
}

/** Bookmark merged with optional cached OG data — `og` may be null until enriched. */
export interface BookmarkRaw extends BookmarkInput {
  og: OgData | null;
}

export interface BookmarkCollection extends Omit<BookmarkCollectionInput, 'bookmarks'> {
  bookmarks: BookmarkRaw[];
}

export interface Bookmark extends Omit<BookmarkRaw, 'og'> {
  og: OgData;
  collectionId: string;
}

interface BookmarksConfigFile {
  collections: BookmarkCollectionInput[];
}

interface BookmarksOgFile {
  entries: Record<string, OgData>;
}

const config = bookmarksConfig as BookmarksConfigFile;
const ogCache: Record<string, OgData> =
  (bookmarksOg as BookmarksOgFile).entries ?? {};

function fallbackOg(url: string): OgData {
  let domain = '';
  try {
    domain = new URL(url).hostname.replace(/^www\./, '');
  } catch {
    domain = url;
  }
  return {
    title: domain,
    description: null,
    image: null,
    siteName: domain,
    favicon: `https://www.google.com/s2/favicons?domain=${domain}&sz=64`,
    fetchedAt: null,
  };
}

function mergeOg(b: BookmarkInput): BookmarkRaw {
  return { ...b, og: ogCache[b.url] ?? null };
}

async function enrichBookmark(b: BookmarkRaw, collectionId: string): Promise<Bookmark> {
  if (b.og && b.og.title) {
    return { ...b, og: b.og, collectionId };
  }
  try {
    const live = await fetchOg(b.url);
    return { ...b, og: live ?? fallbackOg(b.url), collectionId };
  } catch {
    return { ...b, og: fallbackOg(b.url), collectionId };
  }
}

export function getCollections(): BookmarkCollection[] {
  return config.collections.map(c => ({
    ...c,
    bookmarks: c.bookmarks.map(mergeOg),
  }));
}

export function getCollection(id: string): BookmarkCollection | undefined {
  return getCollections().find(c => c.id === id);
}

export async function getEnrichedCollection(id: string) {
  const collection = getCollection(id);
  if (!collection) return null;
  const bookmarks = await Promise.all(
    collection.bookmarks.map(b => enrichBookmark(b, collection.id)),
  );
  return { ...collection, bookmarks };
}

export async function getAllEnrichedBookmarks(): Promise<Bookmark[]> {
  const collections = getCollections();
  const all = await Promise.all(
    collections.flatMap(c => c.bookmarks.map(b => enrichBookmark(b, c.id))),
  );
  return all;
}
