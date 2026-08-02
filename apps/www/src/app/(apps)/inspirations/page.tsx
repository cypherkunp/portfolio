import type { Metadata } from 'next';

import { AppEnabledGate, appPageMetadata } from '@/components/app-enabled-gate';
import { InspirationGrid } from '@/components/inspirations/inspiration-grid';
import { ToolSubpageLayout } from '@/components/layout/tool-subpage-layout';

const pageMetadata = {
  title: 'Inspirations',
  description: 'A pinboard of quotes, ideas, and small truths I keep coming back to.',
} satisfies Metadata;

export function generateMetadata(): Promise<Metadata> {
  return appPageMetadata('inspirations', pageMetadata);
}

export default function InspirationsPage() {
  return (
    <AppEnabledGate id="inspirations">
      <ToolSubpageLayout flush>
        <div className="pb-16">
          <header className="flex flex-col gap-5 px-1 py-6 sm:gap-6 sm:py-10">
            <h1 className="text-2xl font-light tracking-tight text-neutral-100 sm:text-4xl">
              Things I keep <span className="text-yellow-400 italic">coming back to.</span>
            </h1>
            <p className="max-w-2xl text-sm leading-relaxed text-neutral-400 sm:text-base">
              Quotes, half-thoughts, and small truths that shape how I build, lead, and think. Less
              curation, more compounding. The pinned ones changed how I work.
            </p>
          </header>

          <div className="mt-2 border-t border-neutral-900 pt-6 sm:pt-10">
            <InspirationGrid />
          </div>
        </div>
      </ToolSubpageLayout>
    </AppEnabledGate>
  );
}
