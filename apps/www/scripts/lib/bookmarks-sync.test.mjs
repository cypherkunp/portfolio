import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { serializeCollection } from './bookmarks-schema.mjs';
import {
  applyPlans,
  classifyBookmarks,
  collectionIdFromTitle,
  collectionMatchingGuid,
  formatDiff,
  topLevelFolders,
} from './bookmarks-sync.mjs';

describe('collectionIdFromTitle', () => {
  it('kebabs the confirmed Collection title', () => {
    assert.equal(collectionIdFromTitle('Design Systems'), 'design-systems');
  });

  it('collapses and strips non-alphanumeric runs', () => {
    assert.equal(collectionIdFromTitle('  --Hello--World--  '), 'hello-world');
  });

  it('falls back to collection when the slug would be empty', () => {
    assert.equal(collectionIdFromTitle('!!!'), 'collection');
  });
});

describe('topLevelFolders', () => {
  const roots = {
    bookmark_bar: {
      name: 'Bookmarks bar',
      guid: 'root-bar',
      children: [
        {
          type: 'folder',
          name: 'Design',
          guid: 'design-guid',
          id: '99',
          children: [
            { type: 'url', url: 'https://example.com/a', name: 'A', guid: 'a', id: '1' },
            {
              type: 'folder',
              name: 'Nested',
              guid: 'nested-guid',
              id: '2',
              children: [
                { type: 'url', url: 'https://example.com/b', name: 'B', guid: 'b', id: '3' },
                {
                  type: 'url',
                  url: 'https://example.com/a',
                  name: 'A duplicate',
                  guid: 'a2',
                  id: '4',
                },
              ],
            },
          ],
        },
        {
          type: 'url',
          url: 'https://example.com/loose-bar',
          name: 'Loose bar',
          guid: 'lb',
          id: '5',
        },
      ],
    },
    other: {
      name: 'Other bookmarks',
      guid: 'root-other',
      children: [
        {
          type: 'folder',
          name: 'Personal',
          guid: 'personal-guid',
          id: '6',
          children: [
            { type: 'url', url: 'https://example.com/p', name: 'Dump', guid: 'p', id: '7' },
          ],
        },
      ],
    },
    synced: {
      name: 'Mobile Bookmarks',
      guid: 'file-synced-guid',
      children: [{ type: 'url', url: 'https://example.com/m', name: 'Mobile', guid: 'm', id: '8' }],
    },
  };

  it('selects top-level folders and flattens nested ones', () => {
    const folders = topLevelFolders(roots);
    const design = folders.find(folder => folder.guid === 'design-guid');
    const nested = folders.find(folder => folder.guid === 'nested-guid');
    assert.ok(design);
    assert.equal(nested, undefined);
    assert.deepEqual(
      design.bookmarks.map(bookmark => bookmark.url),
      ['https://example.com/a', 'https://example.com/b'],
    );
    assert.equal(design.bookmarks[0].name, 'A');
  });

  it('keeps the first Chrome walk on duplicate URLs', () => {
    const design = topLevelFolders(roots).find(folder => folder.guid === 'design-guid');
    assert.equal(
      design.bookmarks.filter(bookmark => bookmark.url === 'https://example.com/a').length,
      1,
    );
    assert.equal(
      design.bookmarks.find(bookmark => bookmark.url === 'https://example.com/a').name,
      'A',
    );
  });

  it('treats a root with loose URLs as a folder using the file guid', () => {
    const folders = topLevelFolders(roots);
    const mobile = folders.find(folder => folder.guid === 'file-synced-guid');
    const barLoose = folders.find(folder => folder.guid === 'root-bar');
    assert.equal(mobile.name, 'Mobile Bookmarks');
    assert.deepEqual(
      mobile.bookmarks.map(bookmark => bookmark.url),
      ['https://example.com/m'],
    );
    assert.equal(barLoose.name, 'Bookmarks bar');
    assert.deepEqual(
      barLoose.bookmarks.map(bookmark => bookmark.url),
      ['https://example.com/loose-bar'],
    );
  });

  it('never joins on Chrome numeric id', () => {
    const folders = topLevelFolders(roots);
    assert.equal(
      folders.some(folder => folder.guid === '99' || folder.guid === 99),
      false,
    );
  });

  it('keeps an empty Chrome name instead of inventing a hostname title', () => {
    const folders = topLevelFolders({
      bookmark_bar: {
        name: 'Bookmarks bar',
        guid: 'root-bar',
        children: [
          {
            type: 'folder',
            name: 'Nameless',
            guid: 'nameless-guid',
            children: [{ type: 'url', url: 'https://example.com/no-name', guid: 'n', id: '1' }],
          },
        ],
      },
    });
    assert.equal(folders[0].bookmarks[0].name, '');
  });
});

