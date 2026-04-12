'use client';

import { AnimatePresence, motion } from 'motion/react';
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  ChevronsDownUp,
  ChevronsUpDown,
  ExternalLink,
  Search,
} from 'lucide-react';

import type { PackageEntry, SortColumn, SortDirection } from '@/hooks/use-package-analyzer';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface DependencyTableProps {
  dependencies: PackageEntry[];
  devDependencies: PackageEntry[];
  filteredDeps: PackageEntry[];
  filteredDevDeps: PackageEntry[];
  totalDeps: number;
  totalDevDeps: number;
  isLoading: boolean;
  fetchedCount: number;
  totalPackages: number;
  searchQuery: string;
  sortColumn: SortColumn;
  sortDirection: SortDirection;
  expandedRows: Set<string>;
  onSearchChange: (query: string) => void;
  onSort: (column: SortColumn) => void;
  onToggleRow: (name: string) => void;
  onExpandAll: (packages: PackageEntry[]) => void;
  onCollapseAll: () => void;
}

function SortIcon({ column, activeColumn, direction }: {
  column: SortColumn;
  activeColumn: SortColumn;
  direction: SortDirection;
}) {
  if (column !== activeColumn || !direction) {
    return <ArrowUpDown className="size-3 opacity-40" />;
  }
  return direction === 'asc'
    ? <ArrowUp className="size-3 text-yellow-400" />
    : <ArrowDown className="size-3 text-yellow-400" />;
}

function SortableHeader({ label, column, activeColumn, direction, onSort, className }: {
  label: string;
  column: SortColumn;
  activeColumn: SortColumn;
  direction: SortDirection;
  onSort: (column: SortColumn) => void;
  className?: string;
}) {
  return (
    <TableHead className={className}>
      <button
        onClick={() => onSort(column)}
        className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors"
      >
        {label}
        <SortIcon column={column} activeColumn={activeColumn} direction={direction} />
      </button>
    </TableHead>
  );
}

function formatDate(dateStr: string): string {
  if (!dateStr) return '—';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function formatRelativeDate(dateStr: string): string {
  if (!dateStr) return '';
  const days = Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24));
  if (days < 1) return 'today';
  if (days === 1) return '1 day ago';
  if (days < 30) return `${days} days ago`;
  if (days < 365) return `${Math.floor(days / 30)} months ago`;
  return `${Math.floor(days / 365)} years ago`;
}

