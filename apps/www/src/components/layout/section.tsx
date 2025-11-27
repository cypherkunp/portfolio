import { cn } from '@/lib/utils';
import { RenderIf } from '@/components/render-if';
import UnderlineText from '@/components/underline-text';

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
        <div className="mb-4 flex w-full flex-col items-start justify-start gap-4">
          <RenderIf condition={!!title}>
            <h2 className="text-lg font-bold tracking-tight">
              <UnderlineText>{title}</UnderlineText>
            </h2>
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
