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

export function formatDate(date: string, includeRelative = false) {
  if (!date.includes('T')) {
    date = `${date}T00:00:00`;
  }
  const targetDate = new Date(date);

  const fullDate = targetDate.toLocaleString('en-us', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  if (!includeRelative) {
    return fullDate;
  }

  // Only calculate relative time if needed (this requires current date)
  // For static generation, we skip relative time calculation
  // If relative time is needed, it should be calculated on the client side
  return fullDate;
}
