'use client';

import { useCallback, useMemo, useRef, useState } from 'react';

import type { NpmPackageInfo } from '@/lib/npm-registry';
import { fetchPackagesSequentially } from '@/lib/npm-registry';

export type ErrorType = 'parse' | 'empty' | 'api' | 'rate-limit';
export type SortColumn = 'name' | 'currentVersion' | 'latestVersion' | 'issues' | 'lastPublished';
export type SortDirection = 'asc' | 'desc' | null;
export type AnalyzerPhase = 'idle' | 'loading' | 'done' | 'error';

export interface PackageEntry extends NpmPackageInfo {
  configuredVersion: string;
  isOutdated: boolean;
}

export interface ProjectMetadata {
  name: string;
  description: string;
  version: string;
  license: string;
  author: string | { name?: string; email?: string; url?: string };
  repository: string | { url?: string; type?: string } | null;
}

interface ParsedPackageJson {
  metadata: ProjectMetadata;
  dependencies: Array<{ name: string; version: string }>;
  devDependencies: Array<{ name: string; version: string }>;
}

function parseVersion(version: string): string {
  return version.replace(/^[\^~>=<*]*/g, '').trim();
}

function isOutdated(configured: string, latest: string): boolean {
  const clean = parseVersion(configured);
  if (!clean || latest === 'unknown') return false;
  return clean !== latest;
}

function parsePackageJson(text: string): ParsedPackageJson {
  let json: Record<string, unknown>;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error('parse');
  }

  if (typeof json !== 'object' || json === null) {
    throw new Error('parse');
  }

  const deps = json.dependencies as Record<string, string> | undefined;
  const devDeps = json.devDependencies as Record<string, string> | undefined;

  if ((!deps || Object.keys(deps).length === 0) && (!devDeps || Object.keys(devDeps).length === 0)) {
    throw new Error('empty');
  }

  const toList = (obj?: Record<string, string>) =>
    obj ? Object.entries(obj).map(([name, version]) => ({ name, version })) : [];

  return {
    metadata: {
      name: (json.name as string) || 'Unnamed Project',
      description: (json.description as string) || '',
      version: (json.version as string) || '0.0.0',
      license: (json.license as string) || '',
      author: (json.author as ProjectMetadata['author']) || '',
      repository: (json.repository as ProjectMetadata['repository']) || null,
    },
    dependencies: toList(deps),
    devDependencies: toList(devDeps),
  };
}

function comparePackages(a: PackageEntry, b: PackageEntry, column: SortColumn, direction: SortDirection): number {
  if (!direction) return 0;
  const mul = direction === 'asc' ? 1 : -1;

  switch (column) {
    case 'name':
      return mul * a.name.localeCompare(b.name);
    case 'currentVersion':
      return mul * a.configuredVersion.localeCompare(b.configuredVersion);
    case 'latestVersion':
      return mul * a.latestVersion.localeCompare(b.latestVersion);
    case 'issues':
      return mul * (a.openIssues - b.openIssues);
    case 'lastPublished': {
      const dateA = a.lastPublished ? new Date(a.lastPublished).getTime() : 0;
      const dateB = b.lastPublished ? new Date(b.lastPublished).getTime() : 0;
      return mul * (dateA - dateB);
    }
    default:
      return 0;
  }
}

