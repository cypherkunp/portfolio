'use client';

import { AnimatePresence, motion } from 'motion/react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

import { usePackageAnalyzer } from '@/hooks/use-package-analyzer';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

import { DependencyTable } from './dependency-table';
import { MetadataDisplay } from './metadata-display';
import { StatsCards } from './stats-cards';
import { UploadZone } from './upload-zone';

const ERROR_MESSAGES: Record<string, { title: string; description: string }> = {
  parse: {
    title: 'Invalid file',
    description: 'The uploaded file is not a valid JSON file. Please check the file format and try again.',
  },
  empty: {
    title: 'No dependencies found',
    description: 'No dependencies or devDependencies found in the package.json file. Please upload a file with at least one dependency.',
  },
  api: {
    title: 'Fetch failed',
    description: 'Failed to fetch package information from npm registry. Please try again.',
  },
  'rate-limit': {
    title: 'Rate limit exceeded',
    description: 'API rate limit exceeded. Please wait a few minutes before trying again.',
  },
};

export function PackageAnalyzer() {
  const analyzer = usePackageAnalyzer();

  const isLoading = analyzer.phase === 'loading';
  const isDone = analyzer.phase === 'done';
  const hasResults = isDone || (isLoading && analyzer.fetchedCount > 0);
  const progressPercent = analyzer.totalPackages > 0
    ? Math.round((analyzer.fetchedCount / analyzer.totalPackages) * 100)
    : 0;

  return (
    <div className="flex flex-col gap-6" style={{ scrollbarGutter: 'stable' }}>
      <UploadZone
        onFileUpload={analyzer.handleFileUpload}
        fileName={analyzer.fileName}
        isAnalyzing={isLoading}
        onReset={analyzer.reset}
      />

      <AnimatePresence mode="wait">
        {analyzer.phase === 'error' && analyzer.error && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Alert variant="destructive">
              <AlertTriangle className="size-4" />
              <AlertTitle>{ERROR_MESSAGES[analyzer.error]?.title || 'Error'}</AlertTitle>
              <AlertDescription className="flex flex-col gap-3">
                <span>
                  {ERROR_MESSAGES[analyzer.error]?.description || 'An unexpected error occurred.'}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={analyzer.retry}
                  className="w-fit gap-2"
                >
                  <RefreshCw className="size-3.5" />
                  Try again
                </Button>
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {isLoading && !hasResults && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col gap-3 rounded-lg border border-border bg-card p-6"
        >
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Analyzing packages...</span>
            <span className="font-mono text-xs text-muted-foreground">
              {analyzer.fetchedCount} / {analyzer.totalPackages}
            </span>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </motion.div>
      )}

      <AnimatePresence>
        {hasResults && analyzer.metadata && (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col gap-6"
          >
            <MetadataDisplay metadata={analyzer.metadata} />

            {isDone && (
              <StatsCards
                totalPackages={analyzer.totalPackages}
                outdatedCount={analyzer.outdatedCount}
                upToDateCount={analyzer.upToDateCount}
                averageAge={analyzer.averageAge}
              />
            )}

            {isLoading && (
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="size-2 animate-pulse rounded-full bg-yellow-400" />
                    <span className="text-muted-foreground">Fetching package data...</span>
                  </div>
                  <span className="font-mono text-xs text-muted-foreground">
                    {progressPercent}%
                  </span>
                </div>
                <Progress value={progressPercent} className="h-1.5" />
              </div>
            )}

            <DependencyTable
              dependencies={analyzer.dependencies}
              devDependencies={analyzer.devDependencies}
              filteredDeps={analyzer.filteredDeps}
              filteredDevDeps={analyzer.filteredDevDeps}
              totalDeps={analyzer.totalDeps}
              totalDevDeps={analyzer.totalDevDeps}
              isLoading={isLoading && analyzer.fetchedCount === 0}
              fetchedCount={analyzer.fetchedCount}
              totalPackages={analyzer.totalPackages}
              searchQuery={analyzer.searchQuery}
              sortColumn={analyzer.sortColumn}
              sortDirection={analyzer.sortDirection}
              expandedRows={analyzer.expandedRows}
              onSearchChange={analyzer.setSearchQuery}
              onSort={analyzer.toggleSort}
              onToggleRow={analyzer.toggleRow}
              onExpandAll={analyzer.expandAll}
              onCollapseAll={analyzer.collapseAll}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {analyzer.phase === 'idle' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="py-16 text-center"
        >
          <p className="text-muted-foreground">
            Upload a package.json file to see detailed information about your project dependencies
          </p>
        </motion.div>
      )}
    </div>
  );
}
