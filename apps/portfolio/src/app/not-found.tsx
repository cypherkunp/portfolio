import { useTranslations } from 'next-intl';

export default function NotFound() {
  const t = useTranslations();
  return (
    <div className="text-warm-white my-auto flex flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-9xl font-bold ">{t('NotFoundPage.content.title')}</h1>
      <p className="max-w-80">{t('NotFoundPage.content.description')}</p>
    </div>
  );
}
