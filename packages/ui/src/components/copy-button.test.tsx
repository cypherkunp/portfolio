import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { CopyButton } from './copy-button';
import { TooltipProvider } from './tooltip';

describe('CopyButton', () => {
  it('writes the value to the clipboard and marks itself as copied', async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      configurable: true,
    });

    render(
      <TooltipProvider>
        <CopyButton value="pnpm add @repo/ui" />
      </TooltipProvider>,
    );

    const button = screen.getByRole('button', { name: 'Copy' });
    expect(button).toHaveAttribute('data-copied', 'false');

    await user.click(button);

    expect(writeText).toHaveBeenCalledWith('pnpm add @repo/ui');
    expect(button).toHaveAttribute('data-copied', 'true');
  });
});
