import type { Metadata } from 'next';

import { ToolSubpageLayout } from '@/components/layout/tool-subpage-layout';
import MusicPlayer from '@/components/music-player';

export const metadata: Metadata = {
  title: 'Music',
  description: 'Music player',
};

export default function MusicPage() {
  return (
    <ToolSubpageLayout flush>
      <MusicPlayer />
    </ToolSubpageLayout>
  );
}
