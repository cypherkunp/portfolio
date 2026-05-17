import 'server-only';

import { fetchOg, type OgData } from '@/lib/og';
import bookmarksJson from '@/content/bookmarks.json';

export type BookmarkAccent = 'default' | 'highlight' | 'accent' | 'primary' | 'mono';

export interface BookmarkRaw {
  id: string;
  url: string;
  description?: string;
  tags?: string[];
  addedAt: string;
  og: OgData | null;
}

export interface BookmarkCollection {
  id: string;
  name: string;
  description?: string;
  icon: string;
  accent: BookmarkAccent;
  bookmarks: BookmarkRaw[];
}

export interface Bookmark extends Omit<BookmarkRaw, 'og'> {
  og: OgData;
  collectionId: string;
}

interface BookmarksFile {
  collections: BookmarkCollection[];
}

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
  return (bookmarksJson as BookmarksFile).collections;
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
