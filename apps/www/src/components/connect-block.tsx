import React from 'react';
import { useTranslations } from 'next-intl';

import ExternalLink from './external-link';
import { RenderIf } from './render-if';

export default function ConnectBlock() {
  const t = useTranslations('Common');

  return (
    <div className="text-foreground w-full">
      <div className="mx-auto flex flex-col items-start justify-between space-y-6 sm:flex-row sm:items-center sm:space-y-0">
        <ReachOutOn
          title={t('connectBlock.reachOutOn.title')}
          description={t.rich('connectBlock.reachOutOn.description', {
            email: text => <ExternalLink href={t('contact.email')} text={text as string} />,
            twitter: text => <ExternalLink href={t('contact.twitter')} text={text as string} />,
          })}
        />
        <FindMeOn
          title={t('connectBlock.findMeOn.title')}
          description={t.rich('connectBlock.findMeOn.description', {
            linkedin: text => <ExternalLink href={t('contact.linkedin')} text={text as string} />,
            github: text => <ExternalLink href={t('contact.github')} text={text as string} />,
          })}
        />
      </div>
    </div>
  );
}

function ReachOutOn({ title, description }: { title: string; description: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <h3 className="text-md font-semibold">{title}</h3>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
  );
}

function FindMeOn({ title, description }: { title: string; description: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <h3 className="text-md font-semibold">{title}</h3>
      <RenderIf condition={!!description}>
        <p className="text-muted-foreground text-sm">{description}</p>
      </RenderIf>
    </div>
  );
}
