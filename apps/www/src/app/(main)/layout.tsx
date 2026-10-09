import { RouteViewTransition } from '@repo/ui/components/layout/route-view-transition';
import { siteShellClassName } from '@repo/ui/lib/site-shell';

import { Colophon } from '@/components/layout/colophon';
import { Footer } from '@/components/layout/footer';
import Header from '@/components/layout/header';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={siteShellClassName}>
      <Header className="mt-4 md:mt-10" />
      <div className="flex grow flex-col gap-28 sm:gap-40 md:gap-56 lg:gap-72">
        <RouteViewTransition>{children}</RouteViewTransition>
      </div>
      <Footer className="mt-10 md:mt-20" />
      <Colophon />
    </div>
  );
}
