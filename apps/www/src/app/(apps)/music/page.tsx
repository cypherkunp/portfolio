import type { Metadata } from 'next';

import { AppEnabledGate } from '@/components/app-enabled-gate';
import { ToolSubpageLayout } from '@/components/layout/tool-subpage-layout';
import MusicPlayer from '@/components/music-player';

export const metadata: Metadata = {
  title: 'Music',
  description: 'Music player',
};

export default function MusicPage() {
  return (
    <AppEnabledGate id="musicPlayer">
      <ToolSubpageLayout flush>
        <MusicPlayer />
      </ToolSubpageLayout>
    </AppEnabledGate>
  );
}