describe('collectionMatchingGuid', () => {
  const collections = [
    { id: 'design-systems', name: 'Design Systems', chromeGuid: 'design-guid' },
    { id: 'reading-list', name: 'Reading List' },
  ];

  it('matches only chromeGuid', () => {
    assert.equal(collectionMatchingGuid(collections, 'design-guid').id, 'design-systems');
    assert.equal(collectionMatchingGuid(collections, 'reading-list'), undefined);
    assert.equal(collectionMatchingGuid(collections, 'Design Systems'), undefined);
  });

  it('treats a missing chromeGuid as never joined', () => {
    assert.equal(collectionMatchingGuid(collections, 'missing'), undefined);
    assert.equal(collectionMatchingGuid([{ id: 'x', chromeGuid: '' }], ''), undefined);
  });
});

describe('classifyBookmarks', () => {
  it('splits new, already titled, and empty-title fill', () => {
    const buckets = classifyBookmarks(
      [
        { url: 'https://example.com/new', name: 'A new essay' },
        { url: 'https://example.com/titled', name: 'Chrome name ignored' },
        { url: 'https://example.com/empty', name: 'Fill me from Chrome' },
      ],
      [
        { url: 'https://example.com/titled', title: "Do Things that Don't Scale" },
        { url: 'https://example.com/empty', title: '' },
      ],
    );
    assert.deepEqual(
      buckets.new.map(bookmark => bookmark.name),
      ['A new essay'],
    );
    assert.deepEqual(
      buckets.already.map(bookmark => bookmark.name),
      ['Chrome name ignored'],
    );
    assert.deepEqual(
      buckets.titleFill.map(bookmark => bookmark.name),
      ['Fill me from Chrome'],
    );
  });
});

