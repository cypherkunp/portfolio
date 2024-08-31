'use client';
import { FloatingDock } from '@repo/ui/components/ui/floating-dock';
import {
  IconBrandGithub,
  IconBrandX,
  IconExchange,
  IconHome,
  IconNewSection,
  IconTerminal2,
} from '@tabler/icons-react';

export default function Footer() {
  const links = [
    {
      title: 'Home',
      icon: <IconHome className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
      href: '#',
    },

    {
      title: 'Products',
      icon: <IconTerminal2 className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
      href: '#',
    },
    {
      title: 'Components',
      icon: <IconNewSection className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
      href: '#',
    },
    {
      title: 'Changelog',
      icon: <IconExchange className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
      href: '#',
    },

    {
      title: 'Twitter',
      icon: <IconBrandX className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
      href: '#',
    },
    {
      title: 'GitHub',
      icon: <IconBrandGithub className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
      href: '#',
    },
  ];
  return (
    <footer className="pt-100 md:mt-140 flex h-[35rem] w-full items-center justify-center print:hidden">
      <FloatingDock
        mobileClassName="translate-y-20" // only for demo, remove for production
        items={links}
      />
    </footer>
  );
}
