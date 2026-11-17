import { describe, expect, it } from 'vitest';

import { markCodeInFences } from './mark-fence-code';

interface Node {
  type: string;
  tagName?: string;
  value?: string;
  properties?: { className?: string[] };
  children?: Node[];
}

function fence(code: Node, tagName = 'pre'): Node {
  return { type: 'root', children: [{ type: 'element', tagName, children: [code] }] };
}

describe('markCodeInFences', () => {
  it('marks a fence with no language and plain text', () => {
    const code: Node = {
      type: 'element',
      tagName: 'code',
      properties: {},
      children: [{ type: 'text', value: 'git status' }],
    };

    markCodeInFences(fence(code));

    expect(code.properties?.className).toEqual(['language-text']);
  });

  it('keeps an existing language class', () => {
    const code: Node = {
      type: 'element',
      tagName: 'code',
      properties: { className: ['language-bash'] },
      children: [{ type: 'text', value: 'echo hello' }],
    };

    markCodeInFences(fence(code));

    expect(code.properties?.className).toEqual(['language-bash']);
  });

  it('leaves inline code alone', () => {
    const code: Node = {
      type: 'element',
      tagName: 'code',
      properties: {},
      children: [{ type: 'text', value: 'git status' }],
    };

    markCodeInFences(fence(code, 'p'));

    expect(code.properties?.className).toBeUndefined();
  });

  it('leaves highlighted fence code alone', () => {
    const code: Node = {
      type: 'element',
      tagName: 'code',
      properties: {},
      children: [
        {
          type: 'element',
          tagName: 'span',
          properties: { className: ['line'] },
          children: [{ type: 'text', value: 'export const n = 1' }],
        },
      ],
    };

    markCodeInFences(fence(code));

    expect(code.properties?.className).toBeUndefined();
  });
});
