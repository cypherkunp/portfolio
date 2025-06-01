'use client';

import { useEffect, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

import { Switch } from '@/components/ui/switch';

interface BlogPost {
  title: string;
  description: string;
  readTime: string;
  date: string;
  tags?: string[];
}

export default function Component() {
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  useEffect(() => {
    setAudioContext(new (window.AudioContext || (window as any).webkitAudioContext)());
  }, []);

  const playSound = (frequency: number, duration: number) => {
    if (!audioContext || !soundEnabled) return;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.01);
    gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + duration);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
  };

  const handleHover = () => playSound(500, 0.15);
  const handleClick = () => playSound(800, 0.2);

  const posts: BlogPost[] = [
    {
      title: 'The "GitHub Tree" structure',
      description: 'A convention for organizing your GitHub repository clones',
      readTime: '5min',
      date: 'Aug 2023',
      tags: ['github', 'organization'],
    },
    {
      title: 'Introducing pkg-size.dev',
      description: 'A powerful online tool to analyze npm packages and their impact',
      readTime: '5min',
      date: 'Jul 2023',
      tags: ['npm', 'tools'],
    },
    {
      title: '4 reasons to avoid using `npm link`',
      description: 'The dangers of `npm link` and why you should use `npx link` instead',
      readTime: '10min',
      date: 'Apr 2022',
      tags: ['npm', 'development'],
    },
    {
      title: '4 tips from my SWE promotion at Square',
      description:
        'My learnings and advice for software engineers applying for their next promotion',
      readTime: '5min',
      date: 'Apr 2022',
      tags: ['career', 'advice'],
    },
    {
      title: 'Why I built this website',
      description: 'Motivations behind making a website after not having one for so long.',
      readTime: '5min',
      date: 'Mar 2022',
      tags: ['personal', 'web'],
    },
  ];

  const allTags = Array.from(new Set(posts.flatMap(post => post.tags || [])));

  const filteredPosts = selectedTag
    ? posts.filter(post => post.tags?.includes(selectedTag))
    : posts;

  return (
    <div className="min-h-screen bg-black p-2 text-white sm:p-4">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold sm:text-3xl">Posts</h1>
          <div className="flex items-center">
            <label htmlFor="sound-toggle" className="mr-2 cursor-pointer">
              {soundEnabled ? (
                <Volume2 className="h-4 w-4 text-gray-300" />
              ) : (
                <VolumeX className="h-4 w-4 text-gray-300" />
              )}
            </label>
            <Switch id="sound-toggle" checked={soundEnabled} onCheckedChange={setSoundEnabled} />
          </div>
        </div>

        <div className="mb-8 space-y-4">
          {filteredPosts.map((post, index) => (
            <div
              key={index}
              className="group cursor-pointer rounded-lg p-3 transition-all duration-300 hover:bg-[#FFB800]/5
                sm:p-4"
              onMouseEnter={handleHover}
              onClick={handleClick}
            >
              <div className="mb-1 flex flex-wrap items-baseline justify-between sm:mb-2">
                <h2 className="mr-2 text-base font-medium transition-colors group-hover:text-[#FFB800] sm:text-lg">
                  {post.title}
                </h2>
                <span className="whitespace-nowrap text-xs text-gray-400">{post.date}</span>
              </div>
              <p className="mb-2 text-sm text-gray-400">{post.description}</p>
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="text-gray-500">{post.readTime}</span>
                {post.tags && (
                  <div className="flex flex-wrap gap-1">
                    {post.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="font-mono text-gray-400 transition-colors hover:text-gray-300"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-2" role="list" aria-label="Post tags">
          {allTags.map((tag, index) => (
            <button
              key={index}
              onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
              className={`whitespace-nowrap rounded-full px-2 py-1 text-xs transition-colors sm:px-3 ${
                selectedTag === tag
                  ? 'bg-[#FFB800] text-black'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
              aria-pressed={selectedTag === tag}
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
