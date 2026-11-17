import { render, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Terminal } from './terminal';

describe('Terminal', () => {
  it('highlights the command with token colours', async () => {
    const { container } = render(<Terminal command="pnpm ui:add button" />);

    await waitFor(() => {
      expect(container.querySelector('code span[style*="color"]')).not.toBeNull();
    });
  });
});
