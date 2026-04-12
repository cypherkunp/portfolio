import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

const APP_IDS = ['musicPlayer', 'inspirations', 'bookmarks', 'photos', 'packageAnalyzer'] as const;
const APP_ABBR: Record<(typeof APP_IDS)[number], string> = {
  musicPlayer: 'MP',
  inspirations: 'IN',
  bookmarks: 'BM',
  photos: 'PH',
  packageAnalyzer: 'PA',
};
const APP_HREFS: Record<(typeof APP_IDS)[number], string> = {
  musicPlayer: '/music',
  inspirations: '/inspirations',
  bookmarks: '/bookmarks',
  photos: '/photos',
  packageAnalyzer: '/analyzer',
};

export default function AppsBlock() {
  const t = useTranslations('Blocks.apps');

  return (
    <div>
      {APP_IDS.map(id => (
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
