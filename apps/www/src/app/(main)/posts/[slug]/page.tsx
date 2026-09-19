import { Suspense } from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

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
  return {
    title: data.title,
    description: data.summary,
    openGraph: {
      title: data.title,
      description: data.summary,
      type: 'article',
      publishedTime: data.publishedOn,
      images: data.image
        ? [
            {
              url: data.image,
              width: 1200,
              height: 630,
              alt: data.title,
            },
          ]
        : [],
    },
    twitter: {
      title: data.title,
      description: data.summary,
      images: data.image ? [data.image] : [],
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
