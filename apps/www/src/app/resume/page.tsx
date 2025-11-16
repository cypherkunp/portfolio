import { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { FaqBlock } from '@/components/faq-block';
import PageContainer from '@/components/layout/page-container';
import { Section } from '@/components/layout/section';
import { RenderIf } from '@/components/render-if';
import StackBlock from '@/components/stack-block';

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getTranslations();

  return {
    title: t('ResumePage.title'),
    description: t('ResumePage.description'),
    openGraph: {
      title: t('ResumePage.title'),
      description: t('ResumePage.description'),
      type: 'article',
      url: t('ResumePage.url'),
      images: [
        {
          url: t('ResumePage.ogImage'),
          width: 660,
          height: 240,
          alt: t('Common.contact.name'),
        },
      ],
    },
    twitter: {
      title: t('ResumePage.title'),
      description: t('ResumePage.description'),
      images: [t('ResumePage.ogImage')],
      creator: '@cypherkunp',
    },
  };
};

export default function Page() {
  const th = useTranslations();
  const t = useTranslations('ResumePage.data');
  const stackBlock = useTranslations('Blocks.stackBlock');

  return (
    <PageContainer className="mx-auto max-w-3xl overflow-auto print:p-12">
      <Section title={t('labels.about')} isFirstSection>
        <ul className="flex list-inside list-disc flex-col  ">
          {t('summary')
            .split('. ')
            .map((sentence, index) => (
              <li key={index} className="text-pretty text-sm">
                {sentence}
              </li>
            ))}
        </ul>
      </Section>
      <Section className="space-y-2" title={stackBlock('title')}>
        <StackBlock />
      </Section>
      <Section title={t('labels.work')}>
        {t.raw('work').map((work: any) => {
          return (
            <Card key={work.company} className="mb-10 space-y-2 border-none !bg-neutral-950">
              <CardHeader className="mb-8 !p-0">
                <div
                  className="flex flex-col items-start justify-start text-base md:flex-row md:items-center
                      md:justify-between"
                >
                  <h3 className="text-md inline-flex items-center justify-center gap-x-1 font-normal leading-none">
                    <a className="hover:underline" href={work.link}>
                      {work.company}
                    </a>

                    <RenderIf condition={!!work.badges}>
                      <span className="inline-flex gap-x-1">
                        {work.badges?.map((badge: string) => (
                          <Badge variant="secondary" className="align-middle text-xs" key={badge}>
                            {badge}
                          </Badge>
                        ))}
                      </span>
                    </RenderIf>
                  </h3>
                  <div className="min-w-[96px] text-sm tabular-nums text-gray-500">
                    {work.start} - {work.end}
                  </div>
                </div>

                <p className="text-muted-foreground font-mono text-sm leading-none">{work.title}</p>
              </CardHeader>
              <CardContent className="!p-0 text-sm">{work.description}</CardContent>
            </Card>
          );
        })}
      </Section>
      <Section title={t('labels.education')}>
        {t.raw('education').map((education: any) => {
          return (
            <Card key={education.school} className="space-y-4 border-none !bg-neutral-950">
              <CardHeader className="mb-8 !p-0">
                <div
                  className="flex flex-col items-start justify-start gap-x-2 text-base md:flex-row md:items-center
                    md:justify-between"
                >
                  <h3 className="font-[200] leading-none">{education.school}</h3>
                  <div className="text-sm tabular-nums text-gray-500">
                    {education.start} - {education.end}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="!p-0 text-xs">{education.degree}</CardContent>
            </Card>
          );
        })}
      </Section>
      <Section title="Skills">
        <div className="flex flex-wrap gap-1">
          {t.raw('skills').map((skill: string) => {
            return (
              <Badge className="bg-grey-800 rounded-xl px-3 py-1 text-white" key={skill}>
                {skill}
              </Badge>
            );
          })}
        </div>
      </Section>
      <Section
        title={th('HomePage.faqBlock.title')}
        description={th('HomePage.faqBlock.description')}
        isLastSection
      >
        <FaqBlock />
      </Section>
    </PageContainer>
  );
}
