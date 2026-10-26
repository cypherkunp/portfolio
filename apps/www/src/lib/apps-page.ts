import { PORTFOLIO_BASE_URL } from '@/config/site-data';
import { brandedTitle, breadcrumbJsonLd } from '@/lib/seo';

function pageHead(name: string, description: string, path: string) {
  const title = brandedTitle(name);
  const url = `${PORTFOLIO_BASE_URL}${path}`;

  return {
    meta: [
      { title },
      { name: 'description', content: description },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:url', content: url },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
    ],
    links: [{ rel: 'canonical', href: url }],
  };
}

export function musicPageHead() {
  return pageHead('Music', 'Play tracks made in collaboration with AI artists.', '/music');
}

export function inspirationsPageHead() {
  return pageHead(
    'Inspirations',
    'A pinboard of quotes, ideas, and small truths I keep coming back to.',
    '/inspirations',
  );
}

export function photosPageHead() {
  return pageHead('Photos', 'A journal of places I stopped to look.', '/photos');
}

export function bookmarksIndexHead() {
  return pageHead('Bookmarks', 'Collections of links worth keeping.', '/bookmarks');
}

export function analyzerPageHead() {
  return pageHead(
    'Package Analyzer',
    'Analyze your package.json dependencies — find outdated packages, check versions, and inspect your project health.',
    '/analyzer',
  );
}

interface CollectionHeadInput {
  id: string;
  name: string;
  description: string;
}

export function collectionPageHead(collection: CollectionHeadInput) {
  const description = collection.description || `Bookmarked links — ${collection.name}`;
  const head = pageHead(
    `${collection.name} · Bookmarks`,
    description,
    `/bookmarks/${collection.id}`,
  );

  return {
    ...head,
    jsonLd: breadcrumbJsonLd([
      { name: 'Bookmarks', path: '/bookmarks' },
      { name: collection.name, path: `/bookmarks/${collection.id}` },
    ]),
  };
}
