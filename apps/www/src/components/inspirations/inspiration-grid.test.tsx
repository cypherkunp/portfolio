import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NextIntlClientProvider } from 'next-intl';
import { describe, expect, it, vi } from 'vitest';

import { InspirationGrid } from '@/components/inspirations/inspiration-grid';

const emptyMessages = {
  Blocks: {
    quotesBlock: {
      emptyState: 'Nothing pinned here yet.',
      content: [],
    },
  },
};

const quoteMessages = {
  Blocks: {
    quotesBlock: {
      emptyState: 'Nothing pinned here yet.',
      content: [
        {
          id: '1',
          quote: 'I was born and raised in a city called Authenticity.',
          author: '@cypherkunp',
          tag: 'life',
          variant: 'highlight',
        },
        {
          id: '2',
          quote: 'Make it work, then make it right.',
          author: 'Kent Beck',
          source: 'TDD',
          tag: 'engineering',
        },
      ],
    },
  },
};

function renderGrid(messages: typeof quoteMessages | typeof emptyMessages) {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <InspirationGrid />
    </NextIntlClientProvider>,
  );
}

describe('InspirationGrid', () => {
  it('shows the empty copy when there are no quotes', () => {
    renderGrid(emptyMessages);

    expect(screen.getByText('Nothing pinned here yet.')).toBeInTheDocument();
  });

  it('renders quotes, attribution, and a pin on highlighted items', () => {
    renderGrid(quoteMessages);

    expect(
      screen.getByText('I was born and raised in a city called Authenticity.'),
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Pinned')).toBeInTheDocument();
    expect(screen.getByText('— Kent Beck · TDD')).toBeInTheDocument();
  });

  it('copies the quoted text and author to the clipboard', async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    });

    renderGrid(quoteMessages);

    await user.click(screen.getAllByRole('button', { name: 'Copy quote' })[0]);

    expect(writeText).toHaveBeenCalledWith(
      '"I was born and raised in a city called Authenticity." — @cypherkunp',
    );
    expect(screen.getByRole('button', { name: 'Copied' })).toBeInTheDocument();
  });
});
