import { useTranslations } from 'next-intl';

import { cn } from '@/lib/utils';

import { Navbar } from '../navbar';

export default function Header({ className }: { className?: string }) {
  const t = useTranslations();
  const navItems = t.raw('Header.navbar');

  return (
    <header
      className={cn(
        `border-layout flex w-full flex-col items-start justify-between bg-neutral-950 p-0 md:flex-row
        md:pb-6 print:hidden`,
        className,
      )}
    >
      <Navbar items={navItems} />
    </header>
  );
}
