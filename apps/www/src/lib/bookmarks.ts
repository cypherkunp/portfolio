import 'server-only';

import bookmarksConfig from '@/content/bookmarks.config.json';

export interface Bookmark {
  url: string;
  title: string | null;
  image: string | null;
}

export interface BookmarkCollection {
  id: string;
  name: string;
  description: string;
  bookmarks: Bookmark[];
}

interface BookmarkInput {
  url: string;
  title?: string;
  image?: string | null;
}

interface CollectionInput {
  id: string;
  name: string;
  description?: string;
  bookmarks: BookmarkInput[];
}

interface BookmarksConfigFile {
  collections: CollectionInput[];
}

const config = bookmarksConfig as BookmarksConfigFile;

export function hostnameOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

function normalizeBookmark(bookmark: BookmarkInput): Bookmark {
  return {
    url: bookmark.url,
    title: bookmark.title?.trim() || null,
    image: bookmark.image ?? null,
  };
}

export function getCollections(): BookmarkCollection[] {
  return config.collections.map(collection => ({
    id: collection.id,
    name: collection.name,
    description: collection.description ?? '',
    bookmarks: collection.bookmarks.map(normalizeBookmark),
  }));
}

export function getCollection(id: string): BookmarkCollection | undefined {
  return getCollections().find(collection => collection.id === id);
}
