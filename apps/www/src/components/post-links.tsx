import Link from 'next/link';

import { formatDate } from '@/lib/format-date';

export interface PostLink {
  slug: string;
  title: string;
  publishedOn: string;
}

export function PostLinks({ posts }: { posts: PostLink[] }) {
  if (posts.length === 0) {
    return <div className="text-neutral-500">No posts available.</div>;
  }

  return (
    <div>
      {posts.map(post => (
        <Link key={post.slug} className="mb-4 flex flex-col space-y-1" href={`/posts/${post.slug}`}>
          <div className="flex items-start gap-2">
            <p className="shrink-0 text-sm leading-6 text-neutral-600 tabular-nums dark:text-neutral-400">
              {formatDate(post.publishedOn, false)}
            </p>
            <p className="hover:decoration-tertiary tracking-tight text-neutral-900 hover:underline hover:underline-offset-8 dark:text-neutral-100">
              {post.title}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
