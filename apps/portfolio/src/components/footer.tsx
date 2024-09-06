import UnderlineText from './underline-text';
import { useTranslations } from 'next-intl';

export function Footer() {
  const t = useTranslations('Footer');
  return (
    <footer className="flex h-[80px] w-full items-center justify-center">
      <p className="text-sm text-neutral-500">
        {t('handmadeBy')} <UnderlineText>{t('name')}</UnderlineText>
      </p>
    </footer>
  );
}