export function usePackageAnalyzer() {
  const [phase, setPhase] = useState<AnalyzerPhase>('idle');
  const [error, setError] = useState<ErrorType | null>(null);
  const [metadata, setMetadata] = useState<ProjectMetadata | null>(null);
  const [dependencies, setDependencies] = useState<PackageEntry[]>([]);
  const [devDependencies, setDevDependencies] = useState<PackageEntry[]>([]);
  const [totalDeps, setTotalDeps] = useState(0);
  const [totalDevDeps, setTotalDevDeps] = useState(0);
  const [fetchedCount, setFetchedCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortColumn, setSortColumn] = useState<SortColumn>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [fileName, setFileName] = useState<string | null>(null);

  const lastFileContent = useRef<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    setPhase('idle');
    setError(null);
    setMetadata(null);
    setDependencies([]);
    setDevDependencies([]);
    setTotalDeps(0);
    setTotalDevDeps(0);
    setFetchedCount(0);
    setSearchQuery('');
    setSortColumn('name');
    setSortDirection(null);
    setExpandedRows(new Set());
    setFileName(null);
  }, []);

  const processFile = useCallback(async (content: string, name: string) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setPhase('loading');
    setError(null);
    setDependencies([]);
    setDevDependencies([]);
    setFetchedCount(0);
    setExpandedRows(new Set());
    setFileName(name);
    lastFileContent.current = content;

    let parsed: ParsedPackageJson;
    try {
      parsed = parsePackageJson(content);
    } catch (err) {
      const type = err instanceof Error ? err.message : 'parse';
      setPhase('error');
      setError(type as ErrorType);
      return;
    }

    setMetadata(parsed.metadata);
    setTotalDeps(parsed.dependencies.length);
    setTotalDevDeps(parsed.devDependencies.length);

    const allPackages = [
      ...parsed.dependencies.map(p => ({ ...p, isDev: false })),
      ...parsed.devDependencies.map(p => ({ ...p, isDev: true })),
    ];

    let fetchCount = 0;
    let hadError = false;

    await fetchPackagesSequentially(
      allPackages,
      (info, _index) => {
        if (controller.signal.aborted) return;

        const entry: PackageEntry = {
          ...info,
          isOutdated: isOutdated(info.configuredVersion, info.latestVersion),
        };

        const pkg = allPackages[fetchCount];
        if (pkg.isDev) {
          setDevDependencies(prev => [...prev, entry]);
        } else {
          setDependencies(prev => [...prev, entry]);
        }

        fetchCount++;
        setFetchedCount(fetchCount);
      },
      (errorType) => {
        if (controller.signal.aborted) return;
        hadError = true;
        setPhase('error');
        setError(errorType);
        setDependencies([]);
        setDevDependencies([]);
      },
      controller.signal,
    );

    if (!controller.signal.aborted && !hadError) {
      setPhase('done');
    }
  }, []);

  const retry = useCallback(() => {
    if (lastFileContent.current && fileName) {
      processFile(lastFileContent.current, fileName);
    }
  }, [processFile, fileName]);

  const handleFileUpload = useCallback(
    (file: File) => {
      if (!file.name.endsWith('.json') && file.type !== 'application/json') {
        setPhase('error');
        setError('parse');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        processFile(content, file.name);
      };
      reader.readAsText(file);
    },
    [processFile],
  );

  const toggleSort = useCallback((column: SortColumn) => {
    setSortColumn(prev => {
      if (prev !== column) {
        setSortDirection('asc');
        return column;
      }
      setSortDirection(dir => {
        if (dir === 'asc') return 'desc';
        if (dir === 'desc') return null;
        return 'asc';
      });
      return prev;
    });
  }, []);

  const toggleRow = useCallback((name: string) => {
    setExpandedRows(prev => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  }, []);

  const expandAll = useCallback((packages: PackageEntry[]) => {
    setExpandedRows(new Set(packages.map(p => p.name)));
  }, []);

  const collapseAll = useCallback(() => {
    setExpandedRows(new Set());
  }, []);

  const filterAndSort = useCallback(
    (packages: PackageEntry[]) => {
      let filtered = packages;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        filtered = packages.filter(
          p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q),
        );
      }

      if (sortDirection) {
        filtered = [...filtered].sort((a, b) => comparePackages(a, b, sortColumn, sortDirection));
      }

      return filtered;
    },
    [searchQuery, sortColumn, sortDirection],
  );

  const filteredDeps = useMemo(() => filterAndSort(dependencies), [filterAndSort, dependencies]);
  const filteredDevDeps = useMemo(() => filterAndSort(devDependencies), [filterAndSort, devDependencies]);

  const totalPackages = totalDeps + totalDevDeps;
  const outdatedCount = useMemo(
    () => [...dependencies, ...devDependencies].filter(p => p.isOutdated).length,
    [dependencies, devDependencies],
  );
  const upToDateCount = useMemo(
    () => [...dependencies, ...devDependencies].filter(p => !p.isOutdated).length,
    [dependencies, devDependencies],
  );

  const averageAge = useMemo(() => {
    const allPkgs = [...dependencies, ...devDependencies];
    const withDates = allPkgs.filter(p => p.lastPublished);
    if (withDates.length === 0) return null;

    const now = Date.now();
    const totalDays = withDates.reduce((sum, p) => {
      const pubDate = new Date(p.lastPublished).getTime();
      return sum + (now - pubDate) / (1000 * 60 * 60 * 24);
    }, 0);

    return Math.round(totalDays / withDates.length);
  }, [dependencies, devDependencies]);

  return {
    phase,
    error,
    metadata,
    dependencies,
    devDependencies,
    filteredDeps,
    filteredDevDeps,
    totalDeps,
    totalDevDeps,
    totalPackages,
    outdatedCount,
    upToDateCount,
    averageAge,
    fetchedCount,
    searchQuery,
    sortColumn,
    sortDirection,
    expandedRows,
    fileName,

    handleFileUpload,
    retry,
    reset,
    setSearchQuery,
    toggleSort,
    toggleRow,
    expandAll,
    collapseAll,
  };
}