describe('formatDiff', () => {
  it('prints names and hostnames, never URLs, and caps rows at 8', () => {
    const dump = Array.from({ length: 10 }, (_, i) => ({
      url: `https://example.com/item-${i}`,
      name: `Dump ${i + 1}`,
    }));
    const text = formatDiff([
      {
        folderName: 'Design Systems',
        collectionId: 'design-systems',
        action: 'create',
        buckets: classifyBookmarks(
          [
            { url: 'https://example.com/ds-a', name: 'Inclusive Components' },
            { url: 'https://example.com/ds-b', name: 'Every Layout' },
            { url: 'https://example.com/ds-c', name: 'Full Stack Survey' },
          ],
          [],
        ),
      },
      {
        folderName: 'Personal',
        collectionId: 'personal',
        action: 'attach',
        buckets: classifyBookmarks(dump, []),
      },
    ]);
    assert.match(text, /Design Systems {2}→ {2}design-systems {2}\(create\)/);
    assert.match(text, /\+ 3 new/);
    assert.match(text, /Inclusive Components {2}example.com/);
    assert.match(text, /Personal {2}→ {2}personal {2}\(attach\)/);
    assert.match(text, /\+ 10 new/);
    assert.match(text, /… 2 more/);
    assert.doesNotMatch(text, /https:\/\//);
    assert.match(text, /· 0 already in this Collection/);
    assert.match(text, /~ 0 title fill/);
  });
});

describe('serializeCollection', () => {
  it('round-trips chromeGuid and omits it when absent', () => {
    assert.deepEqual(
      serializeCollection({
        id: 'reading-list',
        name: 'Reading List',
        description: 'Keepers',
        chromeGuid: 'reading-guid',
        bookmarks: [{ url: 'https://example.com/a' }],
      }),
      {
        id: 'reading-list',
        name: 'Reading List',
        description: 'Keepers',
        chromeGuid: 'reading-guid',
        bookmarks: [{ url: 'https://example.com/a' }],
      },
    );
    assert.equal(
      Object.hasOwn(
        serializeCollection({
          id: 'london-spots',
          name: 'Places',
          description: '',
          bookmarks: [],
        }),
        'chromeGuid',
      ),
      false,
    );
  });
});

describe('applyPlans', () => {
  const config = {
    collections: [
      {
        id: 'reading-list',
        name: 'Reading List',
        description: 'Keepers',
        bookmarks: [
          {
            url: 'https://example.com/titled',
            title: 'Kept title',
            image: 'https://example.com/og.png',
          },
          { url: 'https://example.com/empty', title: '' },
          { url: 'https://example.com/stay', title: 'Stays even if unchecked' },
        ],
      },
    ],
  };

  it('creates a Collection with slug id, chromeGuid, and empty description', () => {
    const next = applyPlans(config, [
      {
        action: 'create',
        collectionId: 'design-systems',
        name: 'Design Systems',
        chromeGuid: 'design-guid',
        selected: [{ url: 'https://example.com/ds-a', name: 'Inclusive Components' }],
        buckets: { new: [], already: [], titleFill: [] },
      },
    ]);
    const created = next.collections.find(collection => collection.id === 'design-systems');
    assert.equal(created.name, 'Design Systems');
    assert.equal(created.chromeGuid, 'design-guid');
    assert.equal(created.description, '');
    assert.deepEqual(created.bookmarks, [
      { url: 'https://example.com/ds-a', title: 'Inclusive Components' },
    ]);
    assert.match(next.$schema, /bookmarks:fetch/);
    assert.match(next.$schema, /chromeGuid/);
  });

  it('attaches without rewriting id, images, or set titles, and keeps unchecked URLs', () => {
    const next = applyPlans(config, [
      {
        action: 'attach',
        collectionId: 'reading-list',
        name: 'Reading List',
        chromeGuid: 'reading-guid',
        selected: [
          { url: 'https://example.com/titled', name: 'Chrome name ignored' },
          { url: 'https://example.com/empty', name: 'Fill me from Chrome' },
          { url: 'https://example.com/new', name: 'A new essay' },
        ],
        buckets: { new: [], already: [], titleFill: [] },
      },
    ]);
    const reading = next.collections.find(collection => collection.id === 'reading-list');
    assert.equal(reading.id, 'reading-list');
    assert.equal(reading.chromeGuid, 'reading-guid');
    assert.equal(reading.description, 'Keepers');
    assert.equal(reading.bookmarks[0].title, 'Kept title');
    assert.equal(reading.bookmarks[0].image, 'https://example.com/og.png');
    assert.equal(reading.bookmarks[1].title, 'Fill me from Chrome');
    assert.equal(reading.bookmarks[2].title, 'Stays even if unchecked');
    assert.equal(reading.bookmarks[3].title, 'A new essay');
  });

  it('does not overwrite an existing chromeGuid on attach', () => {
    const next = applyPlans(
      {
        collections: [
          {
            id: 'reading-list',
            name: 'Reading List',
            chromeGuid: 'original-guid',
            bookmarks: [],
          },
        ],
      },
      [
        {
          action: 'attach',
          collectionId: 'reading-list',
          name: 'Reading List',
          chromeGuid: 'other-guid',
          selected: [],
          buckets: { new: [], already: [], titleFill: [] },
        },
      ],
    );
    assert.equal(next.collections[0].chromeGuid, 'original-guid');
  });

  it('updates Collection name on attach without rewriting id', () => {
    const next = applyPlans(config, [
      {
        action: 'attach',
        collectionId: 'reading-list',
        name: 'Essays',
        chromeGuid: 'reading-guid',
        selected: [],
        buckets: { new: [], already: [], titleFill: [] },
      },
    ]);
    assert.equal(next.collections[0].id, 'reading-list');
    assert.equal(next.collections[0].name, 'Essays');
  });
});
