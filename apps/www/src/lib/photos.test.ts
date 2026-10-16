import { describe, expect, it } from 'vitest';

import { calendarDate } from '@/lib/photos';

describe('calendarDate', () => {
  it('keeps an EXIF timestamp on the calendar day it names', () => {
    expect(calendarDate('2024:01:02 00:30:00')).toBe('2024-01-02');
  });

  it('keeps an ISO date prefix without converting through UTC', () => {
    expect(calendarDate('2024-01-02T00:30:00')).toBe('2024-01-02');
  });

  it('formats a Date with local calendar parts', () => {
    expect(calendarDate(new Date(2024, 0, 2, 0, 30))).toBe('2024-01-02');
  });

  it('rejects an impossible month', () => {
    expect(calendarDate('2024:13:02 00:00:00')).toBeUndefined();
  });
});
