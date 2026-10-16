import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ImageContract } from './image-contract';

describe('ImageContract', () => {
  it('lists each width and names the largest as the fallback src', () => {
    render(
      <ImageContract title="Default widths when sizes is set" widths={[32, 48, 64, 384, 3840]} />,
    );

    expect(
      screen.getByRole('figure', { name: 'Default widths when sizes is set' }),
    ).toBeInTheDocument();
    expect(screen.getByText('32')).toBeInTheDocument();
    expect(screen.getByText('48')).toBeInTheDocument();
    expect(screen.getByText('64')).toBeInTheDocument();
    expect(screen.getByText('384')).toBeInTheDocument();
    expect(screen.getByText('Fallback src is 3840.')).toBeInTheDocument();
  });
});
