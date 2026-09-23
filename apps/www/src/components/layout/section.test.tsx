import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Section } from '@/components/layout/section';

describe('Section', () => {
  it('renders the title as a heading and the description', () => {
    render(
      <Section title="Inspirations" description="Quotes I keep.">
        <p>Grid</p>
      </Section>,
    );

    expect(screen.getByRole('heading', { level: 2, name: 'Inspirations' })).toBeInTheDocument();
    expect(screen.getByText('Quotes I keep.')).toBeInTheDocument();
    expect(screen.getByText('Grid')).toBeInTheDocument();
  });

  it('uses an h1 when the section opens the page', () => {
    render(<Section isFirstSection title="Photos" />);

    expect(screen.getByRole('heading', { level: 1, name: 'Photos' })).toBeInTheDocument();
  });

  it('omits the heading block when title and description are missing', () => {
    render(
      <Section>
        <p>Only children</p>
      </Section>,
    );

    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
    expect(screen.getByText('Only children')).toBeInTheDocument();
  });
});
