import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import Image from './next-image';

describe('Image', () => {
  it('asks the loader for the largest next/image width instead of the original file', () => {
    render(
      <Image
        src="/photos/1.jpg"
        alt="Alt 1"
        width={320}
        height={320}
        loader={({ src, width }) => `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=75`}
      />,
    );

    expect(screen.getByRole('img', { name: 'Alt 1' })).toHaveAttribute(
      'src',
      '/_next/image?url=%2Fphotos%2F1.jpg&w=3840&q=75',
    );
  });
});
