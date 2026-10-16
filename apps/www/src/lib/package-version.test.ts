import { describe, expect, it } from 'vitest';

import { versionStatus } from '@/lib/package-version';

describe('versionStatus', () => {
  it('marks a caret range outdated when latest is a new major', () => {
    expect(versionStatus('^18.2.0', '19.0.0')).toBe('outdated');
  });

  it('treats a caret range as current when latest still satisfies it', () => {
    expect(versionStatus('^18.2.0', '18.3.0')).toBe('current');
  });

  it('marks an exact pin outdated when latest differs', () => {
    expect(versionStatus('1.2.3', '1.2.4')).toBe('outdated');
  });

  it('does not call workspace or git specs outdated', () => {
    expect(versionStatus('workspace:*', '1.0.0')).toBe('unknown');
    expect(versionStatus('github:org/repo', '1.0.0')).toBe('unknown');
    expect(versionStatus('file:../pkg', '1.0.0')).toBe('unknown');
  });

  it('returns unknown when latest was not published', () => {
    expect(versionStatus('^1.0.0', 'unknown')).toBe('unknown');
    expect(versionStatus('', '1.0.0')).toBe('unknown');
  });
});
