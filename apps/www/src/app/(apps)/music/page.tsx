import type { Metadata } from 'next';
import { assertAppEnabled } from '@/flags';

import { ToolSubpageLayout } from '@/components/layout/tool-subpage-layout';
import MusicPlayer from '@/components/music-player';

export const metadata: Metadata = {
  title: 'Music',
  description: 'Music player',
};

export default async function MusicPage() {
  await assertAppEnabled('musicPlayer');

  return (
    <ToolSubpageLayout flush>
      <MusicPlayer />
    </ToolSubpageLayout>
  );
}
