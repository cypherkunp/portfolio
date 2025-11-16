import Link from 'next/link';

import { formatDate, getBlogPosts } from '@/lib/post.utils';

export default async function PostsBlock() {
  const allBlogs = getBlogPosts();

  if (!allBlogs || allBlogs.length === 0) {
    return <div className="text-neutral-500">No posts available.</div>;
  }

  const sortedPosts = [...allBlogs].sort((a, b) => {
    if (new Date(a.metadata.publishedOn) > new Date(b.metadata.publishedOn)) {
      return -1;
    }
    return 1;
  });

  return (
    <div>
      {sortedPosts.map(post => (
        <Link key={post.slug} className="mb-4 flex flex-col space-y-1" href={`/posts/${post.slug}`}>
          <div className="flex w-full flex-col space-x-0 md:flex-row md:space-x-2">
            <p className="w-[100px] tabular-nums text-neutral-600 dark:text-neutral-400">
              {formatDate(post.metadata.publishedOn, false)}
            </p>
            <p className="tracking-tight text-neutral-900 dark:text-neutral-100">
              {post.metadata.title}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
