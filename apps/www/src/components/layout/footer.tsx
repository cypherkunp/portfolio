import { useTranslations } from 'next-intl';

import { cn } from '@/lib/utils';
import ConnectBlock from '@/components/connect-block';
import UnderlineText from '@/components/underline-text';

export function Footer({ className }: { className?: string }) {
  const t = useTranslations('Footer');
  return (
    <footer
      className={cn(
        `border-secondary flex flex-col items-center space-y-12 border-t pb-8 pt-6
        md:space-y-16`,
        className,
      )}
    >
      <ConnectBlock />

      <div className="pointer-events-none flex flex-col items-start justify-start">
        <p className="text-sm text-neutral-500 ">
          {t.rich('description', {
            underline: chunks => <UnderlineText>{chunks}</UnderlineText>,
          })}
        </p>
      </div>
    </footer>
  );
}
