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
        <div className="flex flex-col items-start justify-start ">
          <div className="mx-auto mb-5 w-full  md:mb-10">
            <RenderIf condition={!!title}>
              <h2 className="mb-2 text-3xl font-bold tracking-tight">{title}</h2>
            </RenderIf>
            <div className="bg-secondary mb-2 h-[2px] w-[20px]" />

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
