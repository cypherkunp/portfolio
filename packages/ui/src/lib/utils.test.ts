import { describe, expect, it } from 'vitest';

import { cn } from './utils';

describe('cn', () => {
  it('merges conflicting Tailwind classes, keeping the last one', () => {
    expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4');
  });

  it('drops falsy inputs', () => {
    expect(cn('block', false, undefined, 'text-sm')).toBe('block text-sm');
  });
});
