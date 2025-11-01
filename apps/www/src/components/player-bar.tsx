'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Laptop,
  LayoutList,
  Maximize2,
  Pause,
  Play,
  Repeat,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from 'lucide-react';

import type { Song } from '@/lib/types';
import { formatTime } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

interface PlayerBarProps {
  currentSong: Song | null;
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

export default function PlayerBar({
  currentSong,
  isPlaying,
  onPlayPause,
  onNext,
  onPrevious,
}: PlayerBarProps) {
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }

    const audio = audioRef.current;

    if (currentSong) {
      audio.src = currentSong.url;
      audio.volume = isMuted ? 0 : volume;

      if (isPlaying) {
        audio.play().catch(error => {
          console.error('Error playing audio:', error);
        });
      } else {
        audio.pause();
      }

      setDuration(currentSong.duration);
    }

    const updateProgress = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      onNext();
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentSong, isPlaying, volume, isMuted, onNext]);

  const handleProgressChange = (value: number[]) => {
    if (audioRef.current && currentSong) {
      const newTime = value[0];
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);

    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }

    if (newVolume === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume;
      } else {
        audioRef.current.volume = 0;
      }
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 border-t border-zinc-800 bg-zinc-900 px-4 py-3">
      <div className="mx-auto flex max-w-screen-xl items-center justify-between">
        {/* Now playing */}
        <div className="flex w-1/4 min-w-[180px] items-center">
          {currentSong ? (
            <div className="flex items-center gap-3">
              <img
                src={currentSong.cover || '/placeholder.svg'}
                alt={currentSong.title}
                className="h-14 w-14 object-cover"
              />
              <div className="overflow-hidden">
                <div className="truncate text-sm font-medium">{currentSong.title}</div>
                <div className="truncate text-xs text-zinc-400">{currentSong.artist}</div>
              </div>
            </div>
          ) : (
            <div className="text-sm text-zinc-400">Not playing</div>
          )}
        </div>

        {/* Player controls */}
        <div className="flex max-w-md flex-1 flex-col items-center justify-center gap-2">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white">
              <Shuffle className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-zinc-400 hover:text-white"
              onClick={onPrevious}
            >
              <SkipBack className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full bg-white text-black transition-transform hover:scale-105"
              onClick={onPlayPause}
              disabled={!currentSong}
            >
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="ml-0.5 h-5 w-5" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-zinc-400 hover:text-white"
              onClick={onNext}
            >
              <SkipForward className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white">
              <Repeat className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex w-full items-center gap-2">
            <span className="w-10 text-right text-xs text-zinc-400">{formatTime(currentTime)}</span>
            <Slider
              value={[currentTime]}
              max={duration}
              step={1}
              onValueChange={handleProgressChange}
              className="flex-1"
              disabled={!currentSong}
            />
            <span className="w-10 text-xs text-zinc-400">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Volume controls */}
        <div className="flex w-1/4 items-center justify-end gap-2">
          <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white">
            <LayoutList className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white">
            <Laptop className="h-4 w-4" />
          </Button>
          <div className="flex w-32 items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="text-zinc-400 hover:text-white"
              onClick={toggleMute}
            >
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
  );
}
