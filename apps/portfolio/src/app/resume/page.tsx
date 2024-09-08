import PageContainer from '@/components/layout/page-container';
import { ProjectCard } from '@/components/project-card';
import { Section } from '@/components/layout/section';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

import { GlobeIcon, MailIcon, PhoneIcon } from 'lucide-react';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { RenderIf } from '@/components/render-if';

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getTranslations('ResumePage');
  return {
    title: t('title'),
    description: t('description'),
  };
};

export default function Page() {
  const t = useTranslations('ResumePage.data');

  return (
    <PageContainer className="overflow-auto font-mono print:p-12 ">
      <article className="w-full">
        <Section className="gap-y-3" isFirstSection>
          <div className="flex items-center justify-between">
            <div className="flex-1 space-y-1.5">
              <h1 className="text-2xl font-bold">{t('name')}</h1>
              <p className="text-muted-foreground max-w-md text-pretty font-mono text-sm">
                {t('about')}
              </p>
              <p className="text-muted-foreground max-w-md items-center text-pretty font-mono text-xs">
                <a
                  className="inline-flex gap-x-1.5 align-baseline leading-none hover:underline"
                  href={t('locationLink')}
                  target="_blank"
                >
                  <GlobeIcon className="size-3" />
                  {t('location')}
                </a>
              </p>
              <div className="text-muted-foreground flex gap-x-1 pt-1 font-mono text-sm print:hidden">
                {t('contact.email') && (
                  <Button className="size-8" variant="outline" size="icon" asChild>
                    <a href={`mailto:${t('contact.email')}`}>
                      <MailIcon className="size-4" />
                    </a>
                  </Button>
                )}
                {t('contact.tel') && (
                  <Button className="size-8" variant="outline" size="icon" asChild>
                    <a href={`tel:${t('contact.tel')}`}>
                      <PhoneIcon className="size-4" />
                    </a>
                  </Button>
                )}
                {t.raw('social.links').map((social: any) => (
                  <Button
                    key={social.name}
                    className="size-8"
                    variant="outline"
                    size="icon"
                    asChild
                  >
                    <a href={social.url}>
                      <social.icon className="size-4" />
                    </a>
                  </Button>
                ))}
              </div>
              <div className="text-muted-foreground hidden flex-col gap-x-1 font-mono text-sm print:flex">
                {t('contact.email') && (
                  <a href={`mailto:${t('contact.email')}`}>
                    <span className="underline">{t('contact.email')}</span>
                  </a>
                )}
                {t('contact.tel') && (
                  <a href={`tel:${t('contact.tel')}`}>
                    <span className="underline">{t('contact.tel')}</span>
                  </a>
                )}
              </div>
            </div>

            <Avatar className="size-28 rounded-full md:size-36">
              <AvatarImage alt={t('name')} src={t('avatarUrl')} />
              <AvatarFallback>{t('initials')}</AvatarFallback>
            </Avatar>
          </div>
        </Section>
        <Section className="gap-y-3">
          <h2 className="text-xl font-bold">About</h2>
          <ul className="flex list-inside list-disc flex-col gap-y-1 ">
            {t('summary')
              .split('. ')
              .map((sentence, index) => (
                <li key={index} className="text-muted-foreground text-pretty font-mono text-sm">
                  {sentence}
                </li>
              ))}
          </ul>
        </Section>
        <Section className="gap-y-3">
          <h2 className="text-xl font-bold">Work Experience</h2>
          <div className="space-y-4 md:space-y-6">
            {t.raw('work').map((work: any) => {
              return (
                <Card key={work.company} className="border-none ">
                  <CardHeader className="p-3 md:p-6">
                    <div
                      className="flex flex-col items-start justify-start gap-x-2 text-base md:flex-row md:items-center
                        md:justify-between"
                    >
                      <h3 className="inline-flex items-center justify-center gap-x-1 font-[200] leading-none">
                        <a className="hover:underline" href={work.link}>
                          {work.company}
                        </a>

                        <RenderIf condition={!!work.badges}>
                          <span className="inline-flex gap-x-1">
                            {work.badges?.map((badge: string) => (
                              <Badge
                                variant="secondary"
                                className="align-middle text-xs"
                                key={badge}
                              >
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

                    <h4 className="text-muted-foreground font-mono text-sm leading-none">
                      {work.title}
                    </h4>
                  </CardHeader>
                  <CardContent className="mt-3 p-3 text-xs md:p-6">{work.description}</CardContent>
                </Card>
              );
            })}
          </div>
        </Section>
        <Section className="gap-y-3">
          <h2 className="text-xl font-bold">Education</h2>
          {t.raw('education').map((education: any) => {
            return (
              <Card key={education.school} className="border-none">
                <CardHeader className="p-3 md:p-6">
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
                <CardContent className="mt-2 p-3 text-xs md:p-6">{education.degree}</CardContent>
              </Card>
            );
          })}
        </Section>
        <Section className="gap-y-3">
          <h2 className="text-xl font-bold">Skills</h2>
          <div className="flex flex-wrap gap-1">
            {t.raw('skills').map((skill: string) => {
              return (
                <Badge className="rounded-xl bg-slate-800 px-3 py-1 text-white" key={skill}>
                  {skill}
                </Badge>
              );
            })}
          </div>
        </Section>

        <RenderIf condition={false}>
          <Section className="print-force-new-page scroll-mb-16">
            <h2 className="text-xl font-bold">Projects</h2>
            <div className="-mx-3 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 print:grid-cols-3 print:gap-2">
              {t.raw('projects')?.map((project: any) => {
                return (
                  <ProjectCard
                    key={project.title}
                    title={project.title}
                    description={project.description}
                    tags={project.techStack}
                    link={'link' in project ? project.link.href : undefined}
                  />
                );
              })}
            </div>
          </Section>
        </RenderIf>
      </article>
    </PageContainer>
  );
}
