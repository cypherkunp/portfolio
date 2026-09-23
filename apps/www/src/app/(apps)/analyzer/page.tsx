import type { Metadata } from 'next';

import { brandedTitle, socialMetadata } from '@/lib/seo';
import { PackageAnalyzer } from '@/components/analyzer/package-analyzer';
import { AppEnabledGate } from '@/components/app-enabled-gate';
import { ToolSubpageLayout } from '@/components/layout/tool-subpage-layout';

const title = 'Package Analyzer';
const description =
  'Analyze your package.json dependencies — find outdated packages, check versions, and inspect your project health.';

export const metadata: Metadata = {
  title,
  description,
  ...socialMetadata({
    title: brandedTitle(title),
    description,
    url: '/analyzer',
  }),
};

export default function AnalyzerPage() {
  return (
    <AppEnabledGate id="packageAnalyzer">
      <ToolSubpageLayout title="Package Analyzer">
        <PackageAnalyzer />
      </ToolSubpageLayout>
    </AppEnabledGate>
  );
}
