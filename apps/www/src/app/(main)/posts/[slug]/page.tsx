import { Suspense } from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { PORTFOLIO_BASE_URL } from '@/config/site-data';
import { socialMetadata } from '@/lib/seo';
import { blog } from '@/lib/source';
import PageContainer from '@/components/layout/page-container';

import { getMDXComponents } from '../../../../../mdx-components';

async function PostContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = blog.getPage([slug]);

  if (!page) {
    notFound();
  }

  const Mdx = (page.data as any).body;

  return (
    <PageContainer>
      <Mdx components={getMDXComponents()} />
    </PageContainer>
  );
}

export async function generateStaticParams() {
  return blog.getPages().map(page => ({
    slug: page.slugs[0],
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = blog.getPage([slug]);

  if (!page) {
    return {
      title: 'Post Not Found',
    };
  }

  const data = page.data as any;
  const images = data.image
    ? [{ url: data.image as string, width: 1200, height: 630, alt: data.title as string }]
    : [];

  return {
    title: data.title,
    description: data.summary,
    ...socialMetadata({
      title: data.title,
      description: data.summary,
      url: `${PORTFOLIO_BASE_URL}/posts/${slug}`,
      publishedTime: data.publishedOn,
      images,
    }),
  };
}

export default function Page({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense fallback={<PageContainer>Loading...</PageContainer>}>
      <PostContent params={params} />
    </Suspense>
  );
}
