import type { AnchorHTMLAttributes, ReactNode } from 'react';
import { Link } from '@tanstack/react-router';

interface AppLinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  href: string;
  children?: ReactNode;
}

function isAppPath(href: string) {
  return href.startsWith('/') && !href.startsWith('//');
}

export function AppLink({ href, children, ...props }: AppLinkProps) {
  if (!isAppPath(href)) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  }

  return (
    <Link to={href} {...props}>
      {children}
    </Link>
  );
}
