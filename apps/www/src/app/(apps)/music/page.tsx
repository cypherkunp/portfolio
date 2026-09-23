import type { Metadata } from 'next';

import { brandedTitle, socialMetadata } from '@/lib/seo';
import { AppEnabledGate } from '@/components/app-enabled-gate';
import { ToolSubpageLayout } from '@/components/layout/tool-subpage-layout';
import MusicPlayer from '@/components/music-player';

const title = 'Music';
const description = 'Play tracks made in collaboration with AI artists.';

export const metadata: Metadata = {
  title,
  description,
  ...socialMetadata({
    title: brandedTitle(title),
    description,
    url: '/music',
  }),
};

export default function MusicPage() {
  return (
    <AppEnabledGate id="musicPlayer">
      <ToolSubpageLayout title="Music" flush>
        <MusicPlayer />
      </ToolSubpageLayout>
    </AppEnabledGate>
  );
}
