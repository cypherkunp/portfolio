import type { Metadata } from 'next';

import { PackageAnalyzer } from '@/components/analyzer/package-analyzer';
import { ToolSubpageLayout } from '@/components/layout/tool-subpage-layout';

export const metadata: Metadata = {
  title: 'Package Analyzer',
  description:
    'Analyze your package.json dependencies — find outdated packages, check versions, and inspect your project health.',
};

export default function AnalyzerPage() {
  return (
    <ToolSubpageLayout title="Package Analyzer">
      <PackageAnalyzer />
    </ToolSubpageLayout>
  );
}
