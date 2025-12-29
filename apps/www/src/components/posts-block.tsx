import Link from 'next/link';

import { formatDate, getTimeSortedPosts } from '@/lib/post.utils';

export default async function PostsBlock() {
  const allTimeSortedPosts = getTimeSortedPosts();

  if (!allTimeSortedPosts || allTimeSortedPosts.length === 0) {
    return <div className="text-neutral-500">No posts available.</div>;
  }

  return (
    <div>
      {allTimeSortedPosts.map(post => (
        <Link key={post.slug} className="mb-4 flex flex-col space-y-1" href={`/posts/${post.slug}`}>
          <div className="flex items-center gap-2">
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              {formatDate(post.metadata.publishedOn, false)}
            </p>
            <p className="hover:decoration-tertiary tracking-tight text-neutral-900 hover:underline hover:underline-offset-8 dark:text-neutral-100">
              {post.metadata.title}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
