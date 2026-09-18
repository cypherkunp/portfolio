'use client';

import { Fragment, type MouseEvent, type ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

export interface BreadcrumbEntry {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbEntry[];
}

function isModifiedClick(event: MouseEvent) {
  return event.button !== 0 || event.metaKey || event.altKey || event.ctrlKey || event.shiftKey;
}

interface NavigationLike {
  currentEntry?: { index: number };
  entries?: () => Array<{ url?: string }>;
}

function previousEntryUrl() {
  const nav = 'navigation' in window ? (window as Window & { navigation?: NavigationLike }).navigation : undefined;
  if (nav?.currentEntry && typeof nav.entries === 'function') {
    const prev = nav.entries()[nav.currentEntry.index - 1];
    if (prev?.url) return prev.url;
  }
  return document.referrer || null;
}

function canPopTo(href: string) {
  const previous = previousEntryUrl();
  if (!previous) return false;
  try {
    const prevUrl = new URL(previous, window.location.origin);
    const target = new URL(href, window.location.origin);
    return prevUrl.origin === window.location.origin && prevUrl.pathname === target.pathname;
  } catch {
    return false;
  }
}

function BreadcrumbBackLink({ href, children }: { href: string; children: ReactNode }) {
  const router = useRouter();

  function onClick(event: MouseEvent<HTMLAnchorElement>) {
    if (isModifiedClick(event)) return;
    if (!canPopTo(href)) return;
    event.preventDefault();
    router.back();
  }

  return (
    <BreadcrumbLink asChild>
      <Link href={href} onClick={onClick}>
        {children}
      </Link>
    </BreadcrumbLink>
  );
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {items.map((item, index) => (
          <Fragment key={`${item.label}-${index}`}>
            {index > 0 ? <BreadcrumbSeparator /> : null}
            <BreadcrumbItem>
              {item.href ? (
                <BreadcrumbBackLink href={item.href}>{item.label}</BreadcrumbBackLink>
              ) : (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
