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

    expect(screen.getByRole('heading', { name: 'Work Experience' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Publicis Sapient - London, UK' })).toHaveAttribute(
      'href',
      'https://www.publicissapient.com/',
    );
    expect(screen.getByText('Lead Experience Engineer')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Education' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'University of Pune, India' })).toBeInTheDocument();
    expect(
      screen.getByText('BE (Bachelor of Engineering) in Computer Science'),
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Skills' })).toBeInTheDocument();
    expect(screen.getByText('Web Development')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'FAQs' })).toBeInTheDocument();
    expect(screen.getByText('What is your professional background?')).toBeInTheDocument();
  });
});
