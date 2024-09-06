import { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { RenderIf } from '@/components/render-if';
import Handbook from '@/content/handbook.mdx';
import PageContainer from '@/components/layout/page-container';

export const metadata: Metadata = {
  title: 'Handbook',
  description: "Devvrat's Handbook",
};

export default function Page() {
  return (
    <PageContainer className="prose prose-sm md:prose-lg dark:prose-invert prose-neutral">
      <Handbook />
    </PageContainer>
  );
}
