'use client';

import React from 'react';
import { useTranslations } from 'next-intl';

export default function StackBlock() {
  const t = useTranslations('Blocks.stackBlock');
  const items = t.raw('list') as {
    title: string;
    description: string;
    link: string | undefined;
  }[];

  return (
    <dl className="grid gap-x-10 gap-y-6 sm:grid-cols-2">
      {items.map(item => (
        <div key={item.title}>
          <dt className="text-sm text-neutral-600 dark:text-neutral-500">{item.title}</dt>
          <dd className="mt-1 text-base leading-relaxed text-neutral-900 dark:text-neutral-100">
            {item.description}
          </dd>
        </div>
      ))}
    </dl>
  );
}
