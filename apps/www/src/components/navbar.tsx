'use client';

import type React from 'react';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

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
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className={cn('w-full', className)}>
      <div className="mx-auto px-0">
        <div className="flex h-16 items-center justify-between">
          <div className="hidden md:flex md:items-center md:gap-8">
            {items.map(item => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'hover:text-foreground relative inline-flex flex-col py-2 text-sm font-medium transition-colors',
                    isActive ? 'text-foreground' : 'text-muted-foreground',
                    'group',
                  )}
                >
                  {item.label}
                  {/* Animated underline */}
                  <span
                    className={cn(
                      'bg-primary absolute bottom-0 h-0.5 transition-all duration-300',
                      isActive ? 'w-full' : 'w-0 group-hover:w-full',
                    )}
                  />
                </Link>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Navbar */}
        {isOpen && (
          <div className="border-border border-t md:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {items.map(item => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex rounded-md px-3 py-2 text-base font-medium transition-colors',
                      isActive
                        ? 'bg-accent text-accent-foreground'
                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="relative inline-flex flex-col">
                      {item.label}
                      {/* Active indicator for mobile - underline only spans text width */}
                      {isActive && <span className="bg-primary h-0.5" />}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
