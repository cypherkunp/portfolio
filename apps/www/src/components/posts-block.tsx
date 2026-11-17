import { getTimeSortedPosts } from '@/lib/post.utils';
import { PostLinks } from '@/components/post-links';

export default function PostsBlock() {
  const posts = getTimeSortedPosts().map(post => ({
    slug: post.slug,
    title: post.metadata.title,
    publishedOn: post.metadata.publishedOn,
  }));

  return <PostLinks posts={posts} />;
}
