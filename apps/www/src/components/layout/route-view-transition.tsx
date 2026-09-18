'use client';

import type { ReactNode } from 'react';
import { ViewTransition } from 'react';

interface RouteViewTransitionProps {
  children: ReactNode;
}

/**
 * Wraps route content so App Router navigations run through the View Transition API
 * (requires `experimental.viewTransition` in next.config).
 */
export function RouteViewTransition({ children }: RouteViewTransitionProps) {
  return (
    <ViewTransition enter="www-route-vt" exit="www-route-vt" default="none">
      <div className="min-w-0 grow">{children}</div>
    </ViewTransition>
  );
}
