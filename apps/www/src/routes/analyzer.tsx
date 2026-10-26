import { Suspense } from 'react';
import { RouteViewTransition } from '@repo/ui/components/layout/route-view-transition';
import { createFileRoute } from '@tanstack/react-router';

import { analyzerPageHead } from '@/lib/apps-page';
import { PackageAnalyzer } from '@/components/analyzer/package-analyzer';
import { ToolSubpageLayout } from '@/components/layout/tool-subpage-layout';

import { requireEnabledApp } from './-require-app';

export const Route = createFileRoute('/analyzer')({
  loader: () => requireEnabledApp('packageAnalyzer'),
  head: () => analyzerPageHead(),
  component: AnalyzerPage,
});

function AnalyzerPage() {
  return (
    <RouteViewTransition>
      <ToolSubpageLayout title="Package Analyzer">
        <Suspense fallback={null}>
          <PackageAnalyzer />
        </Suspense>
      </ToolSubpageLayout>
    </RouteViewTransition>
  );
}
