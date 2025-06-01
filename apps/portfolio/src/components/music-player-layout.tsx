"use client"

import { useState, useEffect } from "react"
import Sidebar from "@/components/sidebar"
import PlayerBar from "@/components/player-bar"
import PlaylistView from "@/components/playlist-view"
import type { Song } from "@/lib/types"
import { useMediaQuery } from "@/hooks/use-media-query"

// Sample song data - in a real app, this would be loaded dynamically
const songs: Song[] = [
  {
    id: "1",
    title: "Sunny Days",
    artist: "Happy Tunes",
    album: "Summer Vibes",
    duration: 187,
    cover: "/placeholder.svg?height=300&width=300",
    url: "/songs/song1.mp3",
  },
  {
    id: "2",
    title: "Midnight Dreams",
    artist: "Chill Vibes",
    album: "Night Sessions",
    duration: 214,
    cover: "/placeholder.svg?height=300&width=300",
    url: "/songs/song2.mp3",
  },
  {
    id: "3",
    title: "Mountain Echo",
    artist: "Nature Sounds",
    album: "Wilderness",
    duration: 176,
    cover: "/placeholder.svg?height=300&width=300",
    url: "/songs/song3.mp3",
  },
  {
    id: "4",
    title: "Urban Rhythm",
    artist: "City Beats",
    album: "Downtown",
    duration: 203,
    cover: "/placeholder.svg?height=300&width=300",
    url: "/songs/song1.mp3",
  },
  {
    id: "5",
    title: "Ocean Waves",
    artist: "Seaside",
    album: "Coastal Sounds",
    duration: 195,
    cover: "/placeholder.svg?height=300&width=300",
    url: "/songs/song2.mp3",
  },
  {
    id: "6",
    title: "Digital Dreams",
    artist: "AI Composer",
    album: "Neural Networks",
    duration: 210,
    cover: "/placeholder.svg?height=300&width=300",
    url: "/songs/song3.mp3",
  },
  {
    id: "7",
    title: "Quantum Beats",
    artist: "AI Composer",
    album: "Neural Networks",
    duration: 185,
    cover: "/placeholder.svg?height=300&width=300",
    url: "/songs/song1.mp3",
  },
  {
    id: "8",
    title: "Algorithmic Harmony",
    artist: "Deep Learning",
    album: "Machine Melodies",
    duration: 224,
    cover: "/placeholder.svg?height=300&width=300",
    url: "/songs/song2.mp3",
  },
  {
    id: "9",
    title: "Neural Nocturne",
    artist: "Deep Learning",
    album: "Machine Melodies",
    duration: 198,
    cover: "/placeholder.svg?height=300&width=300",
    url: "/songs/song3.mp3",
  },
  {
    id: "10",
    title: "Synthetic Symphony",
    artist: "AI Orchestra",
    album: "Digital Compositions",
    duration: 230,
    cover: "/placeholder.svg?height=300&width=300",
    url: "/songs/song1.mp3",
  },
  {
    id: "11",
    title: "Binary Ballad",
    artist: "AI Orchestra",
    album: "Digital Compositions",
    duration: 192,
    cover: "/placeholder.svg?height=300&width=300",
    url: "/songs/song2.mp3",
  },
  {
    id: "12",
    title: "Robotic Rhapsody",
    artist: "Synthetic Sounds",
    album: "Future Frequencies",
    duration: 215,
    cover: "/placeholder.svg?height=300&width=300",
    url: "/songs/song3.mp3",
  },
]

export default function MusicPlayerLayout() {
  const [currentSong, setCurrentSong] = useState<Song | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [queue, setQueue] = useState<Song[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredSongs, setFilteredSongs] = useState<Song[]>(songs)
  const isMobile = useMediaQuery("(max-width: 768px)")

  // Filter songs based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredSongs(songs)
    } else {
      const query = searchQuery.toLowerCase()
      const filtered = songs.filter(
        (song) =>
          song.title.toLowerCase().includes(query) ||
          song.artist.toLowerCase().includes(query) ||
          song.album.toLowerCase().includes(query),
      )
      setFilteredSongs(filtered)
    }
  }, [searchQuery])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const playSong = (song: Song) => {
    setCurrentSong(song)
    setIsPlaying(true)

    // Add the rest of the songs to the queue starting from the selected song
    // Use the filtered songs if there's a search query
    const songList = filteredSongs.length > 0 ? filteredSongs : songs
    const songIndex = songList.findIndex((s) => s.id === song.id)
    const newQueue = [...songList.slice(songIndex + 1), ...songList.slice(0, songIndex)]
    setQueue(newQueue)
  }

  const playNext = () => {
    if (queue.length > 0) {
      const nextSong = queue[0]
      const newQueue = queue.slice(1)

      if (currentSong) {
        newQueue.push(currentSong)
      }

      setCurrentSong(nextSong)
      setQueue(newQueue)
      setIsPlaying(true)
    }
  }

  const playPrevious = () => {
    if (queue.length > 0 && currentSong) {
      const prevSong = queue[queue.length - 1]
      const newQueue = [currentSong, ...queue.slice(0, queue.length - 1)]

      setCurrentSong(prevSong)
      setQueue(newQueue)
      setIsPlaying(true)
    }
  }

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      <div className="flex flex-1 overflow-hidden">
        {!isMobile && <Sidebar />}
        <main className="flex-1 overflow-auto pb-24">
          <PlaylistView
            songs={songs}
            filteredSongs={filteredSongs}
            onPlay={playSong}
            currentSong={currentSong}
            onSearch={handleSearch}
            searchQuery={searchQuery}
          />
        </main>
      </div>

      <PlayerBar
        currentSong={currentSong}
        isPlaying={isPlaying}
        onPlayPause={() => setIsPlaying(!isPlaying)}
        onNext={playNext}
        onPrevious={playPrevious}
      />
    </div>
  )
}
