import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { RenderIf } from './render-if';

describe('RenderIf', () => {
  it('renders children when the condition is true', () => {
    render(
      <RenderIf condition>
        <p>Visible</p>
      </RenderIf>,
    );

    expect(screen.getByText('Visible')).toBeInTheDocument();
  });

  it('renders nothing when the condition is false', () => {
    render(
      <RenderIf condition={false}>
        <p>Hidden</p>
      </RenderIf>,
    );

    expect(screen.queryByText('Hidden')).not.toBeInTheDocument();
  });
});
