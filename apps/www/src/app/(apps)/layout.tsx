import { RouteViewTransition } from '@/components/layout/route-view-transition';

export default function AppsLayout({ children }: { children: React.ReactNode }) {
  return <RouteViewTransition>{children}</RouteViewTransition>;
}
