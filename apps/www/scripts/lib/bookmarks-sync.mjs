import { hostnameOf } from '../../src/lib/bookmark-store.ts';
import { BOOKMARKS_SCHEMA, serializeCollection } from './bookmarks-schema.mjs';

const LIST_CAP = 8;
const ROOT_KEYS = ['bookmark_bar', 'other', 'synced'];

export function collectionIdFromTitle(title) {
  return (
    title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || 'collection'
  );
}

export function hasTitle(bookmark) {
  return typeof bookmark.title === 'string' && bookmark.title.trim().length > 0;
}

function flatten(node, out, seen) {
  if (!node) return;
  if (node.type === 'url' && node.url) {
    if (!seen.has(node.url)) {
      seen.add(node.url);
      out.push({ url: node.url, name: node.name || '' });
    }
    return;
  }
  if (node.type === 'folder' && Array.isArray(node.children)) {
    for (const child of node.children) flatten(child, out, seen);
  }
}

function asFolder(node, rootLabel) {
  if (!node?.guid) return null;
  const bookmarks = [];
  flatten(node, bookmarks, new Set());
  return {
    guid: node.guid,
    name: node.name || 'Untitled',
    rootLabel,
    bookmarks,
  };
}

export function topLevelFolders(roots) {
  const folders = [];
  for (const key of ROOT_KEYS) {
    const root = roots?.[key];
    if (!root || typeof root !== 'object') continue;
    const rootLabel = root.name || key;
    const children = Array.isArray(root.children) ? root.children : [];
    for (const child of children) {
      if (child?.type !== 'folder') continue;
      const folder = asFolder(child, rootLabel);
      if (folder) folders.push(folder);
    }
    const loose = [];
    const seenLoose = new Set();
    for (const child of children) {
      if (child?.type === 'url') flatten(child, loose, seenLoose);
    }
    if (loose.length) {
      const folder = asFolder(
        { ...root, children: children.filter(c => c?.type === 'url') },
        rootLabel,
      );
      if (folder) folders.push({ ...folder, bookmarks: loose });
    }
  }
  return folders;
}

export function collectionMatchingGuid(collections, guid) {
  if (!guid) return undefined;
  return collections.find(collection => collection.chromeGuid === guid);
}

export function classifyBookmarks(selected, existingBookmarks) {
  const byUrl = new Map(existingBookmarks.map(bookmark => [bookmark.url, bookmark]));
  const buckets = { new: [], already: [], titleFill: [] };
  for (const bookmark of selected) {
    const existing = byUrl.get(bookmark.url);
    if (!existing) buckets.new.push(bookmark);
    else if (!hasTitle(existing)) buckets.titleFill.push(bookmark);
    else buckets.already.push(bookmark);
  }
  return buckets;
}

function lineFor(bookmark) {
  return `${bookmark.name}  ${hostnameOf(bookmark.url)}`;
}

function formatBucket(glyph, label, items) {
  const head = `  ${glyph} ${items.length} ${label}`;
  if (!items.length) return head;
  const shown = items.slice(0, LIST_CAP).map(bookmark => `      ${lineFor(bookmark)}`);
  const more = items.length > LIST_CAP ? [`      … ${items.length - LIST_CAP} more`] : [];
  return [head, ...shown, ...more].join('\n');
}

export function formatDiff(plans) {
  return plans
    .map(plan => {
      const verb = plan.action === 'create' ? 'create' : 'attach';
      const header = `${plan.folderName}  →  ${plan.collectionId}  (${verb})`;
      const { new: added, already, titleFill } = plan.buckets;
      return [
        header,
        formatBucket('+', 'new', added),
        formatBucket('·', 'already in this Collection', already),
        formatBucket('~', 'title fill', titleFill),
      ].join('\n');
    })
    .join('\n\n');
}

function cloneBookmark(raw) {
  if (typeof raw === 'string') return { url: raw };
  const out = { url: raw.url };
  if (raw.title !== undefined) out.title = raw.title;
  if (raw.image !== undefined) out.image = raw.image;
  return out;
}

function cloneCollection(collection) {
  return {
    id: collection.id,
    name: collection.name,
    description: collection.description ?? '',
    chromeGuid: collection.chromeGuid,
    bookmarks: (collection.bookmarks ?? []).map(cloneBookmark),
  };
}

export function applyPlans(config, plans) {
  const collections = (config.collections ?? []).map(cloneCollection);
  for (const plan of plans) {
    if (plan.action === 'create') {
      collections.push({
        id: plan.collectionId,
        name: plan.name,
        description: '',
        chromeGuid: plan.chromeGuid,
        bookmarks: plan.selected.map(bookmark => ({ url: bookmark.url, title: bookmark.name })),
      });
      continue;
    }

    const collection = collections.find(entry => entry.id === plan.collectionId);
    if (!collection) continue;
    if (!collection.chromeGuid) collection.chromeGuid = plan.chromeGuid;
    collection.name = plan.name;
    const byUrl = new Map(collection.bookmarks.map(bookmark => [bookmark.url, bookmark]));
    for (const bookmark of plan.selected) {
      const existing = byUrl.get(bookmark.url);
      if (!existing) {
        const added = { url: bookmark.url, title: bookmark.name };
        collection.bookmarks.push(added);
        byUrl.set(bookmark.url, added);
        continue;
      }
      if (!hasTitle(existing)) existing.title = bookmark.name;
    }
  }

  return {
    $schema: BOOKMARKS_SCHEMA,
    collections: collections.map(serializeCollection),
  };
}
