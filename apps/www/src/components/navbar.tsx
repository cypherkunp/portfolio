'use client';

import type React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';

export interface NavItem {
  href: string;
  label: string;
}

export interface NavbarProps {
  items: NavItem[];
  logo?: React.ReactNode;
  className?: string;
}

export function Navbar({ items, logo = 'Logo', className }: NavbarProps) {
  const pathname = usePathname();

  return (
    <nav className={cn('w-full', className)}>
      <div className="mx-auto px-0">
        <div className="flex h-14 items-center justify-between md:h-16">
          <div className="flex gap-4 sm:gap-6 md:items-center md:gap-8">
            {items.map(item => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    `hover:text-foreground relative inline-flex min-h-11 min-w-[44px] items-center py-2 text-sm
                    font-medium transition-colors md:text-lg`,
                    isActive ? 'text-foreground decoration-primary' : 'text-muted-foreground',
                    'group',
                  )}
                >
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
