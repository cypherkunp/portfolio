import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import MusicPlayer from '@/components/music-player';

describe('MusicPlayer', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('advances from the song that ended, not the first render', async () => {
    class ResizeObserverStub {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
    vi.stubGlobal('ResizeObserver', ResizeObserverStub);

    let ended: (() => void) | undefined;

    class FakeAudio {
      src = '';
      currentTime = 0;
      volume = 1;
      preload = 'none';
      addEventListener(type: string, handler: () => void) {
        if (type === 'ended') ended = handler;
      }
      play() {
        return Promise.resolve();
      }
      pause() {}
    }

    vi.stubGlobal('Audio', FakeAudio);

    const user = userEvent.setup();
    render(<MusicPlayer />);

    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Happy New Year Folks');

    await user.click(screen.getByText('Back to Nostrads'));
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Back to Nostrads');

    await act(async () => {
      ended?.();
    });

    expect(ended).toBeTypeOf('function');
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Happy New Year Folks');
  });
});
