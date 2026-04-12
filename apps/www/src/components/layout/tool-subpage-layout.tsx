import type { ReactNode } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import { cn } from '@/lib/utils';

interface ToolSubpageLayoutProps {
  title: string;
  children: ReactNode;
  /** Tailwind max-width classes for the content column (e.g. max-w-5xl). */
  contentMaxWidth?: string;
  /** Remove inner padding so children fill the entire space below the nav. */
  flush?: boolean;
  className?: string;
}

export function ToolSubpageLayout({
  title,
  children,
  contentMaxWidth = 'max-w-5xl',
  flush = false,
  className,
}: ToolSubpageLayoutProps) {
  return (
    <div className={cn('flex min-h-screen flex-col bg-neutral-950', className)}>
      <nav
        className="border-border flex min-h-14 items-center border-b px-4 py-3 lg:px-8"
        aria-label="Tool navigation"
      >
        <Link
          href="/"
          className="text-muted-foreground hover:text-foreground inline-flex min-h-11 items-center gap-2 text-sm transition-colors"
        >
          <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden />
          Back
        </Link>
        <h1 className="text-foreground mx-4 text-sm font-medium">{title}</h1>
      </nav>
      <div
        className={cn(
          'flex min-h-0 flex-1 flex-col',
          flush ? '' : 'px-4 py-6 lg:px-8',
        )}
      >
        <div className={cn('mx-auto flex min-h-0 w-full flex-1 flex-col', contentMaxWidth)}>
          {children}
        </div>
      </div>
    </div>
  );
}
