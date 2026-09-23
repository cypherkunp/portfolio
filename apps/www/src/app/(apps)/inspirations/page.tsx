import type { Metadata } from 'next';

import { brandedTitle, socialMetadata } from '@/lib/seo';
import { AppEnabledGate } from '@/components/app-enabled-gate';
import { InspirationGrid } from '@/components/inspirations/inspiration-grid';
import PageContainer from '@/components/layout/page-container';
import { Section } from '@/components/layout/section';
import { ToolSubpageLayout } from '@/components/layout/tool-subpage-layout';

const title = 'Inspirations';
const description = 'A pinboard of quotes, ideas, and small truths I keep coming back to.';

export const metadata: Metadata = {
  title,
  description,
  ...socialMetadata({
    title: brandedTitle(title),
    description,
    url: '/inspirations',
  }),
};

export default function InspirationsPage() {
  return (
    <AppEnabledGate id="inspirations">
      <ToolSubpageLayout flush>
        <PageContainer>
          <Section
            isFirstSection
            isLastSection
            title="Inspirations"
            description="A pinboard of quotes, ideas, and small truths I keep coming back to."
          >
            <InspirationGrid />
          </Section>
        </PageContainer>
      </ToolSubpageLayout>
    </AppEnabledGate>
  );
}
