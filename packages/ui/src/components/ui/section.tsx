import { cn } from '@ui/lib/utils';
import React from 'react';

export interface SectionProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Section({ className, ...props }: SectionProps) {
  return <section className={cn('flex min-h-0 flex-col space-y-4 ', className)} {...props} />;
}
