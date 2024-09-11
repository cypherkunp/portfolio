import { Metadata } from 'next';
import Handbook from '@/content/handbook.mdx';
import PageContainer from '@/components/layout/page-container';
import { getTranslations } from 'next-intl/server';

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getTranslations('HandbookPage');
  return {
    title: t('title'),
    description: t('description'),
  };
};

export default function Page() {
  return (
    <PageContainer className="prose prose-sm md:prose-lg dark:prose-invert prose-neutral">
      <Handbook />
    </PageContainer>
  );
}
