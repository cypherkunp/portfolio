import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import MusicPlayer from '@/components/music-player';

export const metadata: Metadata = {
  title: 'Music',
  description: 'Music player',
};

export default function MusicPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <nav className="border-border flex items-center border-b px-4 py-3 lg:px-8">
        <Link
          href="/"
          className="text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
        <span className="mx-4 text-sm font-medium">Music</span>
      </nav>
      <div className="flex-1">
        <MusicPlayer />
      </div>
    </div>
  );
}
