import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { CodeBlock } from './code-block';

const highlighted = (
  <code>
    <span className="line">
      <span style={{ ['--shiki-light' as string]: '#D73A49', ['--shiki-dark' as string]: '#F97583' }}>
        export
      </span>
      <span> function Button() {'{'}</span>
    </span>
    {'\n'}
    <span className="line">{'}'}</span>
  </code>
);

describe('CodeBlock', () => {
  it('shows the language and the highlighted source', () => {
    render(
      <CodeBlock
        language="tsx"
        className="shiki shiki-themes github-light github-dark"
        icon='<svg viewBox="0 0 24 24"><path d="M0 0" /></svg>'
      >
        {highlighted}
      </CodeBlock>,
    );

    expect(screen.getByRole('figure')).toHaveAttribute('data-language', 'tsx');
    expect(screen.getByText('TSX')).toBeInTheDocument();
    expect(screen.getByText('export')).toBeInTheDocument();
    expect(document.querySelector('figure svg')).toBeInTheDocument();
    expect(document.querySelector('pre')).toHaveClass('shiki');
  });

  it('uses the fence title as the label', () => {
    render(
      <CodeBlock language="tsx" title="button.tsx">
        {highlighted}
      </CodeBlock>,
    );

    expect(screen.getByText('button.tsx')).toBeInTheDocument();
    expect(screen.queryByText('TSX')).not.toBeInTheDocument();
  });

  it('ignores an icon that is not an svg', () => {
    const { container } = render(
      <CodeBlock language="ts" icon="<script>alert(1)</script>">
        {highlighted}
      </CodeBlock>,
    );

    expect(container.querySelector('script')).toBeNull();
  });

  it('wraps at 100 characters unless a fence sets another width', () => {
    const { rerender } = render(<CodeBlock language="tsx">{highlighted}</CodeBlock>);
    const pre = () => document.querySelector('pre');

    expect(pre()).toHaveClass('wrap-code');
    expect(pre()?.style.getPropertyValue('--code-wrap')).toBe('100');

    rerender(
      <CodeBlock language="tsx" wrapAt={72}>
        {highlighted}
      </CodeBlock>,
    );
    expect(pre()?.style.getPropertyValue('--code-wrap')).toBe('72');

    rerender(
      <CodeBlock language="tsx" wrapAt={false}>
        {highlighted}
      </CodeBlock>,
    );
    expect(pre()).not.toHaveClass('wrap-code');
    expect(pre()).toHaveClass('overflow-x-auto');
  });

  it('copies the source text', async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      configurable: true,
    });

    render(<CodeBlock language="tsx">{highlighted}</CodeBlock>);

    await user.click(screen.getByRole('button', { name: 'Copy' }));

    expect(writeText).toHaveBeenCalledWith('export function Button() {\n}');
  });
});
