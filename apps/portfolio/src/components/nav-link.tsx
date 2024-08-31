'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@ui/lib/utils';

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
        'decoration-3 text-lg font-bold text-white underline underline-offset-4 hover:text-rose-500',
        {
          'active:bg-fluorescent-green': pathname === `/${linkHref}`,
        },
      )}
    >
      {text}
    </Link>
  );
}
