import { Mail, Twitter, Linkedin, Github } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import React from 'react';
import { RenderIf } from './render-if';

export default function ConnectBlock() {
  const t = useTranslations('Common');

  return (
    <div className="text-foreground w-full px-4 sm:px-6 lg:px-8">
      <div className="mx-auto flex flex-col items-start justify-between space-y-6 sm:flex-row sm:items-center sm:space-y-0">
        <ReachOutOn
          title={t('connectBlock.reachOutOn.title')}
          description={t.rich('connectBlock.reachOutOn.description', {
            email: text => <SocialLink href={t('contact.email')} text={text as string} />,
            twitter: text => <SocialLink href={t('contact.twitter')} text={text as string} />,
          })}
        />
        <FindMeOn
          title={t('connectBlock.findMeOn.title')}
          description={t.rich('connectBlock.findMeOn.description', {
            linkedin: text => <SocialLink href={t('contact.linkedin')} text={text as string} />,
            github: text => <SocialLink href={t('contact.github')} text={text as string} />,
          })}
        />
      </div>
    </div>
  );
}

function ReachOutOn({ title, description }: { title: string; description: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
  );
}

function FindMeOn({ title, description }: { title: string; description: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold">{title}</h3>
      <RenderIf condition={!!description}>
        <p className="text-muted-foreground text-sm">{description}</p>
      </RenderIf>
    </div>
  );
}

function SocialLink({ href, text }: { href: string; text: string }) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-secondary inline-block text-sm transition-colors"
    >
      {text}
    </Link>
  );
}
