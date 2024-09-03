import React from 'react';
import { cn } from '@/lib/utils';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
}

export function Section({ children, className }: SectionProps) {
  return <section className={cn('flex flex-col gap-y-3 py-[80px]', className)}>{children}</section>;
}
