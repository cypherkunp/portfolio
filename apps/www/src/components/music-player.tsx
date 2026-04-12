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
    <div className="flex min-h-0 flex-1 flex-col text-foreground lg:flex-row lg:gap-0">
      {/* Now playing panel */}
      <div className="flex flex-col items-center px-4 py-6 lg:flex-1 lg:items-center lg:justify-center lg:px-12 lg:py-8">
        {/* Album art */}
        <div className="relative aspect-square w-full max-w-xs overflow-hidden rounded-xl border border-border/90 bg-neutral-900/70 shadow-lg shadow-black/20 lg:max-w-md">
          <Image
            src={currentSong.cover || '/placeholder.svg'}
            alt={`${currentSong.title} cover`}
            fill
            sizes="(max-width: 1024px) 100vw, 448px"
            className="object-cover transition-transform duration-500 ease-out motion-reduce:transition-none lg:hover:scale-[1.02]"
            priority
          />
        </div>

        {/* Song info */}
        <div className="mt-5 w-full max-w-xs text-center lg:mt-8 lg:max-w-md">
          <h2 className="truncate text-xl font-semibold tracking-tight text-neutral-100 lg:text-2xl">
            {currentSong.title}
          </h2>
          <p className="mt-1.5 text-sm text-neutral-400">{currentSong.artist}</p>
        </div>

        {/* Progress */}
        <div className="mt-5 flex w-full max-w-xs items-center gap-3 lg:mt-7 lg:max-w-md">
          <span className="w-10 text-right text-xs tabular-nums text-neutral-500">
            {formatTime(currentTime)}
          </span>
          <Slider
            value={[currentTime]}
            max={duration || 1}
            step={1}
            onValueChange={handleProgressChange}
            className="flex-1"
            trackClassName="bg-neutral-700/60 h-1.5"
            rangeClassName="bg-primary"
            thumbClassName="h-4 w-4 border-primary bg-primary shadow-sm shadow-primary/30"
          />
          <span className="w-10 text-xs tabular-nums text-neutral-500">{formatTime(duration)}</span>
        </div>

        {/* Transport controls */}
        <div className="mt-5 flex w-full max-w-xs items-center justify-between lg:mt-6 lg:max-w-md">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsRepeat(!isRepeat)}
            className={cn(
              'h-9 w-9 text-neutral-400 hover:bg-neutral-800/80 hover:text-neutral-100',
              isRepeat && 'text-primary',
            )}
          >
            <Repeat className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 text-neutral-300 hover:bg-neutral-800/80 hover:text-neutral-50"
              onClick={skipPrev}
            >
              <SkipBack className="h-5 w-5" />
            </Button>

            <Button
              variant="default"
              size="icon"
              className="h-14 w-14 rounded-full shadow-md shadow-primary/15"
              onClick={togglePlay}
            >
              {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="ml-0.5 h-6 w-6" />}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 text-neutral-300 hover:bg-neutral-800/80 hover:text-neutral-50"
              onClick={skipNext}
            >
              <SkipForward className="h-5 w-5" />
            </Button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsShuffle(!isShuffle)}
            className={cn(
              'h-9 w-9 text-neutral-400 hover:bg-neutral-800/80 hover:text-neutral-100',
              isShuffle && 'text-primary',
            )}
          >
            <Shuffle className="h-4 w-4" />
          </Button>
        </div>

        {/* Volume */}
        <div className="mt-5 flex w-full max-w-xs items-center gap-3 lg:mt-6 lg:max-w-md">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0 text-neutral-400 hover:bg-neutral-800/80 hover:text-neutral-100"
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
            trackClassName="bg-neutral-700/60 h-1.5"
            rangeClassName="bg-neutral-300"
            thumbClassName="h-3.5 w-3.5 border-neutral-300 bg-neutral-300 shadow-sm"
          />
        </div>

        {/* Mobile playlist toggle */}
        <Button
          variant="ghost"
          className="mt-6 w-full max-w-xs border border-border/60 bg-neutral-900/40 text-neutral-200 hover:bg-neutral-800/70 hover:text-neutral-50 lg:hidden"
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
          'overflow-hidden border-border transition-all duration-300 lg:flex lg:w-88 lg:shrink-0 lg:flex-col lg:justify-center lg:border-l lg:border-t-0',
          'border-t lg:max-h-none',
          showMobilePlaylist ? 'max-h-[min(52vh,28rem)]' : 'max-h-0 lg:max-h-none',
        )}
      >
        <div className="flex min-h-0 flex-col bg-neutral-900/25 px-3 py-4 lg:bg-neutral-900/15 lg:px-5 lg:py-6">
          <h3 className="mb-3 text-[11px] font-semibold tracking-widest text-neutral-500 uppercase">
            Playlist
          </h3>
          <ul className="min-h-0 space-y-0.5 overflow-y-auto overscroll-contain pb-[env(safe-area-inset-bottom,0px)] lg:max-h-[calc(100dvh-10rem)]">
            {songs.map(song => (
              <li
                key={song.id}
                onClick={() => selectSong(song)}
                className={cn(
                  'flex cursor-pointer items-center gap-3 rounded-md px-2.5 py-2 transition-colors',
                  'hover:bg-neutral-800/50',
                  currentSong.id === song.id
                    ? 'bg-neutral-800/80 text-neutral-50'
                    : 'text-neutral-300',
                )}
              >
                <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded">
                  <Image
                    src={song.cover || '/placeholder.svg'}
                    alt={song.title}
                    width={40}
                    height={40}
                    className="h-full w-full object-cover"
                  />
                  {currentSong.id === song.id && isPlaying && (
                    <div className="absolute inset-0 flex items-center justify-center bg-primary/85">
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
                  <p className="truncate text-sm font-medium text-neutral-100">{song.title}</p>
                  <p className="truncate text-xs text-neutral-500">{song.artist}</p>
                </div>
                <span className="text-xs tabular-nums text-neutral-500">
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
