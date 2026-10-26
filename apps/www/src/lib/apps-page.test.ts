import { describe, expect, it } from 'vitest';

import {
  bookmarksIndexHead,
  collectionPageHead,
  inspirationsPageHead,
  musicPageHead,
  photosPageHead,
} from '@/lib/apps-page';

describe('musicPageHead', () => {
  it('matches the current Music title, description, and canonical URL', () => {
    const head = musicPageHead();

    expect(head.meta).toContainEqual({ title: 'Music | Devvrat' });
    expect(head.meta).toContainEqual({
      name: 'description',
      content: 'Play tracks made in collaboration with AI artists.',
    });
    expect(head.links).toContainEqual({
      rel: 'canonical',
      href: 'https://www.devvrat.cc/music',
    });
  });
});

describe('inspirationsPageHead', () => {
  it('matches the current Inspirations title, description, and canonical URL', () => {
    const head = inspirationsPageHead();

    expect(head.meta).toContainEqual({ title: 'Inspirations | Devvrat' });
    expect(head.meta).toContainEqual({
      name: 'description',
      content: 'A pinboard of quotes, ideas, and small truths I keep coming back to.',
    });
    expect(head.links).toContainEqual({
      rel: 'canonical',
      href: 'https://www.devvrat.cc/inspirations',
    });
  });
});

describe('bookmarksIndexHead', () => {
  it('matches the current Bookmarks title, description, and canonical URL', () => {
    const head = bookmarksIndexHead();

    expect(head.meta).toContainEqual({ title: 'Bookmarks | Devvrat' });
    expect(head.meta).toContainEqual({
      name: 'description',
      content: 'Collections of links worth keeping.',
    });
    expect(head.links).toContainEqual({
      rel: 'canonical',
      href: 'https://www.devvrat.cc/bookmarks',
    });
  });
});

describe('photosPageHead', () => {
  it('matches the current Photos title, description, and canonical URL', () => {
    const head = photosPageHead();

    expect(head.meta).toContainEqual({ title: 'Photos | Devvrat' });
    expect(head.meta).toContainEqual({
      name: 'description',
      content: 'A journal of places I stopped to look.',
    });
    expect(head.links).toContainEqual({
      rel: 'canonical',
      href: 'https://www.devvrat.cc/photos',
    });
  });
});

describe('collectionPageHead', () => {
  it('matches the Reading List title, description, and breadcrumb structured data', () => {
    const head = collectionPageHead({
      id: 'reading-list',
      name: 'Reading List',
      description: 'Long-form articles I keep coming back to.',
    });

    expect(head.meta).toContainEqual({ title: 'Reading List · Bookmarks | Devvrat' });
    expect(head.meta).toContainEqual({
      name: 'description',
      content: 'Long-form articles I keep coming back to.',
    });
    expect(head.links).toContainEqual({
      rel: 'canonical',
      href: 'https://www.devvrat.cc/bookmarks/reading-list',
    });
    expect(head.jsonLd).toEqual({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Bookmarks',
          item: 'https://www.devvrat.cc/bookmarks',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Reading List',
          item: 'https://www.devvrat.cc/bookmarks/reading-list',
        },
      ],
    });
  });

  it('uses the collection name when the curator left the description empty', () => {
    const head = collectionPageHead({
      id: 'field-notes',
      name: 'Field Notes',
      description: '',
    });

    expect(head.meta).toContainEqual({
      name: 'description',
      content: 'Bookmarked links — Field Notes',
    });
  });
});
