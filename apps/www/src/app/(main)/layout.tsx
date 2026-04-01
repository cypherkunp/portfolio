import { Footer } from '@/components/layout/footer';
import Header from '@/components/layout/header';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container mx-auto flex min-h-screen max-w-2xl flex-col px-6 lg:px-0">
      <Header className="mt-4 md:mt-10" />
      <div className="flex grow flex-col gap-72">{children}</div>
      <Footer className="mt-10 md:mt-20" />
    </div>
  );
}
