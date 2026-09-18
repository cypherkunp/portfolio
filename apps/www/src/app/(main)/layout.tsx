import { Colophon } from '@/components/layout/colophon';
import { Footer } from '@/components/layout/footer';
import Header from '@/components/layout/header';
import { RouteViewTransition } from '@/components/layout/route-view-transition';
import { siteShellClassName } from '@/components/layout/site-shell';

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
