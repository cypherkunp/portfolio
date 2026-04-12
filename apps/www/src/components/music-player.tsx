'use client';

import { useEffect, useRef, useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Pause,
  Play,
  Repeat,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from 'lucide-react';

import Image from 'next/image';

import type { Song } from '@/lib/types';
import { cn, formatTime } from '@/lib/utils';
import { songs } from '@/config/songs';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

export default function MusicPlayer() {
  const [currentSong, setCurrentSong] = useState<Song>(songs[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [showMobilePlaylist, setShowMobilePlaylist] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isRepeatRef = useRef(isRepeat);
  const isShuffleRef = useRef(isShuffle);

  isRepeatRef.current = isRepeat;
  isShuffleRef.current = isShuffle;

  const getAudio = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.volume = volume;
      audioRef.current.preload = 'metadata';

      audioRef.current.addEventListener('timeupdate', () => {
        if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
      });

      audioRef.current.addEventListener('loadedmetadata', () => {
        if (audioRef.current && isFinite(audioRef.current.duration)) {
          setDuration(audioRef.current.duration);
        }
      });

      audioRef.current.addEventListener('durationchange', () => {
        if (audioRef.current && isFinite(audioRef.current.duration)) {
          setDuration(audioRef.current.duration);
        }
      });

      audioRef.current.addEventListener('ended', () => {
        if (isRepeatRef.current) {
          loadAndPlay(undefined);
        } else {
          skipNext();
        }
      });

      audioRef.current.addEventListener('error', () => {
        setIsPlaying(false);
      });
    }
    return audioRef.current;
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const loadAndPlay = (song: Song | undefined) => {
    const audio = getAudio();
    const target = song ?? currentSong;

    if (song) setCurrentSong(song);

    const targetHref = new URL(target.url, window.location.origin).href;
    if (audio.src !== targetHref) {
      setDuration(0);
      audio.src = target.url;
    }

    audio.currentTime = 0;
    audio.play().catch(() => setIsPlaying(false));
    setIsPlaying(true);
    setCurrentTime(0);
  };

  const togglePlay = () => {
    const audio = getAudio();
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      if (!audio.src || audio.src === window.location.origin + '/') {
        audio.src = currentSong.url;
      }
      audio.play().catch(() => setIsPlaying(false));
      setIsPlaying(true);
    }
  };

  const handleProgressChange = (value: number[]) => {
    if (audioRef.current) {
      const newTime = value[0];
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (audioRef.current) audioRef.current.volume = newVolume;
    if (newVolume > 0 && isMuted) setIsMuted(false);
  };

  const toggleMute = () => {
    setIsMuted(prev => {
      if (audioRef.current) audioRef.current.volume = prev ? volume : 0;
      return !prev;
    });
  };

  const getNextIndex = (direction: -1 | 1) => {
    const idx = songs.findIndex(s => s.id === currentSong.id);
    if (isShuffleRef.current) return Math.floor(Math.random() * songs.length);
    if (direction === -1) return idx <= 0 ? songs.length - 1 : idx - 1;
    return idx >= songs.length - 1 ? 0 : idx + 1;
  };

  const skipPrev = () => loadAndPlay(songs[getNextIndex(-1)]);
  const skipNext = () => loadAndPlay(songs[getNextIndex(1)]);
  const selectSong = (song: Song) => loadAndPlay(song);

  return (
    <div className="flex h-full flex-col lg:flex-row">
      {/* Now playing panel */}
      <div className="flex flex-col items-center justify-center px-4 py-6 lg:flex-1 lg:px-12 lg:py-0">
        {/* Album art */}
        <div className="bg-muted relative aspect-square w-full max-w-xs overflow-hidden rounded-xl shadow-2xl lg:max-w-md">
          <Image
            src={currentSong.cover || '/placeholder.svg'}
            alt={`${currentSong.title} cover`}
            fill
            sizes="(max-width: 1024px) 100vw, 448px"
            className="object-cover transition-all duration-500 hover:scale-105"
            priority
          />
        </div>

        {/* Song info */}
        <div className="mt-6 w-full max-w-xs text-center lg:max-w-md">
          <h2 className="truncate text-xl font-bold lg:text-2xl">{currentSong.title}</h2>
          <p className="text-muted-foreground mt-1 text-sm">{currentSong.artist}</p>
        </div>

        {/* Progress */}
        <div className="mt-6 flex w-full max-w-xs items-center gap-3 lg:max-w-md">
          <span className="text-muted-foreground w-10 text-right text-xs tabular-nums">
            {formatTime(currentTime)}
          </span>
          <Slider
            value={[currentTime]}
            max={duration || 1}
            step={1}
            onValueChange={handleProgressChange}
            className="flex-1"
          />
          <span className="text-muted-foreground w-10 text-xs tabular-nums">
            {formatTime(duration)}
          </span>
        </div>

        {/* Transport controls */}
        <div className="mt-4 flex w-full max-w-xs items-center justify-between lg:max-w-md">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsRepeat(!isRepeat)}
            className={cn('h-9 w-9', isRepeat && 'text-primary')}
          >
            <Repeat className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="h-10 w-10" onClick={skipPrev}>
              <SkipBack className="h-5 w-5" />
            </Button>

            <Button
              variant="default"
              size="icon"
              className="h-14 w-14 rounded-full"
              onClick={togglePlay}
            >
              {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="ml-0.5 h-6 w-6" />}
            </Button>

            <Button variant="ghost" size="icon" className="h-10 w-10" onClick={skipNext}>
              <SkipForward className="h-5 w-5" />
            </Button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsShuffle(!isShuffle)}
            className={cn('h-9 w-9', isShuffle && 'text-primary')}
          >
            <Shuffle className="h-4 w-4" />
          </Button>
        </div>

        {/* Volume */}
        <div className="mt-4 flex w-full max-w-xs items-center gap-2 lg:max-w-md">
          <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={toggleMute}>
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

        {/* Mobile playlist toggle */}
        <Button
          variant="ghost"
          className="mt-6 w-full max-w-xs lg:hidden"
          onClick={() => setShowMobilePlaylist(!showMobilePlaylist)}
        >
          {showMobilePlaylist ? (
            <>
              Hide playlist <ChevronUp className="ml-2 h-4 w-4" />
            </>
          ) : (
            <>
              Show playlist <ChevronDown className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>

      {/* Playlist panel - always visible on desktop, toggleable on mobile */}
      <div
        className={cn(
          'border-border overflow-hidden transition-all duration-300 lg:block lg:w-96 lg:border-l',
          showMobilePlaylist ? 'max-h-[500px]' : 'max-h-0 lg:max-h-none',
        )}
      >
        <div className="flex h-full flex-col p-4 lg:p-6">
          <h3 className="text-muted-foreground mb-4 text-xs font-semibold tracking-wider uppercase">
            Playlist
          </h3>
          <ul className="space-y-1 overflow-y-auto">
            {songs.map(song => (
              <li
                key={song.id}
                onClick={() => selectSong(song)}
                className={cn(
                  'hover:bg-muted flex cursor-pointer items-center gap-3 rounded-lg p-3 transition-colors',
                  currentSong.id === song.id && 'bg-muted',
                )}
              >
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded">
                  <Image
                    src={song.cover || '/placeholder.svg'}
                    alt={song.title}
                    width={40}
                    height={40}
                    className="h-full w-full object-cover"
                  />
                  {currentSong.id === song.id && isPlaying && (
                    <div className="bg-primary/80 absolute inset-0 flex items-center justify-center">
                      <span className="flex gap-0.5">
                        {[10, 14, 12].map((barHeight, i) => (
                          <span
                            key={i}
                            className="inline-block w-0.5 animate-pulse rounded-full bg-white"
                            style={{
                              height: `${barHeight}px`,
                              animationDelay: `${i * 0.15}s`,
                            }}
                          />
                        ))}
                      </span>
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{song.title}</p>
                  <p className="text-muted-foreground truncate text-xs">{song.artist}</p>
                </div>
                <span className="text-muted-foreground text-xs tabular-nums">
                  {currentSong.id === song.id && duration > 0 ? formatTime(duration) : '--:--'}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
