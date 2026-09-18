'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';

type NavLinkProps = {
  href: string;
  text: string;
};

export default function NavLink({ href, text }: NavLinkProps) {
  const pathname = usePathname();

  const linkHref = href === 'home' ? '' : href;
  return (
    <Link
      href={`/${linkHref}`}
      className={cn(
        'text-lg font-bold text-white underline decoration-3 underline-offset-4 hover:text-rose-500',
        {
          'active:bg-fluorescent-green': pathname === `/${linkHref}`,
        },
      )}
    >
      {text}
    </Link>
  );
}
