"use client"

import { useState, useRef, useEffect } from "react"
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Repeat, Shuffle } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { formatTime } from "@/lib/utils"
import type { Song } from "@/lib/types"
import SongList from "./song-list"

const songs: Song[] = [
  {
    id: 1,
    title: "Sunny Days",
    artist: "Happy Tunes",
    duration: 187,
    cover: "/placeholder.svg?height=400&width=400",
    url: "/songs/song1.mp3",
  },
  {
    id: 2,
    title: "Midnight Dreams",
    artist: "Chill Vibes",
    duration: 214,
    cover: "/placeholder.svg?height=400&width=400",
    url: "/songs/song2.mp3",
  },
  {
    id: 3,
    title: "Mountain Echo",
    artist: "Nature Sounds",
    duration: 176,
    cover: "/placeholder.svg?height=400&width=400",
    url: "/songs/song3.mp3",
  },
]

export default function MusicPlayer() {
  const [currentSong, setCurrentSong] = useState<Song>(songs[0])
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const [isMuted, setIsMuted] = useState(false)
  const [isRepeat, setIsRepeat] = useState(false)
  const [isShuffle, setIsShuffle] = useState(false)
  const [showPlaylist, setShowPlaylist] = useState(false)

  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    audioRef.current = new Audio(currentSong.url)
    audioRef.current.volume = volume

    const updateProgress = () => {
      if (audioRef.current) {
        setCurrentTime(audioRef.current.currentTime)
      }
    }

    const handleEnded = () => {
      if (isRepeat) {
        playCurrentSong()
      } else {
        playNextSong()
      }
    }

    audioRef.current.addEventListener("timeupdate", updateProgress)
    audioRef.current.addEventListener("ended", handleEnded)

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.removeEventListener("timeupdate", updateProgress)
        audioRef.current.removeEventListener("ended", handleEnded)
      }
    }
  }, [currentSong, isRepeat])

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch((error) => {
          console.error("Error playing audio:", error)
          setIsPlaying(false)
        })
      } else {
        audioRef.current.pause()
      }
    }
  }, [isPlaying])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume
    }
  }, [volume, isMuted])

  const playCurrentSong = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0
      audioRef.current.play().catch((error) => {
        console.error("Error playing audio:", error)
        setIsPlaying(false)
      })
      setIsPlaying(true)
    }
  }

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const handleProgressChange = (value: number[]) => {
    if (audioRef.current) {
      const newTime = value[0]
      audioRef.current.currentTime = newTime
      setCurrentTime(newTime)
    }
  }

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0]
    setVolume(newVolume)
    if (newVolume > 0 && isMuted) {
      setIsMuted(false)
    }
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const playPreviousSong = () => {
    let index = songs.findIndex((song) => song.id === currentSong.id)

    if (isShuffle) {
      index = Math.floor(Math.random() * songs.length)
    } else {
      index = index <= 0 ? songs.length - 1 : index - 1
    }

    setCurrentSong(songs[index])
    setIsPlaying(true)
  }

  const playNextSong = () => {
    let index = songs.findIndex((song) => song.id === currentSong.id)

    if (isShuffle) {
      index = Math.floor(Math.random() * songs.length)
    } else {
      index = index >= songs.length - 1 ? 0 : index + 1
    }

    setCurrentSong(songs[index])
    setIsPlaying(true)
  }

  const selectSong = (song: Song) => {
    setCurrentSong(song)
    setIsPlaying(true)
  }

  return (
    <div className="flex flex-col gap-4">
      <Card className="overflow-hidden">
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img
            src={currentSong.cover || "/placeholder.svg"}
            alt={`${currentSong.title} cover`}
            className="object-cover w-full h-full transition-all duration-300 hover:scale-105"
          />
        </div>

        <CardContent className="p-6">
          <div className="mb-4">
            <h2 className="text-2xl font-bold truncate">{currentSong.title}</h2>
            <p className="text-sm text-muted-foreground">{currentSong.artist}</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground w-10">{formatTime(currentTime)}</span>
              <Slider
                value={[currentTime]}
                max={currentSong.duration}
                step={1}
                onValueChange={handleProgressChange}
                className="flex-1"
              />
              <span className="text-xs text-muted-foreground w-10">{formatTime(currentSong.duration)}</span>
            </div>

            <div className="flex justify-between items-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsRepeat(!isRepeat)}
                className={isRepeat ? "text-primary" : ""}
              >
                <Repeat className="h-5 w-5" />
              </Button>

              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={playPreviousSong}>
                  <SkipBack className="h-6 w-6" />
                </Button>

                <Button variant="default" size="icon" className="h-12 w-12 rounded-full" onClick={togglePlay}>
                  {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-1" />}
                </Button>

                <Button variant="ghost" size="icon" onClick={playNextSong}>
                  <SkipForward className="h-6 w-6" />
                </Button>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsShuffle(!isShuffle)}
                className={isShuffle ? "text-primary" : ""}
              >
                <Shuffle className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={toggleMute}>
                {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </Button>
              <Slider
                value={[isMuted ? 0 : volume]}
                max={1}
                step={0.01}
                onValueChange={handleVolumeChange}
                className="flex-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Button variant="outline" className="w-full" onClick={() => setShowPlaylist(!showPlaylist)}>
        {showPlaylist ? "Hide Playlist" : "Show Playlist"}
      </Button>

      {showPlaylist && <SongList songs={songs} currentSong={currentSong} onSelect={selectSong} />}
    </div>
  )
}
