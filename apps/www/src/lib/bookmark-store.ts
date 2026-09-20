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

export interface BookmarkInput {
  url: string;
  title?: string;
  image?: string | null;
}

export interface CollectionInput {
  id: string;
  name: string;
  description?: string;
  chromeGuid?: string;
  bookmarks?: Array<string | BookmarkInput>;
}

export interface BookmarksConfigFile {
  $schema?: string;
  collections: CollectionInput[];
}

export interface BookmarkOg {
  title: string | null;
  image: string | null;
}

export interface SnapshotGap {
  url: string;
  collection: string;
}

export interface FillSnapshotsResult {
  file: BookmarksConfigFile;
  fetched: number;
  skipped: number;
  missingTitle: SnapshotGap[];
  missingImage: SnapshotGap[];
}

type MutableBookmark = {
  url: string;
  title?: string;
  image?: string | null;
};

export function hostnameOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

function asBookmark(raw: string | BookmarkInput): MutableBookmark {
  if (typeof raw === 'string') return { url: raw };
  return { url: raw.url, title: raw.title, image: raw.image };
}

function hasTitle(bookmark: MutableBookmark): bookmark is MutableBookmark & { title: string } {
  return typeof bookmark.title === 'string' && bookmark.title.trim().length > 0;
}

function hasImage(bookmark: MutableBookmark): bookmark is MutableBookmark & { image: string } {
  return typeof bookmark.image === 'string' && bookmark.image.length > 0;
}

function imageCheckedEmpty(bookmark: MutableBookmark): boolean {
  return bookmark.image === null;
}

function needsFetch(bookmark: MutableBookmark, force: boolean): boolean {
  if (!hasTitle(bookmark)) return true;
  if (hasImage(bookmark)) return false;
  if (imageCheckedEmpty(bookmark)) return force;
  return true;
}

function toWrittenBookmark(bookmark: MutableBookmark): BookmarkInput {
  const out: BookmarkInput = { url: bookmark.url };
  if (hasTitle(bookmark)) out.title = bookmark.title.trim();
  if (hasImage(bookmark)) out.image = bookmark.image;
  else if (imageCheckedEmpty(bookmark)) out.image = null;
  return out;
}

function serializeCollection(collection: CollectionInput, bookmarks: BookmarkInput[]) {
  const out: CollectionInput = {
    id: collection.id,
    name: collection.name,
    description: collection.description ?? '',
    bookmarks,
  };
  if (typeof collection.chromeGuid === 'string' && collection.chromeGuid.length > 0) {
    out.chromeGuid = collection.chromeGuid;
  }
  return out;
}

function normalizeBookmark(bookmark: BookmarkInput): Bookmark {
  return {
    url: bookmark.url,
    title: bookmark.title?.trim() || null,
    image: bookmark.image ?? null,
  };
}

export function getCollections(file: BookmarksConfigFile): BookmarkCollection[] {
  return file.collections.map(({ id, name, description, bookmarks }) => ({
    id,
    name,
    description: description ?? '',
    bookmarks: (bookmarks ?? []).map(raw => normalizeBookmark(asBookmark(raw))),
  }));
}

export function getCollection(
  file: BookmarksConfigFile,
  id: string,
): BookmarkCollection | undefined {
  return getCollections(file).find(collection => collection.id === id);
}

export async function fillSnapshots(
  file: BookmarksConfigFile,
  fetchOg: (url: string) => Promise<BookmarkOg | null>,
  options: { force?: boolean } = {},
): Promise<FillSnapshotsResult> {
  const force = options.force ?? false;
  let fetched = 0;
  let skipped = 0;
  const missingTitle: SnapshotGap[] = [];
  const missingImage: SnapshotGap[] = [];
  const collections: CollectionInput[] = [];

  for (const collection of file.collections) {
    const bookmarks: BookmarkInput[] = [];
    const collectionName = collection.name ?? collection.id;

    for (const raw of collection.bookmarks ?? []) {
      const bookmark = asBookmark(raw);
      if (!bookmark.url) continue;

      if (!needsFetch(bookmark, force)) {
        skipped += 1;
        bookmarks.push(toWrittenBookmark(bookmark));
        if (!hasImage(bookmark))
          missingImage.push({ url: bookmark.url, collection: collectionName });
        continue;
      }

      const og = await fetchOg(bookmark.url);
      fetched += 1;

      if (og) {
        if (!hasTitle(bookmark) && og.title) bookmark.title = og.title;
        if (!hasImage(bookmark)) bookmark.image = og.image ?? null;
      }

      bookmarks.push(toWrittenBookmark(bookmark));
      if (!hasTitle(bookmark)) missingTitle.push({ url: bookmark.url, collection: collectionName });
      else if (!hasImage(bookmark))
        missingImage.push({ url: bookmark.url, collection: collectionName });
    }

    collections.push(serializeCollection(collection, bookmarks));
  }

  return {
    file: { $schema: file.$schema, collections },
    fetched,
    skipped,
    missingTitle,
    missingImage,
  };
}
