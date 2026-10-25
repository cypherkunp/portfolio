import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { documentTitle, socialMetadata } from '@/lib/seo';
import { AboutPage } from '@/components/about-page';

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getTranslations();

  const title = t('AboutPage.title');
  const description = t('AboutPage.description');

  return {
    title: documentTitle(title),
    description,
    ...socialMetadata({
      title,
      description,
      url: '/about',
    }),
  };
};

export default function Page() {
  return <AboutPage />;
}
