import React from 'react';
import UnderlineText from '../underline-text';
import { useTranslations } from 'next-intl';
import ConnectBlock from '../connect-block';

export function Footer() {
  const t = useTranslations('Footer');
  return (
    <footer
      className="border-secondary mt-[40px] flex flex-col items-center space-y-12 border-t-[1px] pb-8 pt-6
        md:mt-[80px] md:space-y-16"
    >
      <ConnectBlock />

      <div className=" flex flex-col items-start justify-start">
        <p className="text-sm text-neutral-500 ">
          {t.rich('description', {
            underline: chunks => <UnderlineText>{chunks}</UnderlineText>,
          })}
        </p>
      </div>
    </footer>
  );
}
