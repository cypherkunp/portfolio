import { createServerFn } from '@tanstack/react-start';

import { getCollection, getCollections } from '@/lib/bookmarks';

export const loadBookmarkIndex = createServerFn({ method: 'GET' }).handler(async () => {
  return getCollections();
});

export const loadBookmarkCollection = createServerFn({ method: 'GET' })
  .validator((id: string) => id)
  .handler(async ({ data: id }) => getCollection(id) ?? null);
