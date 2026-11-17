import { Badge } from '@repo/ui/components/badge';
import PageContainer from '@repo/ui/components/layout/page-container';
import { Section } from '@repo/ui/components/layout/section';
import { RenderIf } from '@repo/ui/components/render-if';
import { useTranslations } from 'next-intl';

import { faqJsonLd, serializeJsonLd } from '@/lib/seo';
import { FaqBlock } from '@/components/faq-block';
import StackBlock from '@/components/stack-block';

export function AboutPage() {
  const rootTranslations = useTranslations();
  const t = useTranslations('AboutPage.data');
  const stackBlock = useTranslations('Blocks.stackBlock');
  const faqs = rootTranslations.raw('Blocks.faqBlock.list') as {
    question: string;
    answer: string;
  }[];

  return (
    <PageContainer className="w-full overflow-auto print:p-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(faqJsonLd(faqs)) }}
      />
      <Section isFirstSection title={t('labels.about')}>
        <ul className="flex list-inside list-disc flex-col gap-2">
          {t('summary')
            .split('. ')
            .map((sentence, index) => (
              <li key={index} className="text-base leading-relaxed text-pretty">
                {sentence}
              </li>
            ))}
        </ul>
      </Section>
      <Section title={stackBlock('title')}>
        <StackBlock />
      </Section>
      <Section title={t('labels.work')}>
        {(t.raw('work') as WorkEntry[]).map(work => {
          return (
            <div key={work.company} className="mb-10 last:mb-0">
              <div className="flex flex-col items-start justify-start gap-y-1 text-base md:flex-row md:items-center md:justify-between md:gap-y-0">
                <h3 className="inline-flex items-center justify-center gap-x-2 text-base leading-none font-normal">
                  <a
                    className="hover:underline hover:decoration-yellow-500 hover:underline-offset-8"
                    href={work.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {work.company}
                  </a>

                  <RenderIf condition={!!work.badges}>
                    <span className="inline-flex gap-x-1">
                      {work.badges?.map((badge: string) => (
                        <Badge variant="secondary" className="align-middle text-base" key={badge}>
                          {badge}
                        </Badge>
                      ))}
                    </span>
                  </RenderIf>
                </h3>
                <div className="min-w-[96px] text-sm text-neutral-500 tabular-nums">
                  {work.start} - {work.end}
                </div>
              </div>

              <p className="text-muted-foreground mt-1 text-base leading-relaxed">{work.title}</p>
              <p className="mt-3 text-base leading-relaxed">{work.description}</p>
            </div>
          );
        })}
      </Section>
      <Section title={t('labels.education')}>
        {(t.raw('education') as EducationEntry[]).map(education => {
          return (
            <div key={education.school}>
              <div className="flex flex-col items-start justify-start gap-y-1 text-base md:flex-row md:items-center md:justify-between md:gap-y-0">
                <h3 className="leading-none">{education.school}</h3>
                <div className="text-sm text-neutral-500 tabular-nums">
                  {education.start} - {education.end}
                </div>
              </div>
              <p className="mt-3 text-base leading-relaxed">{education.degree}</p>
            </div>
          );
        })}
      </Section>
      <Section title="Skills">
        <div className="flex flex-wrap gap-2">
          {(t.raw('skills') as string[]).map((skill: string) => {
            return (
              <Badge
                variant="outline"
                className="border-border rounded-sm px-2.5 py-0.5 text-sm font-normal text-neutral-700 dark:text-neutral-300"
                key={skill}
              >
                {skill}
              </Badge>
            );
          })}
        </div>
      </Section>
      <Section
        title={rootTranslations('Blocks.faqBlock.title')}
        description={rootTranslations('Blocks.faqBlock.description')}
        isLastSection
      >
        <FaqBlock />
      </Section>
    </PageContainer>
  );
}

interface WorkEntry {
  company: string;
  link: string;
  badges?: string[];
  start: string;
  end: string;
  title: string;
  description: string;
}

interface EducationEntry {
  school: string;
  degree: string;
  start: string;
  end: string;
}
