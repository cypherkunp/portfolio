import { cn } from '@/lib/utils';

import { RenderIf } from '../render-if';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  isFirstSection?: boolean;
  isLastSection?: boolean;
  title?: string;
  description?: string;
}

export function Section({
  children,
  className,
  isFirstSection = false,
  isLastSection = false,
  title,
  description,
}: SectionProps) {
  return (
    <section
      className={cn(
        'flex w-full flex-col gap-y-1 md:gap-y-0 ',
        {
          'pt-[25px] md:pt-[40px]': !isFirstSection,
          'pb-[25px] md:pb-[40px]': !isLastSection,
          'pt-0': isFirstSection,
          'pb-0': isLastSection,
        },
        className,
      )}
    >
      <RenderIf condition={!!title || !!description}>
        <div className="flex flex-col items-center justify-start ">
          <div className="mx-auto mb-4 w-full md:mb-6">
            <RenderIf condition={!!title}>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold tracking-tight">{title}</h2>
              </div>
            </RenderIf>

            <RenderIf condition={!!description}>
              <p className="text-muted-foreground">{description}</p>
            </RenderIf>
          </div>
        </div>
      </RenderIf>
      {children}
    </section>
  );
}
