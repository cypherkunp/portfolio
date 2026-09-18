import { useTranslations } from 'next-intl';

import { cn } from '@/lib/utils';
import UnderlineText from '@/components/underline-text';

export function Colophon({ className }: { className?: string }) {
  const t = useTranslations('Colophon');
  return (
    <div
      className={cn(
        `pointer-events-none mt-12 flex flex-col items-center pb-8 md:mt-16`,
        className,
      )}
    >
      <div className="flex flex-col items-start justify-start">
        <p className="text-sm text-neutral-500">
          {t.rich('description', {
            underline: chunks => <UnderlineText>{chunks}</UnderlineText>,
          })}
        </p>
      </div>
    </div>
  );
}
