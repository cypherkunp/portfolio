import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import Image from './image';

describe('Image', () => {
  it('asks the loader for the largest rendition width instead of the original file', () => {
    render(
      <Image
        src="/photos/1.jpg"
        alt="Alt 1"
        width={320}
        height={320}
        loader={({ src, width }) => `/image?url=${encodeURIComponent(src)}&w=${width}&q=75`}
      />,
    );

    expect(screen.getByRole('img', { name: 'Alt 1' })).toHaveAttribute(
      'src',
      '/image?url=%2Fphotos%2F1.jpg&w=3840&q=75',
    );
  });
});
