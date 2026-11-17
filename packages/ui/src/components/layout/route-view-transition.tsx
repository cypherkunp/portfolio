'use client';

import type { ReactNode } from 'react';
import { ViewTransition } from 'react';

interface RouteViewTransitionProps {
  children: ReactNode;
}

/**
 * Wraps route content so App Router navigations run through the View Transition API.
 * React 19.3 enables this with no Next.js config flag.
 */
export function RouteViewTransition({ children }: RouteViewTransitionProps) {
  return (
    <ViewTransition enter="route-vt" exit="route-vt" default="none">
      <div className="flex min-w-0 grow flex-col">{children}</div>
    </ViewTransition>
  );
}
