import type { Metadata } from 'next';
import Image from 'next/image';
import ProfilePic from '@/images/profile.jpg';
import { Camera, Github, Globe, Linkedin, Mail, MapPin, Twitter } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { ContactCard } from '@/components/contacts/contact-card';
import { CopyContactLink } from '@/components/contacts/copy-contact-link';
import PageContainer from '@/components/layout/page-container';
import { Section } from '@/components/layout/section';
import UnderlineText from '@/components/underline-text';

/** Matches desktop hero width: avatar ring (~8.125rem) + md gap + text column (28rem / max-w-md). */
const CONNECT_COLUMN = 'mx-auto w-full max-w-[min(100%,calc(8.125rem+2.5rem+28rem))]';

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getTranslations();

  return {
    title: t('ConnectPage.title'),
    description: t('ConnectPage.description'),
    openGraph: {
      title: t('ConnectPage.title'),
      description: t('ConnectPage.description'),
      type: 'profile',
      url: t('ConnectPage.url'),
      images: [
        {
          url: t('ConnectPage.ogImage'),
          width: 660,
          height: 240,
          alt: t('Common.contact.name'),
        },
      ],
    },
    twitter: {
      title: t('ConnectPage.title'),
      description: t('ConnectPage.description'),
      images: [t('ConnectPage.ogImage')],
      creator: '@devvrathq',
    },
  };
};

export default async function ConnectPage() {
  const t = await getTranslations();

  const name = t('Common.contact.name');
  const email = t('Common.contact.email');
  const address = t('Common.contact.address');
  const github = t('Common.contact.github');
  const linkedin = t('Common.contact.linkedin');
  const twitter = t('Common.contact.twitter');
  const portfolio = t('ConnectPage.url').replace(/\/connect$/, '');

  const githubHandle = github.replace(/^https?:\/\/(www\.)?github\.com\//, '');
  const linkedinHandle = linkedin
    .replace(/^https?:\/\/(www\.)?linkedin\.com\//, 'linkedin.com/')
    .replace(/\/$/, '');
  const twitterHandle = `@${twitter.replace(/^https?:\/\/(www\.)?(x\.com|twitter\.com)\//, '')}`;
  const portfolioHandle = portfolio.replace(/^https?:\/\/(www\.)?/, '');

  return (
    <PageContainer>
      <div className={CONNECT_COLUMN}>
        <Section isFirstSection>
          <div className="flex flex-col items-center gap-6 text-center md:flex-row md:items-center md:justify-start md:gap-10 md:text-left">
            <div className="from-secondary via-primary shrink-0 rounded-full bg-linear-to-tr to-yellow-200 p-[2px]">
              <div className="bg-background rounded-full p-[3px]">
                <Image
                  src={ProfilePic}
                  alt={name}
                  width={120}
                  height={120}
                  priority
                  className="size-[112px] rounded-full object-cover md:size-[120px]"
                />
              </div>
            </div>

            <div className="flex max-w-md flex-col items-center gap-4 md:items-start">
              <div className="flex flex-col items-center gap-2 md:items-start">
                <h1 className="text-2xl font-semibold tracking-tight">
                  <UnderlineText>{name}</UnderlineText>
                </h1>
                <p className="text-muted-foreground text-base leading-relaxed md:text-left md:text-sm">
                  {t('ConnectPage.hero.role')}
                  <span className="text-foreground/40 mx-2">/</span>
                  <span className="text-foreground/80">{t('ConnectPage.hero.bio')}</span>
                </p>
              </div>

              <span className="border-secondary/40 bg-secondary/10 text-secondary inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-xs">
                <span className="relative flex size-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-yellow-400 opacity-75" />
                  <span className="relative inline-flex size-1.5 rounded-full bg-yellow-400" />
                </span>
                {t('ConnectPage.hero.status')}
              </span>
            </div>
          </div>
        </Section>

        <Section>
          <div className="flex flex-col gap-3">
            <ContactCard
              icon={Mail}
              label={t('ConnectPage.labels.email')}
              value={email}
              href={`mailto:${email}`}
              external={false}
            />
            <ContactCard
              icon={Twitter}
              label={t('ConnectPage.labels.twitter')}
              value={twitterHandle}
              href={twitter}
            />
            <ContactCard
              icon={Linkedin}
              label={t('ConnectPage.labels.linkedin')}
              value={linkedinHandle}
              href={linkedin}
            />
            <ContactCard
              icon={Github}
              label={t('ConnectPage.labels.github')}
              value={githubHandle}
              href={github}
            />
            <ContactCard icon={MapPin} label={t('ConnectPage.labels.location')} value={address} />
            <ContactCard
              icon={Globe}
              label={t('ConnectPage.labels.portfolio')}
              value={portfolioHandle}
              href={portfolio}
              external={false}
            />
            <ContactCard
              icon={Camera}
              label={t('ConnectPage.labels.photos')}
              value="/photos"
              href="/photos"
              external={false}
            />
          </div>
        </Section>

        <Section isLastSection>
          <CopyContactLink
            url={t('ConnectPage.url')}
            triggerLabel={t('ConnectPage.share.trigger')}
            copiedLabel={t('ConnectPage.share.copied')}
          />
        </Section>
      </div>
    </PageContainer>
  );
}
