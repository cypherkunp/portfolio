'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@repo/ui/components/button';
import { Slider } from '@repo/ui/components/slider';
import UnderlineText from '@repo/ui/components/underline-text';
import { cn } from '@repo/ui/lib/utils';
import {
  Pause,
  Play,
  Repeat,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from 'lucide-react';

import { songs } from '@/config/songs';
import type { Song } from '@/lib/types';
import { formatTime } from '@/lib/utils';
import Image from '@/components/image';

function isCurrent(song: Song, current: Song) {
  return song.id === current.id;
}

export default function MusicPlayer() {
  const [currentSong, setCurrentSong] = useState<Song>(songs[0]!);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [durations, setDurations] = useState<Record<string, number>>({});
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);

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

  // Read the duration of every track up front so the list is not full of placeholders.
  useEffect(() => {
    const players = songs.map(song => {
      const audio = new Audio();
      audio.preload = 'metadata';
      audio.src = song.url;
      const onMetadata = () => {
        if (isFinite(audio.duration)) {
          setDurations(prev => ({ ...prev, [song.id]: audio.duration }));
        }
      };
      audio.addEventListener('loadedmetadata', onMetadata);
      return { audio, onMetadata };
    });

    return () => {
      for (const { audio, onMetadata } of players) {
        audio.removeEventListener('loadedmetadata', onMetadata);
        audio.src = '';
      }
    };
  }, []);

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
    const newTime = value[0] ?? 0;
    const audio = getAudio();
    if (!audio.src) audio.src = currentSong.url;
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0] ?? 0;
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
  const selectSong = (song: Song) => {
    if (isCurrent(song, currentSong)) {
      togglePlay();
      return;
    }
    loadAndPlay(song);
  };

  const albumLine = [currentSong.artist, currentSong.album].filter(Boolean).join(' · ');
  const totalDuration = durations[currentSong.id] ?? currentSong.duration ?? duration;

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end">
        <div className="border-border relative aspect-square w-36 shrink-0 overflow-hidden rounded-sm border bg-neutral-900 sm:w-44">
          <Image
            src={currentSong.cover}
            alt={`${currentSong.title} cover`}
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-xs text-neutral-600 dark:text-neutral-500">Now playing</p>
          <h2
            className="mt-1 truncate text-xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100"
            aria-live="polite"
          >
            {currentSong.title}
          </h2>
          <p className="mt-0.5 text-sm text-neutral-600 dark:text-neutral-500">{albumLine}</p>

          <div className="mt-5 flex items-center gap-3">
            <span className="w-10 text-right text-xs text-neutral-600 tabular-nums dark:text-neutral-500">
              {formatTime(currentTime)}
            </span>
            <Slider
              value={[currentTime]}
              max={totalDuration || 1}
              step={1}
              onValueChange={handleProgressChange}
              aria-label="Seek"
              className="flex-1"
              trackClassName="h-1 bg-neutral-800"
              rangeClassName="bg-neutral-200"
              thumbClassName="size-3 border-0 bg-neutral-200 focus-visible:ring-1"
            />
            <span className="w-10 text-xs text-neutral-600 tabular-nums dark:text-neutral-500">
              {totalDuration ? formatTime(totalDuration) : '–:––'}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={skipPrev}
          className="size-11 text-neutral-500 hover:bg-neutral-800/60 hover:text-neutral-100"
          aria-label="Previous track"
        >
          <SkipBack className="size-5" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={togglePlay}
          className="mx-1 size-12 rounded-full bg-neutral-100 text-neutral-900 hover:bg-white hover:text-neutral-900"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause className="size-5" /> : <Play className="ml-0.5 size-5" />}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={skipNext}
          className="size-11 text-neutral-500 hover:bg-neutral-800/60 hover:text-neutral-100"
          aria-label="Next track"
        >
          <SkipForward className="size-5" />
        </Button>

        <div className="ml-2 flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsRepeat(!isRepeat)}
            className={cn(
              'size-11 text-neutral-500 hover:bg-neutral-800/60 hover:text-neutral-100',
              isRepeat && 'text-yellow-400 hover:text-yellow-400',
            )}
            aria-label="Repeat"
            aria-pressed={isRepeat}
          >
            <Repeat className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsShuffle(!isShuffle)}
            className={cn(
              'size-11 text-neutral-500 hover:bg-neutral-800/60 hover:text-neutral-100',
              isShuffle && 'text-yellow-400 hover:text-yellow-400',
            )}
            aria-label="Shuffle"
            aria-pressed={isShuffle}
          >
            <Shuffle className="size-4" />
          </Button>
        </div>

        <div className="ml-auto flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMute}
            className="size-11 text-neutral-500 hover:bg-neutral-800/60 hover:text-neutral-100"
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
          </Button>
          <Slider
            value={[isMuted ? 0 : volume]}
            max={1}
            step={0.01}
            onValueChange={handleVolumeChange}
            aria-label="Volume"
            className="hidden w-24 sm:flex"
            trackClassName="h-1 bg-neutral-800"
            rangeClassName="bg-neutral-500"
            thumbClassName="size-3 border-0 bg-neutral-400"
          />
        </div>
      </div>

      <div>
        <h2 className="text-lg font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
          <UnderlineText>Tracks</UnderlineText>
        </h2>
        <ol className="mt-3 flex list-none flex-col">
          {songs.map((song, index) => {
            const active = isCurrent(song, currentSong);
            const songDuration = durations[song.id] ?? song.duration;

            return (
              <li key={song.id}>
                <button
                  type="button"
                  onClick={() => selectSong(song)}
                  aria-current={active ? 'true' : undefined}
                  aria-label={`${active && isPlaying ? 'Pause' : 'Play'} ${song.title}`}
                  className="group flex w-full items-center gap-2 py-2.5 text-left sm:gap-3"
                >
                  <span className="w-8 shrink-0 text-sm text-neutral-600 tabular-nums dark:text-neutral-400">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="relative size-8 shrink-0 overflow-hidden rounded-sm bg-neutral-900">
                    <Image src={song.cover} alt="" fill className="object-cover" />
                  </span>
                  <span
                    className={cn(
                      'min-w-0 truncate tracking-tight text-neutral-900 dark:text-neutral-100',
                      active
                        ? 'underline decoration-yellow-500 underline-offset-4'
                        : 'group-hover:underline group-hover:decoration-yellow-500 group-hover:underline-offset-4',
                    )}
                  >
                    {song.title}
                  </span>
                  <span className="hidden min-w-0 truncate text-sm text-neutral-600 sm:inline dark:text-neutral-500">
                    {song.artist}
                  </span>
                  <span className="ml-auto shrink-0 text-sm text-neutral-600 tabular-nums dark:text-neutral-500">
                    {songDuration ? formatTime(songDuration) : '–:––'}
                  </span>
                  <span className="hidden size-5 shrink-0 items-center justify-center text-neutral-500 opacity-40 transition-opacity group-hover:opacity-100 sm:flex [@media(hover:hover)_and_(pointer:fine)]:opacity-0">
                    {active && isPlaying ? (
                      <Pause className="size-3.5" />
                    ) : (
                      <Play className="size-3.5" />
                    )}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
