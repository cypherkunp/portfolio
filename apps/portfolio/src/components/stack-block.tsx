'use client';

import React from 'react';
import { useTranslations } from 'next-intl';

import { HoverEffect } from './ui/card-hover-effect';

export default function StackBlock() {
  const t = useTranslations('HomePage.stackBlock');
  return <HoverEffect items={t.raw('list')} />;
}
