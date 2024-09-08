import { cn } from '@/lib/utils';
import { RenderIf } from '../render-if';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  isFirstSection?: boolean;
  title?: string;
  description?: string;
}

export function Section({
  children,
  className,
  isFirstSection = false,
  title,
  description,
}: SectionProps) {
  return (
    <section
      className={cn(
        'flex w-full flex-col gap-y-1 md:gap-y-0',
        'pb-[15px] md:pb-[30px]',
        {
          'pt-[15px] md:pt-[30px]': !isFirstSection,
          'pt-0': isFirstSection,
        },
        className,
      )}
    >
      <RenderIf condition={!!title || !!description}>
        <div className="mb-2 h-[2px] w-10 bg-red-400"></div>
        <div className="mx-auto mb-5 w-full md:mb-10">
          <RenderIf condition={!!title}>
            <h2 className="mb-2 text-2xl font-bold tracking-tight">{title}</h2>
          </RenderIf>
          <RenderIf condition={!!description}>
            <p className="text-muted-foreground">{description}</p>
          </RenderIf>
        </div>
      </RenderIf>
      {children}
    </section>
  );
}
