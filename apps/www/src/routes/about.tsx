import { createFileRoute } from '@tanstack/react-router';

import { aboutPageHead } from '@/lib/about-page';
import { AboutPage } from '@/components/about-page';

import { SiteShell } from './-site-shell';

export const Route = createFileRoute('/about')({
  head: () => aboutPageHead(),
  component: AboutRoute,
});

function AboutRoute() {
  return (
    <SiteShell>
      <AboutPage />
    </SiteShell>
  );
}
