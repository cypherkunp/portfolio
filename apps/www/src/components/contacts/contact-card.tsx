import Link from 'next/link';
import { ArrowUpRight, type LucideIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

export interface ContactCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  href?: string;
  external?: boolean;
  className?: string;
}

export function ContactCard({
  icon: Icon,
  label,
  value,
  href,
  external = true,
  className,
}: ContactCardProps) {
  const content = (
    <>
      <span className="bg-secondary/10 text-secondary flex size-10 shrink-0 items-center justify-center rounded-md transition-colors group-hover:bg-secondary/20">
        <Icon className="size-4" />
      </span>
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="text-muted-foreground font-mono text-xs">{label}</span>
        <span className="text-foreground truncate text-sm font-medium">{value}</span>
      </div>
      {href ? (
        <ArrowUpRight
          className="text-muted-foreground ml-2 size-4 shrink-0 opacity-0 transition-all
            group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
        />
      ) : null}
    </>
  );

  const baseClass = cn(
    `border-border bg-card hover:border-secondary/60 group flex items-center gap-4 rounded-lg border p-4
    transition-colors`,
    className,
  );

  if (!href) {
    return <div className={baseClass}>{content}</div>;
  }

  return (
    <Link
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className={baseClass}
    >
      {content}
    </Link>
  );
}