function PackageRow({
  pkg,
  isExpanded,
  onToggle,
}: {
  pkg: PackageEntry;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  return (
    <>
      <TableRow
        className={cn(
          'cursor-pointer transition-colors',
          isExpanded && 'bg-muted/30',
        )}
        onClick={onToggle}
      >
        <TableCell className="w-10 pr-0">
          <Button variant="ghost" size="icon" className="size-7">
            {isExpanded
              ? <ChevronDown className="size-4" />
              : <ChevronRight className="size-4" />
            }
          </Button>
        </TableCell>
        <TableCell>
          <div className="flex flex-col gap-0.5">
            <span className="font-mono text-sm font-medium">{pkg.name}</span>
            <span className="text-xs text-muted-foreground md:hidden">
              {pkg.configuredVersion} → {pkg.latestVersion}
            </span>
          </div>
        </TableCell>
        <TableCell className="hidden font-mono text-sm md:table-cell">
          {pkg.configuredVersion}
        </TableCell>
        <TableCell className="hidden md:table-cell">
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm">{pkg.latestVersion}</span>
            {pkg.isOutdated ? (
              <AlertTriangle className="size-3.5 text-yellow-400" />
            ) : (
              <CheckCircle className="size-3.5 text-emerald-400" />
            )}
          </div>
        </TableCell>
        <TableCell className="hidden text-center lg:table-cell">
          {pkg.openIssues > 0 ? (
            <Badge variant="outline" className="text-xs">{pkg.openIssues}</Badge>
          ) : (
            <span className="text-xs text-muted-foreground">—</span>
          )}
        </TableCell>
        <TableCell className="hidden xl:table-cell">
          <span className="text-xs text-muted-foreground">
            {formatRelativeDate(pkg.lastPublished)}
          </span>
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-1">
            <a
              href={`https://www.npmjs.com/package/${pkg.name}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              title="View on npm"
            >
              <ExternalLink className="size-3.5" />
            </a>
            {pkg.githubUrl && (
              <a
                href={pkg.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
                className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                title="View on GitHub"
              >
                <svg className="size-3.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
              </a>
            )}
          </div>
        </TableCell>
      </TableRow>

      <AnimatePresence>
        {isExpanded && (
          <tr>
            <td colSpan={7}>
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="border-b border-border bg-muted/20 px-6 py-4">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {pkg.description && (
                      <div className="md:col-span-2 lg:col-span-4">
                        <span className="text-[11px] uppercase tracking-wider text-muted-foreground">
                          Description
                        </span>
                        <p className="mt-1 text-sm text-foreground">{pkg.description}</p>
                      </div>
                    )}
                    <div>
                      <span className="text-[11px] uppercase tracking-wider text-muted-foreground">
                        Current version
                      </span>
                      <p className="mt-1 font-mono text-sm">{pkg.configuredVersion}</p>
                    </div>
                    <div>
                      <span className="text-[11px] uppercase tracking-wider text-muted-foreground">
                        Latest version
                      </span>
                      <p className="mt-1 font-mono text-sm">{pkg.latestVersion}</p>
                    </div>
                    <div>
                      <span className="text-[11px] uppercase tracking-wider text-muted-foreground">
                        Issues
                      </span>
                      <p className="mt-1 text-sm">{pkg.openIssues}</p>
                    </div>
                    <div>
                      <span className="text-[11px] uppercase tracking-wider text-muted-foreground">
                        Last published
                      </span>
                      <p className="mt-1 text-sm">{formatDate(pkg.lastPublished)}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </td>
          </tr>
        )}
      </AnimatePresence>
    </>
  );
}

function LoadingSkeleton() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <TableRow key={i}>
          <TableCell className="w-10 pr-0"><Skeleton className="size-7" /></TableCell>
          <TableCell><Skeleton className="h-4 w-32" /></TableCell>
          <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-16" /></TableCell>
          <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-20" /></TableCell>
          <TableCell className="hidden lg:table-cell"><Skeleton className="mx-auto h-4 w-8" /></TableCell>
          <TableCell className="hidden xl:table-cell"><Skeleton className="h-4 w-24" /></TableCell>
          <TableCell><Skeleton className="h-4 w-12" /></TableCell>
        </TableRow>
      ))}
    </>
  );
}

function PackageTable({
  packages,
  total,
  isLoading,
  searchQuery,
  sortColumn,
  sortDirection,
  expandedRows,
  onSort,
  onToggleRow,
  onExpandAll,
  onCollapseAll,
}: {
  packages: PackageEntry[];
  total: number;
  isLoading: boolean;
  searchQuery: string;
  sortColumn: SortColumn;
  sortDirection: SortDirection;
  expandedRows: Set<string>;
  onSort: (column: SortColumn) => void;
  onToggleRow: (name: string) => void;
  onExpandAll: (packages: PackageEntry[]) => void;
  onCollapseAll: () => void;
}) {
  const allExpanded = packages.length > 0 && packages.every(p => expandedRows.has(p.name));
  const allCollapsed = packages.every(p => !expandedRows.has(p.name));
  const showingFiltered = searchQuery && packages.length !== total;

  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onExpandAll(packages)}
          disabled={allExpanded || packages.length === 0}
          className="gap-1.5 text-xs"
        >
          <ChevronsUpDown className="size-3" />
          Expand all
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onCollapseAll}
          disabled={allCollapsed}
          className="gap-1.5 text-xs"
        >
          <ChevronsDownUp className="size-3" />
          Collapse all
        </Button>
        {showingFiltered && (
          <span className="ml-auto text-xs text-muted-foreground">
            {packages.length} of {total} packages
          </span>
        )}
      </div>

      <div className="overflow-hidden rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-10" />
              <SortableHeader
                label="Package"
                column="name"
                activeColumn={sortColumn}
                direction={sortDirection}
                onSort={onSort}
              />
              <SortableHeader
                label="Current"
                column="currentVersion"
                activeColumn={sortColumn}
                direction={sortDirection}
                onSort={onSort}
                className="hidden md:table-cell"
              />
              <SortableHeader
                label="Latest"
                column="latestVersion"
                activeColumn={sortColumn}
                direction={sortDirection}
                onSort={onSort}
                className="hidden md:table-cell"
              />
              <SortableHeader
                label="Issues"
                column="issues"
                activeColumn={sortColumn}
                direction={sortDirection}
                onSort={onSort}
                className="hidden text-center lg:table-cell"
              />
              <SortableHeader
                label="Last published"
                column="lastPublished"
                activeColumn={sortColumn}
                direction={sortDirection}
                onSort={onSort}
                className="hidden xl:table-cell"
              />
              <TableHead className="w-20">Links</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <LoadingSkeleton />
            ) : packages.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="py-12 text-center text-muted-foreground">
                  {searchQuery
                    ? `No packages found matching "${searchQuery}"`
                    : 'No packages in this category'
                  }
                </TableCell>
              </TableRow>
            ) : (
              packages.map(pkg => (
                <PackageRow
                  key={pkg.name}
                  pkg={pkg}
                  isExpanded={expandedRows.has(pkg.name)}
                  onToggle={() => onToggleRow(pkg.name)}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export function DependencyTable({
  dependencies,
  devDependencies,
  filteredDeps,
  filteredDevDeps,
  totalDeps,
  totalDevDeps,
  isLoading,
  fetchedCount,
  totalPackages,
  searchQuery,
  sortColumn,
  sortDirection,
  expandedRows,
  onSearchChange,
  onSort,
  onToggleRow,
  onExpandAll,
  onCollapseAll,
}: DependencyTableProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="flex flex-col gap-4"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-xs flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search packages..."
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>

        {isLoading && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="size-2 animate-pulse rounded-full bg-yellow-400" />
            Analyzing packages... {fetchedCount} / {totalPackages}
          </div>
        )}
      </div>

      <Tabs defaultValue="dependencies">
        <TabsList>
          <TabsTrigger value="dependencies" className="gap-2">
            Dependencies
            <Badge variant="secondary" className="ml-1 text-[10px]">
              {totalDeps}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="devDependencies" className="gap-2">
            Dev Dependencies
            <Badge variant="secondary" className="ml-1 text-[10px]">
              {totalDevDeps}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dependencies">
          <PackageTable
            packages={filteredDeps}
            total={totalDeps}
            isLoading={isLoading && dependencies.length === 0}
            searchQuery={searchQuery}
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            expandedRows={expandedRows}
            onSort={onSort}
            onToggleRow={onToggleRow}
            onExpandAll={onExpandAll}
            onCollapseAll={onCollapseAll}
          />
        </TabsContent>

        <TabsContent value="devDependencies">
          <PackageTable
            packages={filteredDevDeps}
            total={totalDevDeps}
            isLoading={isLoading && devDependencies.length === 0}
            searchQuery={searchQuery}
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            expandedRows={expandedRows}
            onSort={onSort}
            onToggleRow={onToggleRow}
            onExpandAll={onExpandAll}
            onCollapseAll={onCollapseAll}
          />
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
