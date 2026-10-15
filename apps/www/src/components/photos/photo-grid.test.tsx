import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';

import type { Photo } from '@/lib/photo';
import { PhotoGrid } from '@/components/photos/photo-grid';

const VIEWPORT_WIDTH = 900;
const VIEWPORT_HEIGHT = 600;

function photo(id: number): Photo {
  return {
    id: String(id),
    src: `/photos/${id}.jpg`,
    alt: `Alt ${id}`,
    width: 4000,
    height: 3000,
    date: '2024-01-02',
    location: 'Lisbon',
  };
}

const photos = Array.from({ length: 30 }, (_, index) => photo(index + 1));

function imageUrl(img: HTMLElement) {
  return `${img.getAttribute('src') ?? ''} ${img.getAttribute('srcset') ?? ''}`;
}

beforeEach(() => {
  globalThis.ResizeObserver = class {
    private readonly callback: ResizeObserverCallback;

    constructor(callback: ResizeObserverCallback) {
      this.callback = callback;
    }

    observe(target: Element) {
      this.callback(
        [
          {
            contentRect: {
              width: VIEWPORT_WIDTH,
              height: VIEWPORT_HEIGHT,
              top: 0,
              left: 0,
              bottom: VIEWPORT_HEIGHT,
              right: VIEWPORT_WIDTH,
              x: 0,
              y: 0,
              toJSON() {
                return {};
              },
            },
            target,
          } as ResizeObserverEntry,
        ],
        this as unknown as ResizeObserver,
      );
    }

    unobserve() {}

    disconnect() {}
  };
});

describe('PhotoGrid', () => {
  it('shows the empty copy when there are no photos', () => {
    render(<PhotoGrid photos={[]} />);

    expect(screen.getByText('Drop images into public/photos.')).toBeInTheDocument();
  });

  it('mounts only the visible thumbnail window', () => {
    render(<PhotoGrid photos={photos} />);

    // 900×600 viewport, 300px cells, one overscan row → 3×3.
    expect(screen.getAllByRole('button', { name: /Open photo/ })).toHaveLength(9);
    expect(screen.queryByRole('button', { name: 'Open photo: Alt 10' })).not.toBeInTheDocument();
  });

  it('keeps thumbnails small and fetches a full rendition only for the opened photo', async () => {
    const user = userEvent.setup();
    render(<PhotoGrid photos={photos} />);

    for (const img of screen.getAllByRole('img')) {
      expect(imageUrl(img)).not.toMatch(/w=(1080|1200|1920|2048|3840)/);
      expect(imageUrl(img)).toContain('w=640');
    }

    await user.click(screen.getByRole('button', { name: 'Open photo: Alt 1' }));

    const full = screen.getAllByRole('img').filter(img => imageUrl(img).includes('w=1920'));
    expect(full).toHaveLength(1);
    expect(imageUrl(full[0]!)).toContain(encodeURIComponent('/photos/1.jpg'));
    expect(imageUrl(full[0]!)).not.toMatch(/w=(2048|3840)/);

    for (const img of screen.getAllByRole('img')) {
      if (img === full[0]) continue;
      expect(imageUrl(img)).not.toMatch(/w=(1080|1200|1920|2048|3840)/);
    }

    await user.click(screen.getByRole('button', { name: 'Next photo' }));

    const nextFull = screen.getAllByRole('img').filter(img => imageUrl(img).includes('w=1920'));
    expect(nextFull).toHaveLength(1);
    expect(imageUrl(nextFull[0]!)).toContain(encodeURIComponent('/photos/2.jpg'));
    expect(imageUrl(nextFull[0]!)).not.toContain(encodeURIComponent('/photos/1.jpg'));

    await user.click(screen.getByRole('button', { name: 'Close' }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    for (const img of screen.getAllByRole('img')) {
      expect(imageUrl(img)).not.toMatch(/w=(1080|1200|1920|2048|3840)/);
    }
  });
});
