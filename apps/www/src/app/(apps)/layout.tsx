import { RouteViewTransition } from '@repo/ui/components/layout/route-view-transition';

export default function AppsLayout({ children }: { children: React.ReactNode }) {
  return <RouteViewTransition>{children}</RouteViewTransition>;
}
