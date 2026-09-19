import { describe, expect, it } from 'vitest';

import { isValidPackageName } from '@/lib/npm-registry';

describe('isValidPackageName', () => {
  it('accepts an unscoped npm name', () => {
    expect(isValidPackageName('react')).toBe(true);
  });

  it('accepts a scoped name', () => {
    expect(isValidPackageName('@testing-library/react')).toBe(true);
  });

  it('rejects an empty string', () => {
    expect(isValidPackageName('')).toBe(false);
  });

  it('rejects whitespace', () => {
    expect(isValidPackageName('react native')).toBe(false);
  });

  it('rejects names longer than 214 characters', () => {
    expect(isValidPackageName('a'.repeat(215))).toBe(false);
  });
});
