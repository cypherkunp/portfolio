'use client';

import * as React from 'react';
import Link from 'next/link';

import { cn } from '@/lib/utils';
import { Icons } from '@/components/icons';
import NavConnect from '@/components/nav-connect';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { RenderIf } from './render-if';
import { useTranslations } from 'next-intl';

const components: { title: string; href: string; description: string }[] = [
  {
    title: 'Bookmarks',
    href: '/about/bookmarks',
    description: 'Random stuff I find useful',
  },
  {
    title: 'Gallery',
    href: '/about/gallery',
    description: 'Few of my clicks',
  },
  {
    title: 'Setup',
    href: '/about/setup',
    description: 'My desk setup',
  },
];

export function Navbar() {
  const t = useTranslations('Header.navbar');

  return (
    <nav className="flex w-full justify-between">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link href="/" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                {t('home')}
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <RenderIf condition={false}>
            <NavigationMenuItem>
              <NavigationMenuTrigger>About</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                  {components.map(component => (
                    <ListItem key={component.title} title={component.title} href={component.href}>
                      {component.description}
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </RenderIf>
          <NavigationMenuItem>
            <Link href="/handbook" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                {t('handbook')}
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/resume" legacyBehavior passHref>
              <NavigationMenuLink className={`${navigationMenuTriggerStyle()}`}>
                {t('resume')}
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </nav>
  );
}

const ListItem = React.forwardRef<React.ElementRef<'a'>, React.ComponentPropsWithoutRef<'a'>>(
  ({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={cn(
              `hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground block
              select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors`,
              className,
            )}
            {...props}
          >
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">{children}</p>
          </a>
        </NavigationMenuLink>
      </li>
    );
  },
);

ListItem.displayName = 'ListItem';
