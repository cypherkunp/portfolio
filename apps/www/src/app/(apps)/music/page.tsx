import type { Metadata } from 'next';

import { AppEnabledGate, appPageMetadata } from '@/components/app-enabled-gate';
import { ToolSubpageLayout } from '@/components/layout/tool-subpage-layout';
import MusicPlayer from '@/components/music-player';

const pageMetadata = {
  title: 'Music',
  description: 'Music player',
} satisfies Metadata;

export function generateMetadata(): Promise<Metadata> {
  return appPageMetadata('musicPlayer', pageMetadata);
}

export default function MusicPage() {
  return (
    <AppEnabledGate id="musicPlayer">
      <ToolSubpageLayout flush>
        <MusicPlayer />
      </ToolSubpageLayout>
    </AppEnabledGate>
  );
}
