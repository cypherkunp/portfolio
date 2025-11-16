import { Suspense } from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { getBlogPosts } from '@/lib/post.utils';
import PageContainer from '@/components/layout/page-container';

async function PostContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  try {
    const { default: Post } = await import(`@/content/posts/${slug}.mdx`);

    return (
      <PageContainer className="prose prose-headings:mt-8 prose-headings:font-semibold prose-headings:text-black prose-h1:text-5xl prose-h2:text-4xl prose-h3:text-3xl prose-h4:text-2xl prose-h5:text-xl prose-h6:text-lg dark:prose-headings:text-white">
        <div className="[&>code:first-of-type]:hidden [&>pre:first-of-type]:hidden">
          <Post />
        </div>
      </PageContainer>
    );
  } catch (error) {
    // If the MDX file doesn't exist, return 404
    console.error(`Failed to load post with slug: ${slug}`, error);
    notFound();
  }
}

export async function generateStaticParams() {
  const posts = getBlogPosts();
  return posts.map(post => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const posts = getBlogPosts();
  const post = posts.find(p => p.slug === slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: post.metadata.title,
    description: post.metadata.summary,
    openGraph: {
      title: post.metadata.title,
      description: post.metadata.summary,
      type: 'article',
      publishedTime: post.metadata.publishedOn,
      images: post.metadata.image
        ? [
            {
              url: post.metadata.image,
              width: 1200,
              height: 630,
              alt: post.metadata.title,
            },
          ]
        : [],
    },
    twitter: {
      title: post.metadata.title,
      description: post.metadata.summary,
      images: post.metadata.image ? [post.metadata.image] : [],
    },
  };
}

export default function Page({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense fallback={<PageContainer>Loading...</PageContainer>}>
      <PostContent params={params} />
    </Suspense>
  );
}
