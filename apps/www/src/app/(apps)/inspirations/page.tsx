import type { Metadata } from 'next';

import { InspirationGrid } from '@/components/inspirations/inspiration-grid';
import { ToolSubpageLayout } from '@/components/layout/tool-subpage-layout';

export const metadata: Metadata = {
  title: 'Inspirations',
  description: 'A pinboard of quotes, ideas, and small truths I keep coming back to.',
};

export default function InspirationsPage() {
  return (
    <ToolSubpageLayout flush>
      <div className="pb-16">
        <header className="flex flex-col gap-5 px-1 py-6 sm:gap-6 sm:py-10">
          <h1 className="text-2xl font-light tracking-tight text-neutral-100 sm:text-4xl">
            Things I keep <span className="italic text-yellow-400">coming back to.</span>
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
  );
}
