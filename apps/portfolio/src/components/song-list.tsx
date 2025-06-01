"use client"

import type { Song } from "@/lib/types"
import { formatTime } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"

interface SongListProps {
  songs: Song[]
  currentSong: Song
  onSelect: (song: Song) => void
}

export default function SongList({ songs, currentSong, onSelect }: SongListProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="font-medium mb-2">Playlist</h3>
        <ul className="space-y-2">
          {songs.map((song) => (
            <li
              key={song.id}
              onClick={() => onSelect(song)}
              className={`flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-muted transition-colors ${
                currentSong.id === song.id ? "bg-muted" : ""
              }`}
            >
              <div className="w-10 h-10 rounded overflow-hidden flex-shrink-0">
                <img src={song.cover || "/placeholder.svg"} alt={song.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{song.title}</p>
                <p className="text-xs text-muted-foreground truncate">{song.artist}</p>
              </div>
              <div className="text-xs text-muted-foreground">{formatTime(song.duration)}</div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
