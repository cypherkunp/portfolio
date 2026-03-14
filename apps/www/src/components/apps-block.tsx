'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { cn } from '@/lib/utils';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

const APP_IDS = ['musicPlayer', 'inspirations', 'bookmarks', 'photos'] as const;
const APP_LETTERS: Record<(typeof APP_IDS)[number], string> = {
  musicPlayer: 'MP',
  inspirations: 'IN',
  bookmarks: 'BM',
  photos: 'PH',
};
const APP_HREFS: Record<(typeof APP_IDS)[number], string> = {
  musicPlayer: '/music',
  inspirations: '/inspirations',
  bookmarks: '/bookmarks',
  photos: '/photos',
};

export default function AppsBlock() {
  const t = useTranslations('Blocks.apps');

  return (
    <div className="hidden md:block">
      <TooltipProvider delayDuration={300}>
        <div className="border-border bg-card rounded-xl border p-4">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {APP_IDS.map(id => (
              <Tooltip key={id}>
                <TooltipTrigger asChild>
                  <Link
                    href={APP_HREFS[id]}
                    className="flex flex-col items-center gap-2 transition-colors"
                  >
                    <span
                      className={cn(
                        'bg-muted text-foreground hover:bg-primary hover:text-primary-foreground flex size-14 items-center justify-center rounded-lg text-lg font-bold tracking-tight transition-colors',
                      )}
                    >
                      {APP_LETTERS[id]}
                    </span>
                    <span className="text-muted-foreground line-clamp-2 text-center text-sm tracking-tight">
                      {t(`${id}.name`)}
                    </span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-[200px]">
                  {t(`${id}.description`)}
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </div>
      </TooltipProvider>
    </div>
  );
}
