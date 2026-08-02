import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { ZodError } from 'zod';

import {
  dedupePackagesByName,
  isValidPackageName,
  MAX_PACKAGES,
  NpmBodySchema,
} from './npm-api.ts';

describe('isValidPackageName', () => {
  it('accepts scoped and unscoped names', () => {
    assert.equal(isValidPackageName('react'), true);
    assert.equal(isValidPackageName('@scope/pkg'), true);
    assert.equal(isValidPackageName(''), false);
    assert.equal(isValidPackageName('BAD NAME'), false);
  });
});

describe('NpmBodySchema', () => {
  it('accepts a normal payload and rejects oversized batches', () => {
    const parsed = NpmBodySchema.parse({
      packages: [{ name: 'react', version: '^19' }],
    });
    assert.equal(parsed.packages[0]?.name, 'react');

    assert.throws(
      () =>
        NpmBodySchema.parse({
          packages: Array.from({ length: MAX_PACKAGES + 1 }, (_, i) => ({
            name: `pkg-${i}`,
            version: '1.0.0',
          })),
        }),
      ZodError,
    );
  });
});

describe('dedupePackagesByName', () => {
  it('keeps the first configured version per name', () => {
    const map = dedupePackagesByName([
      { name: 'react', version: '19' },
      { name: 'react', version: '18' },
      { name: 'zod', version: '3' },
    ]);
    assert.equal(map.get('react'), '19');
    assert.equal(map.size, 2);
  });
});
