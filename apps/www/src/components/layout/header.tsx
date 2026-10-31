import { cn } from '@repo/ui/lib/utils';
import { useTranslations } from 'next-intl';

import { Navbar, type NavItem } from '../navbar';

export default function Header({ className }: { className?: string }) {
  const t = useTranslations();
  const navItems = t.raw('Header.navbar') as NavItem[];

  return (
    <header
      className={cn(
        `border-layout flex w-full flex-col items-start justify-between p-0 md:flex-row md:pb-6 print:hidden`,
        className,
      )}
    >
      <Navbar items={navItems} />
    </header>
  );
}
