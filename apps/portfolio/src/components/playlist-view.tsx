"use client"

import { useState, useEffect } from "react"
import { Clock, Play, Search, ChevronLeft, ChevronRight } from "lucide-react"
import type { Song } from "@/lib/types"
import { formatTime } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface PlaylistViewProps {
  songs: Song[]
  filteredSongs: Song[]
  onPlay: (song: Song) => void
  currentSong: Song | null
  onSearch: (query: string) => void
  searchQuery: string
}

export default function PlaylistView({
  songs,
  filteredSongs,
  onPlay,
  currentSong,
  onSearch,
  searchQuery,
}: PlaylistViewProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const songsPerPage = 5

  // Reset to first page when search query changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery])

  // Calculate pagination
  const totalPages = Math.ceil(filteredSongs.length / songsPerPage)
  const indexOfLastSong = currentPage * songsPerPage
  const indexOfFirstSong = indexOfLastSong - songsPerPage
  const currentSongs = filteredSongs.slice(indexOfFirstSong, indexOfLastSong)

  const goToPage = (page: number) => {
    if (page < 1) page = 1
    if (page > totalPages) page = totalPages
    setCurrentPage(page)
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-6 mb-8">
        <div className="w-56 h-56 bg-gradient-to-br from-green-400 to-green-800 shadow-xl flex items-center justify-center">
          <Play className="h-20 w-20 text-white" />
        </div>
        <div className="flex-1">
          <p className="text-xs uppercase font-bold">Playlist</p>
          <h1 className="text-5xl font-bold mt-2 mb-6">Songs Of AI</h1>
          <div className="text-sm text-zinc-400">
            <span className="text-white font-semibold">Your Library</span> • {songs.length} songs
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-4 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
        <Input
          placeholder="Search songs or artists..."
          className="pl-10 bg-zinc-800 border-zinc-700 text-white"
          value={searchQuery}
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>

      <div className="bg-black/20 rounded-lg">
        <div className="grid grid-cols-[16px_4fr_3fr_2fr_1fr] gap-4 px-4 py-2 text-sm text-zinc-400 border-b border-zinc-800">
          <div className="text-center">#</div>
          <div>TITLE</div>
          <div>ALBUM</div>
          <div>DATE ADDED</div>
          <div className="flex justify-end">
            <Clock className="h-4 w-4" />
          </div>
        </div>

        {currentSongs.length > 0 ? (
          <div className="text-sm divide-y divide-zinc-800/50">
            {currentSongs.map((song, index) => (
              <div
                key={song.id}
                className={`grid grid-cols-[16px_4fr_3fr_2fr_1fr] gap-4 px-4 py-2 items-center hover:bg-white/10 rounded-md ${
                  currentSong?.id === song.id ? "text-green-500" : "text-white"
                }`}
                onClick={() => onPlay(song)}
              >
                <div className="text-center">{indexOfFirstSong + index + 1}</div>
                <div className="flex items-center gap-3">
                  <img src={song.cover || "/placeholder.svg"} alt={song.title} className="w-10 h-10 object-cover" />
                  <div>
                    <div className="font-medium">{song.title}</div>
                    <div className="text-zinc-400">{song.artist}</div>
                  </div>
                </div>
                <div className="text-zinc-400">{song.album}</div>
                <div className="text-zinc-400">2 days ago</div>
                <div className="text-zinc-400 text-right">{formatTime(song.duration)}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-zinc-400">No songs found matching "{searchQuery}"</div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 p-4 border-t border-zinc-800">
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
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={page === currentPage ? "default" : "ghost"}
                  size="sm"
                  onClick={() => goToPage(page)}
                  className={`h-8 w-8 ${page === currentPage ? "bg-green-500 hover:bg-green-600" : "text-zinc-400"}`}
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
  )
}
