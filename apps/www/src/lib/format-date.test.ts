import { describe, expect, it } from 'vitest';

import { formatDate, toIsoDate } from '@/lib/format-date';

describe('formatDate', () => {
  it('formats a publishedOn stamp as zero-padded DD/MM/YY', () => {
    expect(formatDate('01-09-2026')).toBe('01/09/26');
  });

  it('keeps two digits when the day or month is already 10 or more', () => {
    expect(formatDate('08-10-2026')).toBe('08/10/26');
    expect(formatDate('19-09-2026')).toBe('19/09/26');
  });

  it('pads the year when the century remainder is under 10', () => {
    expect(formatDate('04-01-2009')).toBe('04/01/09');
  });
});

describe('toIsoDate', () => {
  it('turns DD-MM-YYYY into YYYY-MM-DD', () => {
    expect(toIsoDate('08-10-2026')).toBe('2026-10-08');
  });

  it('rejects a calendar day that does not exist', () => {
    expect(toIsoDate('32-13-2026')).toBeUndefined();
    expect(toIsoDate('2026-10-08')).toBeUndefined();
  });
});
