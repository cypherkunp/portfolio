import { useTranslations } from 'next-intl';

import { SiteShell } from './-site-shell';

export function NotFound() {
  const t = useTranslations();

  return (
    <SiteShell>
      <div className="text-warm-white flex flex-1 flex-col items-center justify-center gap-4 text-center">
        <h1 className="text-9xl font-bold">{t('NotFoundPage.content.title')}</h1>
        <p className="max-w-80">{t('NotFoundPage.content.description')}</p>
      </div>
    </SiteShell>
  );
}
