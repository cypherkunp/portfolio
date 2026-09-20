import { act, renderHook, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { usePackageAnalyzer } from '@/hooks/use-package-analyzer';

function jsonFile(contents: string, name = 'package.json') {
  return new File([contents], name, { type: 'application/json' });
}

function ndjsonResponse(rows: unknown[]) {
  const body = `${rows.map(row => JSON.stringify(row)).join('\n')}\n`;
  return new Response(body, {
    status: 200,
    headers: { 'content-type': 'application/x-ndjson' },
  });
}

describe('usePackageAnalyzer', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('reports a parse error for invalid JSON', async () => {
    const { result } = renderHook(() => usePackageAnalyzer());

    await act(async () => {
      result.current.handleFileUpload(jsonFile('{nope'));
    });

    await waitFor(() => expect(result.current.phase).toBe('error'));
    expect(result.current.error).toBe('parse');
  });

  it('reports an empty error when package.json has no dependencies', async () => {
    const { result } = renderHook(() => usePackageAnalyzer());

    await act(async () => {
      result.current.handleFileUpload(jsonFile(JSON.stringify({ name: 'demo' })));
    });

    await waitFor(() => expect(result.current.phase).toBe('error'));
    expect(result.current.error).toBe('empty');
  });

  it('streams registry rows and marks a package outdated', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        ndjsonResponse([
          {
            ok: true,
            name: 'react',
            configuredVersion: '^18.2.0',
            info: {
              name: 'react',
              description: 'UI library',
              latestVersion: '19.0.0',
              lastPublished: '2026-01-01T00:00:00.000Z',
              githubUrl: 'https://github.com/facebook/react',
              openIssues: 0,
            },
          },
        ]),
      ),
    );

    const { result } = renderHook(() => usePackageAnalyzer());

    await act(async () => {
      result.current.handleFileUpload(
        jsonFile(JSON.stringify({ name: 'demo', dependencies: { react: '^18.2.0' } })),
      );
    });

    await waitFor(() => expect(result.current.phase).toBe('done'));
    expect(result.current.metadata?.name).toBe('demo');
    expect(result.current.dependencies).toEqual([
      expect.objectContaining({
        name: 'react',
        configuredVersion: '^18.2.0',
        latestVersion: '19.0.0',
        isOutdated: true,
      }),
    ]);
    expect(result.current.outdatedCount).toBe(1);
  });

  it('reset returns the analyzer to idle', async () => {
    const { result } = renderHook(() => usePackageAnalyzer());

    await act(async () => {
      result.current.handleFileUpload(jsonFile('{nope'));
    });
    await waitFor(() => expect(result.current.phase).toBe('error'));

    act(() => {
      result.current.reset();
    });

    expect(result.current.phase).toBe('idle');
    expect(result.current.error).toBeNull();
    expect(result.current.fileName).toBeNull();
  });
});
