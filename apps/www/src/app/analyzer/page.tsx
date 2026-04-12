import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import { PackageAnalyzer } from '@/components/analyzer/package-analyzer';

export const metadata: Metadata = {
  title: 'Package Analyzer',
  description: 'Analyze your package.json dependencies — find outdated packages, check versions, and inspect your project health.',
};

export default function AnalyzerPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <nav className="border-border flex items-center border-b px-4 py-3 lg:px-8">
        <Link
          href="/"
          className="text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
        <span className="mx-4 text-sm font-medium">Package Analyzer</span>
      </nav>
      <div className="flex-1 px-4 py-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <PackageAnalyzer />
        </div>
      </div>
    </div>
  );
}
