import type { Metadata } from 'next';

import { PackageAnalyzer } from '@/components/analyzer/package-analyzer';
import { AppEnabledGate, appPageMetadata } from '@/components/app-enabled-gate';
import { ToolSubpageLayout } from '@/components/layout/tool-subpage-layout';

const pageMetadata = {
  title: 'Package Analyzer',
  description:
    'Analyze your package.json dependencies — find outdated packages, check versions, and inspect your project health.',
} satisfies Metadata;

export function generateMetadata(): Promise<Metadata> {
  return appPageMetadata('packageAnalyzer', pageMetadata);
}

export default function AnalyzerPage() {
  return (
    <AppEnabledGate id="packageAnalyzer">
      <ToolSubpageLayout title="Package Analyzer">
        <PackageAnalyzer />
      </ToolSubpageLayout>
    </AppEnabledGate>
  );
}
