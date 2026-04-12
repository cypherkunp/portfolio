import type { Metadata } from 'next';

import MusicPlayer from '@/components/music-player';
import { ToolSubpageLayout } from '@/components/layout/tool-subpage-layout';

export const metadata: Metadata = {
  title: 'Music',
  description: 'Music player',
};

export default function MusicPage() {
  return (
    <ToolSubpageLayout title="Music" contentMaxWidth="max-w-full" flush>
      <MusicPlayer />
    </ToolSubpageLayout>
  );
}
