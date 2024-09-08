import React from 'react';
import UnderlineText from '../underline-text';
import { useTranslations } from 'next-intl';

export function Footer() {
  const t = useTranslations('Footer');
  return (
    <footer className="mt-[80px] flex w-full items-center justify-center py-6">
      <p className="text-sm text-neutral-500">
        {t('handmadeBy')} <UnderlineText>{t('name')}</UnderlineText>
      </p>
    </footer>
  );
}
