import React from 'react';
import { cn } from '@/lib/utils';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  isFirstSection?: boolean;
}

export function Section({ children, className, isFirstSection = false }: SectionProps) {
  return (
    <section
      className={cn(
        'flex w-full flex-col gap-y-3',
        'pb-[10px] md:pb-[30px]',
        {
          'pt-[10px] md:pt-[30px]': !isFirstSection,
          'pt-0': isFirstSection,
        },
        className,
      )}
    >
      {children}
    </section>
  );
}
