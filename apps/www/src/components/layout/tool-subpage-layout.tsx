import type { ReactNode } from 'react';

import { Footer } from '@/components/layout/footer';
import Header from '@/components/layout/header';
import { siteShellClassName } from '@/components/layout/site-shell';

import { cn } from '@/lib/utils';

interface ToolSubpageLayoutProps {
  children: ReactNode;
  /** Page title below the global header; omit when the page supplies its own heading. */
  title?: string;
  /** Drop extra bottom padding around main content (e.g. music player). */
  flush?: boolean;
  className?: string;
}

export function ToolSubpageLayout({
  children,
  title,
  flush = false,
  className,
}: ToolSubpageLayoutProps) {
  return (
    <div className={cn(siteShellClassName, className)}>
      <Header className="mt-4 md:mt-10" />
      <div className="flex grow flex-col gap-6 md:gap-10">
        {title ? (
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h1>
        ) : null}
        <div className={cn('min-h-0 w-full flex-1', flush ? '' : 'pb-6')}>{children}</div>
      </div>
      <Footer className="mt-10 md:mt-20" />
    </div>
  );
}
