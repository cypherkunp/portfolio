export const BOOKMARKS_SCHEMA =
  'Hand-edited. Add a collection (id, name, description) and bookmark `{ url }` objects. Run `pnpm --filter www bookmarks:fetch` to fill title and image. Fields you set are never overwritten. `chromeGuid` is owned by `bookmarks:sync`; leave it unless attaching.';

export function serializeCollection(collection) {
  const out = {
    id: collection.id,
    name: collection.name,
    description: collection.description ?? '',
  };
  if (typeof collection.chromeGuid === 'string' && collection.chromeGuid.length > 0) {
    out.chromeGuid = collection.chromeGuid;
  }
  out.bookmarks = collection.bookmarks ?? [];
  return out;
}
