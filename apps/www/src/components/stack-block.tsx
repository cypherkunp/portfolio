'use client';

import React from 'react';
import { HoverEffect } from '@repo/ui/components/card-hover-effect';
import { useTranslations } from 'next-intl';

export default function StackBlock() {
  const t = useTranslations('Blocks.stackBlock');
  return <HoverEffect items={t.raw('list')} />;
}
