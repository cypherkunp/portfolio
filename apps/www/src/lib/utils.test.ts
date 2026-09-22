import { describe, expect, it } from 'vitest';

import { cn, formatTime } from '@/lib/utils';

describe('cn', () => {
  it('merges conflicting Tailwind classes, keeping the last one', () => {
    expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4');
  });

  it('drops falsy inputs', () => {
    expect(cn('block', false, undefined, 'text-sm')).toBe('block text-sm');
  });
});

describe('formatTime', () => {
  it('formats a whole minute', () => {
    expect(formatTime(60)).toBe('1:00');
  });

  it('pads seconds under 10', () => {
    expect(formatTime(65)).toBe('1:05');
  });

  it('floors fractional seconds', () => {
    expect(formatTime(125.9)).toBe('2:05');
  });

  it('returns 0:00 for NaN and Infinity', () => {
    expect(formatTime(Number.NaN)).toBe('0:00');
    expect(formatTime(Number.POSITIVE_INFINITY)).toBe('0:00');
  });
});
