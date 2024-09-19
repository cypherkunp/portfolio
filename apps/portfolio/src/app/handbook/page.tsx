import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import PageContainer from '@/components/layout/page-container';
import Handbook from '@/content/handbook.mdx';

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getTranslations();

  return {
    title: t('HandbookPage.title'),
    description: t('HandbookPage.description'),
    openGraph: {
      title: t('HandbookPage.title'),
      description: t('HandbookPage.description'),
      type: 'article',
      url: t('HandbookPage.url'),
      images: [
        {
          url: t('HandbookPage.ogImage'),
          width: 660,
          height: 240,
          alt: t('Common.contact.name'),
        },
      ],
    },
    twitter: {
      title: t('HandbookPage.title'),
      description: t('HandbookPage.description'),
      images: [t('HandbookPage.ogImage')],
      creator: '@cypherkunp',
    },
  };
};

export default function Page() {
  return (
    <PageContainer className="prose prose-md dark:prose-invert prose-neutral">
      <Handbook />
    </PageContainer>
  );
}
