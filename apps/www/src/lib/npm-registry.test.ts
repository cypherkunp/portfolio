import { describe, expect, it } from 'vitest';

import { githubUrlFromRepository, isValidPackageName } from '@/lib/npm-registry';

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

describe('githubUrlFromRepository', () => {
  it('normalizes ssh, scp, and github: forms to https://github.com', () => {
    expect(githubUrlFromRepository('git@github.com:facebook/react.git')).toBe(
      'https://github.com/facebook/react',
    );
    expect(githubUrlFromRepository('ssh://git@github.com/facebook/react.git')).toBe(
      'https://github.com/facebook/react',
    );
    expect(githubUrlFromRepository('github:facebook/react')).toBe(
      'https://github.com/facebook/react',
    );
    expect(githubUrlFromRepository('git+https://github.com/facebook/react.git')).toBe(
      'https://github.com/facebook/react',
    );
    expect(githubUrlFromRepository({ url: 'https://github.com/facebook/react' })).toBe(
      'https://github.com/facebook/react',
    );
  });

  it('rejects hosts that only contain the github.com substring', () => {
    expect(githubUrlFromRepository('https://notgithub.com/facebook/react')).toBeNull();
    expect(githubUrlFromRepository('https://github.com.evil.com/facebook/react')).toBeNull();
    expect(githubUrlFromRepository('https://evil.com/?q=github.com')).toBeNull();
    expect(githubUrlFromRepository('http://github.com/facebook/react')).toBeNull();
  });
});
