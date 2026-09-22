import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { CollectionList } from '@/components/bookmarks/collection-list';

describe('CollectionList', () => {
  it('links each collection by id and shows how many bookmarks it holds', () => {
    render(
      <CollectionList
        collections={[
          {
            id: 'reading-list',
            name: 'Reading List',
            description: 'Long-form.',
            bookmarks: [
              { url: 'https://example.com/a', title: 'A', image: null },
              { url: 'https://example.com/b', title: 'B', image: null },
            ],
          },
        ]}
      />,
    );

    const link = screen.getByRole('link', { name: /Reading List/ });
    expect(link).toHaveAttribute('href', '/bookmarks/reading-list');
    expect(screen.getByLabelText('2 links')).toHaveTextContent('2');
    expect(screen.getByText('Long-form.')).toBeInTheDocument();
  });
});
