import { Suspense } from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import {
  articleJsonLd,
  brandedTitle,
  documentTitle,
  serializeJsonLd,
  socialMetadata,
} from '@/lib/seo';
import { blog } from '@/lib/source';
import PageContainer from '@/components/layout/page-container';

import { getMDXComponents } from '../../../../../mdx-components';

async function PostContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = blog.getPage([slug]);

  if (!page) {
    notFound();
  }

  const data = page.data as any;
  const Mdx = data.body;
  const description = data.summary || data.title;

  return (
    <PageContainer>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(
            articleJsonLd({
              title: data.title,
              description,
              slug,
              publishedOn: data.publishedOn,
              image: data.image,
            }),
          ),
        }}
      />
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
  const description = data.summary || data.title;
  const images = data.image
    ? [{ url: data.image as string, width: 1200, height: 630, alt: data.title as string }]
    : undefined;

  return {
    title: documentTitle(data.title),
    description,
    ...socialMetadata({
      title: brandedTitle(data.title),
      description,
      url: `/posts/${slug}`,
      publishedTime: data.publishedOn,
      ...(images ? { images } : {}),
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
