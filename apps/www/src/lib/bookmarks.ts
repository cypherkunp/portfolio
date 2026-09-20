import 'server-only';

import {
  getCollection as collectionFromStore,
  getCollections as collectionsFromStore,
  type BookmarksConfigFile,
} from '@/lib/bookmark-store';
import bookmarksConfig from '@/content/bookmarks.config.json';

export type { Bookmark, BookmarkCollection } from '@/lib/bookmark-store';
export { hostnameOf } from '@/lib/bookmark-store';

const config = bookmarksConfig as BookmarksConfigFile;

export function getCollections() {
  return collectionsFromStore(config);
}

export function getCollection(id: string) {
  return collectionFromStore(config, id);
}
