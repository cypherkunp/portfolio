import Link from 'next/link';
import type { AppFlagId } from '@/flags';
import { ArrowUpRight } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

const APP_ABBR: Record<AppFlagId, string> = {
  musicPlayer: 'MP',
  inspirations: 'IN',
  bookmarks: 'BM',
  photos: 'PH',
  packageAnalyzer: 'PA',
};

const APP_HREFS: Record<AppFlagId, string> = {
  musicPlayer: '/music',
  inspirations: '/inspirations',
  bookmarks: '/bookmarks',
  photos: '/photos',
  packageAnalyzer: '/analyzer',
};

interface AppsBlockProps {
  enabledApps: AppFlagId[];
}

export default async function AppsBlock({ enabledApps }: AppsBlockProps) {
  const t = await getTranslations('Blocks.apps');

  if (enabledApps.length === 0) return null;

  return (
    <div>
      {enabledApps.map(id => (
        <Link key={id} href={APP_HREFS[id]} className="group mb-4 flex items-center gap-2">
          <span className="w-8 shrink-0 text-sm text-neutral-600 dark:text-neutral-400">
            {APP_ABBR[id]}
          </span>
          <span className="group-hover:decoration-tertiary tracking-tight text-neutral-900 group-hover:underline group-hover:underline-offset-8 dark:text-neutral-100">
            {t(`${id}.name`)}
          </span>
          <span className="hidden text-sm text-neutral-600 sm:inline dark:text-neutral-500">
            {t(`${id}.description`)}
          </span>
          <ArrowUpRight className="ml-auto size-4 shrink-0 text-neutral-600 opacity-0 transition-opacity group-hover:opacity-100 dark:text-neutral-400" />
        </Link>
      ))}
    </div>
  );
}
