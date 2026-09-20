import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { BookmarkList } from '@/components/bookmarks/bookmark-list';

describe('BookmarkList', () => {
  it('shows the empty copy when the collection has no bookmarks', () => {
    render(<BookmarkList bookmarks={[]} />);

    expect(screen.getByText('No bookmarks in this collection yet.')).toBeInTheDocument();
  });

  it('uses the snapshot title and shows the host beside it', () => {
    render(
      <BookmarkList
        bookmarks={[{ url: 'https://www.example.com/essay', title: 'Do Things', image: null }]}
      />,
    );

    const link = screen.getByRole('link', { name: /Do Things/ });
    expect(link).toHaveAttribute('href', 'https://www.example.com/essay');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    expect(screen.getByText('example.com')).toBeInTheDocument();
  });

  it('falls back to the hostname when the snapshot title is missing', () => {
    render(
      <BookmarkList bookmarks={[{ url: 'https://grugbrain.dev/', title: null, image: null }]} />,
    );

    expect(screen.getByRole('link', { name: 'grugbrain.dev' })).toBeInTheDocument();
  });

  it('shows the snapshot image when the bookmark has one', () => {
    const { container } = render(
      <BookmarkList
        bookmarks={[
          {
            url: 'https://www.youtube.com/@Fireship',
            title: 'Fireship',
            image: 'https://yt3.googleusercontent.com/fireship.jpg',
          },
        ]}
      />,
    );

    const image = container.querySelector('img');
    expect(image).toHaveAttribute('src', 'https://yt3.googleusercontent.com/fireship.jpg');
    expect(image).toHaveAttribute('alt', '');
  });

  it('does not render an image when the snapshot image is empty', () => {
    const { container } = render(
      <BookmarkList
        bookmarks={[
          { url: 'https://grugbrain.dev/', title: 'The Grug Brained Developer', image: null },
        ]}
      />,
    );

    expect(container.querySelector('img')).toBeNull();
  });
});
