import Link from 'next/link';

import { formatDate, getBlogPosts } from '@/lib/post.utils';

export default async function PostsBlock() {
  const allBlogs = getBlogPosts();

  if (!allBlogs || allBlogs.length === 0) {
    return <div className="text-neutral-500">No posts available.</div>;
  }

  const sortedPosts = [...allBlogs].sort((a, b) => {
    const da = new Date(a.metadata.publishedOn);
    const db = new Date(b.metadata.publishedOn);
    if (isNaN(da.getTime()) && isNaN(db.getTime())) return 0;
    if (isNaN(da.getTime())) return 1;
    if (isNaN(db.getTime())) return -1;
    return db.getTime() - da.getTime();
  });

  return (
    <div>
      {sortedPosts.map(post => (
        <Link key={post.slug} className="mb-4 flex flex-col space-y-1" href={`/posts/${post.slug}`}>
          <p className="tracking-tight text-neutral-900 dark:text-neutral-100">
            {post.metadata.title}
          </p>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            {formatDate(post.metadata.publishedOn, false)} | v{post.metadata.version} |{' '}
            {Array.isArray(post.metadata.tags) ? post.metadata.tags.join(', ') : ''}
          </p>
        </Link>
      ))}
    </div>
  );
}
