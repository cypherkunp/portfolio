import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { resolveFlagDefaultValue } from './flag-defaults.ts';

describe('resolveFlagDefaultValue', () => {
  it('defaults to false unless FEATURE_APPS_DEV_DEFAULT=true', () => {
    assert.equal(resolveFlagDefaultValue({}), false);
    assert.equal(resolveFlagDefaultValue({ NODE_ENV: 'development' }), false);
    assert.equal(resolveFlagDefaultValue({ FEATURE_APPS_DEV_DEFAULT: 'false' }), false);
    assert.equal(resolveFlagDefaultValue({ FEATURE_APPS_DEV_DEFAULT: 'true' }), true);
  });
});
