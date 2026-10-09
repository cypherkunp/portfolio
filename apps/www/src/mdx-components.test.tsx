import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { getMDXComponents } from '../mdx-components';

const chip = 'bg-muted';

describe('mdx code', () => {
  it('renders inline code as a chip', () => {
    const { code: Code } = getMDXComponents();
    render(<Code>git status</Code>);

    const node = screen.getByText('git status');
    expect(node.tagName).toBe('CODE');
    expect(node).toHaveClass(chip);
    expect(node).toHaveClass('text-[0.85em]');
    expect(node).not.toHaveClass('text-sm');
  });

  it('does not chip a fence whose code class is language-*', () => {
    const { code: Code } = getMDXComponents();
    render(<Code className="language-bash">echo hello</Code>);

    const node = screen.getByText('echo hello');
    expect(node).toHaveClass('language-bash');
    expect(node).toHaveClass('font-mono');
    expect(node).toHaveClass('text-sm');
    expect(node).not.toHaveClass(chip);
    expect(node).not.toHaveClass('rounded-md');
  });

  it('does not chip a plain fence inside CodeBlock', () => {
    const { pre: Pre, code: Code } = getMDXComponents();
    render(
      <Pre>
        <Code className="language-text">git status</Code>
      </Pre>,
    );

    const node = screen.getByText('git status');
    expect(node.tagName).toBe('CODE');
    expect(node.closest('figure')).toBeTruthy();
    expect(node).not.toHaveClass(chip);
    expect(node).toHaveClass('text-sm');
  });

  it('does not chip Shiki output', () => {
    const { code: Code } = getMDXComponents();
    render(
      <Code>
        <span className="line">export const n = 1</span>
      </Code>,
    );

    const node = screen.getByText('export const n = 1').closest('code');
    expect(node).toHaveClass('text-sm');
    expect(node).not.toHaveClass(chip);
  });
});
