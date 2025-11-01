'use client';

import type { Song } from '@/lib/types';
import { formatTime } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';

interface SongListProps {
  songs: Song[];
  currentSong: Song;
  onSelect: (song: Song) => void;
}

export default function SongList({ songs, currentSong, onSelect }: SongListProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="mb-2 font-medium">Playlist</h3>
        <ul className="space-y-2">
          {songs.map(song => (
            <li
              key={song.id}
              onClick={() => onSelect(song)}
              className={`hover:bg-muted flex cursor-pointer items-center gap-3 rounded-md p-2 transition-colors ${
                currentSong.id === song.id ? 'bg-muted' : ''
              }`}
            >
              <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded">
                <img
                  src={song.cover || '/placeholder.svg'}
                  alt={song.title}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{song.title}</p>
                <p className="text-muted-foreground truncate text-xs">{song.artist}</p>
              </div>
              <div className="text-muted-foreground text-xs">{formatTime(song.duration)}</div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
