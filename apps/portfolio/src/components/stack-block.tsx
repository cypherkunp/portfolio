'use client';

import React from 'react';
import { HoverEffect } from './ui/card-hover-effect';
import { useTranslations } from 'next-intl';

export default function StackBlock() {
  const t = useTranslations('HomePage.stackBlock');
  return <HoverEffect items={t.raw('list')} />;
}
