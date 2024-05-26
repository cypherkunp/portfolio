'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@ui/lib/utils';

type NavLinkProps = {
  href: string;
  text: string;
};

export function NavLink({ href, text }: NavLinkProps) {
  const pathname = usePathname();

  const linkHref = href === 'home' ? '' : href;
  return (
    <Link
      href={`/${linkHref}`}
      className={cn(
        'text-silver decoration-3 text-2xl underline underline-offset-[12px] hover:text-red-500',
        {
          'active:bg-fluorescent-green': pathname === `/${linkHref}`,
        },
      )}
    >
      {text}
    </Link>
  );
}
