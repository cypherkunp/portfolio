import type { ComponentType, ReactNode } from 'react';

declare module 'react' {
  export interface ViewTransitionProps {
    children?: ReactNode;
    enter?: 'auto' | 'none' | string | Record<string, string>;
    exit?: 'auto' | 'none' | string | Record<string, string>;
    update?: 'auto' | 'none' | string | Record<string, string>;
    share?: 'auto' | 'none' | string | Record<string, string>;
    default?: 'auto' | 'none' | string | Record<string, string>;
    name?: string | Record<string, unknown>;
  }

  export const ViewTransition: ComponentType<ViewTransitionProps>;
}
