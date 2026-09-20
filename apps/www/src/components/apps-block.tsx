import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { getApp, type AppId } from '@/lib/app-catalog';

interface AppsBlockProps {
  enabledApps: AppId[];
}

export default async function AppsBlock({ enabledApps }: AppsBlockProps) {
  const t = await getTranslations('Blocks.apps');

  if (enabledApps.length === 0) return null;

  return (
    <div>
      {enabledApps.map(id => {
        const app = getApp(id);

        return (
          <Link key={id} href={app.path} className="group mb-4 flex items-center gap-2">
            <span className="w-8 shrink-0 text-sm text-neutral-600 dark:text-neutral-400">
              {app.abbreviation}
            </span>
            <span className="group-hover:decoration-tertiary tracking-tight text-neutral-900 group-hover:underline group-hover:underline-offset-8 dark:text-neutral-100">
              {t(`${id}.name`)}
            </span>
            <span className="hidden text-sm text-neutral-600 sm:inline dark:text-neutral-500">
              {t(`${id}.description`)}
            </span>
            <ArrowUpRight className="ml-auto size-4 shrink-0 text-neutral-600 opacity-0 transition-opacity group-hover:opacity-100 dark:text-neutral-400" />
          </Link>
        );
      })}
    </div>
  );
}
