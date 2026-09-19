'use client';

import type React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';

import IconArrow from './icon-arrow';

export interface NavItem {
  href: string;
  label: string;
  external?: boolean;
}

export interface NavbarProps {
  items: NavItem[];
  logo?: React.ReactNode;
  className?: string;
}

function isExternalHref(href: string, external?: boolean) {
  return external === true || /^https?:\/\//i.test(href);
}

export function Navbar({ items, logo = 'Logo', className }: NavbarProps) {
  const pathname = usePathname();

  return (
    <nav className={cn('w-full', className)}>
      <div className="mx-auto px-0">
        <div className="flex h-14 items-center justify-between md:h-16">
          <div className="flex gap-4 sm:gap-6 md:items-center md:gap-8">
            {items.map(item => {
              const isExternal = isExternalHref(item.href, item.external);
              const isActive = !isExternal && pathname === item.href;
              const linkClassName = cn(
                `hover:text-foreground relative inline-flex min-h-11 min-w-[44px] items-center gap-1.5 py-2 text-sm font-medium transition-colors md:text-lg`,
                isActive ? 'text-foreground decoration-primary' : 'text-muted-foreground',
                'group',
              );

              if (isExternal) {
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={linkClassName}
                  >
                    {item.label}
                    <IconArrow />
                  </a>
                );
              }

              return (
                <Link key={item.href} href={item.href} className={linkClassName}>
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
