'use client';

import { useRouterState } from '@tanstack/react-router';

import { AppLink } from '../lib/app-link';
import { cn } from '../lib/utils';

type NavLinkProps = {
  href: string;
  text: string;
};

export default function NavLink({ href, text }: NavLinkProps) {
  const pathname = useRouterState({ select: state => state.location.pathname });

  const linkHref = href === 'home' ? '' : href;
  const to: string = `/${linkHref}`;
  return (
    <AppLink
      href={to}
      className={cn(
        'text-lg font-bold text-white underline decoration-3 underline-offset-4 hover:text-rose-500',
        {
          'active:bg-fluorescent-green': pathname === `/${linkHref}`,
        },
      )}
    >
      {text}
    </AppLink>
  );
}
