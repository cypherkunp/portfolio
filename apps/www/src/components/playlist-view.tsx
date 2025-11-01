'use client';

import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Clock, Play, Search } from 'lucide-react';

import type { Song } from '@/lib/types';
import { formatTime } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface PlaylistViewProps {
  songs: Song[];
  filteredSongs: Song[];
  onPlay: (song: Song) => void;
  currentSong: Song | null;
  onSearch: (query: string) => void;
  searchQuery: string;
}

export default function PlaylistView({
  songs,
  filteredSongs,
  onPlay,
  currentSong,
  onSearch,
  searchQuery,
}: PlaylistViewProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const songsPerPage = 5;

  // Reset to first page when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredSongs.length / songsPerPage);
  const indexOfLastSong = currentPage * songsPerPage;
  const indexOfFirstSong = indexOfLastSong - songsPerPage;
  const currentSongs = filteredSongs.slice(indexOfFirstSong, indexOfLastSong);

  const goToPage = (page: number) => {
    if (page < 1) page = 1;
    if (page > totalPages) page = totalPages;
    setCurrentPage(page);
  };

  return (
    <div className="p-6">
      <div className="mb-8 flex items-center gap-6">
        <div className="flex h-56 w-56 items-center justify-center bg-gradient-to-br from-green-400 to-green-800 shadow-xl">
          <Play className="h-20 w-20 text-white" />
        </div>
        <div className="flex-1">
          <p className="text-xs font-bold uppercase">Playlist</p>
          <h1 className="mb-6 mt-2 text-5xl font-bold">Songs Of AI</h1>
          <div className="text-sm text-zinc-400">
            <span className="font-semibold text-white">Your Library</span> • {songs.length} songs
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-zinc-400" />
        <Input
          placeholder="Search songs or artists..."
          className="border-zinc-700 bg-zinc-800 pl-10 text-white"
          value={searchQuery}
          onChange={e => onSearch(e.target.value)}
        />
      </div>

      <div className="rounded-lg bg-black/20">
        <div className="grid grid-cols-[16px_4fr_3fr_2fr_1fr] gap-4 border-b border-zinc-800 px-4 py-2 text-sm text-zinc-400">
          <div className="text-center">#</div>
          <div>TITLE</div>
          <div>ALBUM</div>
          <div>DATE ADDED</div>
          <div className="flex justify-end">
            <Clock className="h-4 w-4" />
          </div>
        </div>

        {currentSongs.length > 0 ? (
          <div className="divide-y divide-zinc-800/50 text-sm">
            {currentSongs.map((song, index) => (
              <div
                key={song.id}
                className={`grid grid-cols-[16px_4fr_3fr_2fr_1fr] items-center gap-4 rounded-md px-4 py-2 hover:bg-white/10 ${
                  currentSong?.id === song.id ? 'text-green-500' : 'text-white'
                }`}
                onClick={() => onPlay(song)}
              >
                <div className="text-center">{indexOfFirstSong + index + 1}</div>
                <div className="flex items-center gap-3">
                  <img
                    src={song.cover || '/placeholder.svg'}
                    alt={song.title}
                    className="h-10 w-10 object-cover"
                  />
                  <div>
                    <div className="font-medium">{song.title}</div>
                    <div className="text-zinc-400">{song.artist}</div>
                  </div>
                </div>
                <div className="text-zinc-400">{song.album}</div>
                <div className="text-zinc-400">2 days ago</div>
                <div className="text-right text-zinc-400">{formatTime(song.duration)}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-zinc-400">
            No songs found matching "{searchQuery}"
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 border-t border-zinc-800 p-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="h-8 w-8 text-zinc-400"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <Button
                  key={page}
                  variant={page === currentPage ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => goToPage(page)}
                  className={`h-8 w-8 ${page === currentPage ? 'bg-green-500 hover:bg-green-600' : 'text-zinc-400'}`}
                >
                  {page}
                </Button>
              ))}
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="h-8 w-8 text-zinc-400"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
