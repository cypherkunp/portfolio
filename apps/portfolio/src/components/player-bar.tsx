"use client"

import { useState, useRef, useEffect } from "react"
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Repeat,
  Shuffle,
  Laptop,
  LayoutList,
  Maximize2,
} from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import type { Song } from "@/lib/types"
import { formatTime } from "@/lib/utils"

interface PlayerBarProps {
  currentSong: Song | null
  isPlaying: boolean
  onPlayPause: () => void
  onNext: () => void
  onPrevious: () => void
}

export default function PlayerBar({ currentSong, isPlaying, onPlayPause, onNext, onPrevious }: PlayerBarProps) {
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const [isMuted, setIsMuted] = useState(false)
  const [duration, setDuration] = useState(0)

  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio()
    }

    const audio = audioRef.current

    if (currentSong) {
      audio.src = currentSong.url
      audio.volume = isMuted ? 0 : volume

      if (isPlaying) {
        audio.play().catch((error) => {
          console.error("Error playing audio:", error)
        })
      } else {
        audio.pause()
      }

      setDuration(currentSong.duration)
    }

    const updateProgress = () => {
      setCurrentTime(audio.currentTime)
    }

    const handleEnded = () => {
      onNext()
    }

    audio.addEventListener("timeupdate", updateProgress)
    audio.addEventListener("ended", handleEnded)

    return () => {
      audio.removeEventListener("timeupdate", updateProgress)
      audio.removeEventListener("ended", handleEnded)
    }
  }, [currentSong, isPlaying, volume, isMuted, onNext])

  const handleProgressChange = (value: number[]) => {
    if (audioRef.current && currentSong) {
      const newTime = value[0]
      audioRef.current.currentTime = newTime
      setCurrentTime(newTime)
    }
  }

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0]
    setVolume(newVolume)

    if (audioRef.current) {
      audioRef.current.volume = newVolume
    }

    if (newVolume === 0) {
      setIsMuted(true)
    } else if (isMuted) {
      setIsMuted(false)
    }
  }

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume
      } else {
        audioRef.current.volume = 0
      }
      setIsMuted(!isMuted)
    }
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-zinc-800 px-4 py-3">
      <div className="flex items-center justify-between max-w-screen-xl mx-auto">
        {/* Now playing */}
        <div className="flex items-center w-1/4 min-w-[180px]">
          {currentSong ? (
            <div className="flex items-center gap-3">
              <img
                src={currentSong.cover || "/placeholder.svg"}
                alt={currentSong.title}
                className="w-14 h-14 object-cover"
              />
              <div className="overflow-hidden">
                <div className="font-medium text-sm truncate">{currentSong.title}</div>
                <div className="text-xs text-zinc-400 truncate">{currentSong.artist}</div>
              </div>
            </div>
          ) : (
            <div className="text-zinc-400 text-sm">Not playing</div>
          )}
        </div>

        {/* Player controls */}
        <div className="flex flex-col items-center justify-center flex-1 max-w-md gap-2">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white">
              <Shuffle className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white" onClick={onPrevious}>
              <SkipBack className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="bg-white text-black rounded-full hover:scale-105 transition-transform h-8 w-8"
              onClick={onPlayPause}
              disabled={!currentSong}
            >
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
            </Button>
            <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white" onClick={onNext}>
              <SkipForward className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white">
              <Repeat className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2 w-full">
            <span className="text-xs text-zinc-400 w-10 text-right">{formatTime(currentTime)}</span>
            <Slider
              value={[currentTime]}
              max={duration}
              step={1}
              onValueChange={handleProgressChange}
              className="flex-1"
              disabled={!currentSong}
            />
            <span className="text-xs text-zinc-400 w-10">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Volume controls */}
        <div className="flex items-center gap-2 w-1/4 justify-end">
          <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white">
            <LayoutList className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white">
            <Laptop className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-1 w-32">
            <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white" onClick={toggleMute}>
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
            <Slider
              value={[isMuted ? 0 : volume]}
              max={1}
              step={0.01}
              onValueChange={handleVolumeChange}
              className="flex-1"
            />
          </div>
          <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white">
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
