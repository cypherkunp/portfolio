import { Suspense } from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { blog } from '@/lib/source';
import PageContainer from '@/components/layout/page-container';

import { getMDXComponents } from '../../../../mdx-components';

async function PostContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = blog.getPage([slug]);

  if (!page) {
    notFound();
  }

  const Mdx = (page.data as any).body;

  return (
    <PageContainer className="prose prose-headings:mt-8 prose-headings:font-semibold prose-headings:text-black prose-h1:text-5xl prose-h2:text-4xl prose-h3:text-3xl prose-h4:text-2xl prose-h5:text-xl prose-h6:text-lg dark:prose-headings:text-white">
      <div className="[&>code:first-of-type]:hidden [&>pre:first-of-type]:hidden">
        <Mdx components={getMDXComponents()} />
      </div>
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
