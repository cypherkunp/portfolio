import { publishedOnTime } from '@/lib/format-date';
import { blog } from '@/lib/source';

type Metadata = {
  title: string;
  publishedOn: string;
  version: string;
  image?: string;
  tags: string[];
};

export function getBlogPosts() {
  // Use Fumadocs source API to get all blog posts
  const pages = blog.getPages();

  // Map Fumadocs page data to the existing format for backward compatibility
  return pages.map(page => {
    const slug = page.slugs[0];
    const data = page.data as any;

    const metadata: Metadata = {
      title: data.title || '',
      publishedOn: data.publishedOn || '',
      version: data.version || '',
      tags: data.tags || [],
      image: data.image,
    };

    return {
      metadata,
      slug,
      content: '', // Content is now accessed via page.data.body in MDX components
    };
  });
}

export function getAllTags() {
  const tags = Array.from(new Set(getBlogPosts().flatMap(post => post.metadata.tags)));
  return tags.sort((a: string, b: string) => a.localeCompare(b));
}

export function getTimeSortedPosts() {
  return [...getBlogPosts()].sort((a, b) => {
    const postA = publishedOnTime(a.metadata.publishedOn);
    const postB = publishedOnTime(b.metadata.publishedOn);
    if (isNaN(postA) && isNaN(postB)) return 0;
    if (isNaN(postA)) return 1;
    if (isNaN(postB)) return -1;
    return postB - postA;
  });
}
