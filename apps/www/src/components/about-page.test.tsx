import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { describe, expect, it } from 'vitest';

import { AboutPage } from '@/components/about-page';

import en from '../../messages/en.json';

describe('AboutPage', () => {
  it('shows work, education, skills, and FAQ copy', () => {
    render(
      <NextIntlClientProvider locale="en" messages={en}>
        <AboutPage />
      </NextIntlClientProvider>,
    );

    expect(screen.getByRole('link', { name: 'Publicis Sapient - London, UK' })).toHaveAttribute(
      'href',
      'https://www.publicissapient.com/',
    );
    expect(screen.getByRole('heading', { name: 'University of Pune, India' })).toBeInTheDocument();
    expect(screen.getByText('BE (Bachelor of Engineering) in Computer Science')).toBeInTheDocument();
    expect(screen.getByText('StencilJS')).toBeInTheDocument();
    expect(screen.getByText('What is your professional background?')).toBeInTheDocument();
  });
});
