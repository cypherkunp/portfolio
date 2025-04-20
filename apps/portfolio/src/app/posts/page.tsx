'use client';

import { useEffect, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

import { Switch } from '@/components/ui/switch';
import PageContainer from '@/components/layout/page-container';

interface Post {
  title: string;
  description: string;
  readTime: string;
  date: string;
  tags?: string[];
}

const posts: Post[] = [
  {
    title: 'The "GitHub Tree" structure',
    description: 'A convention for organizing your GitHub repository clones',
    readTime: '5min',
    date: 'Aug 2023',
    tags: ['GitHub', 'Organization'],
  },
  {
    title: 'Introducing pkg-size.dev',
    description: 'A powerful online tool to analyze npm packages and their impact',
    readTime: '5min',
    date: 'Jul 2023',
    tags: ['npm', 'tool'],
  },
  {
    title: '4 reasons to avoid using `npm link`',
    description: 'The dangers of `npm link` and why you should use `npx link` instead',
    readTime: '10min',
    date: 'Apr 2022',
    tags: ['npm', 'link'],
  },
  {
    title: '4 tips from my SWE promotion at Square',
    description: 'My learnings and advice for software engineers applying for their next promotion',
    readTime: '5min',
    date: 'Apr 2022',
    tags: ['promotion', 'advice'],
  },
  {
    title: 'Why I built this website',
    description: 'Motivations behind making a website after not having one for so long.',
    readTime: '5min',
    date: 'Mar 2022',
    tags: ['website', 'motivation'],
  },
];

export default function PostsPage() {
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<number | null>(null);

  useEffect(() => {
    setAudioContext(new (window.AudioContext || (window as any).webkitAudioContext)());
  }, []);

  const playSound = (frequency: number, duration: number) => {
    if (!audioContext || !soundEnabled) return;
    // ... sound playing logic ...
  };

  const handleHover = () => playSound(500, 0.15);
  const handleClick = () => playSound(800, 0.2);

  const allTags = Array.from(new Set(posts.flatMap(post => post.tags || [])));
  const filteredPosts = selectedTag
    ? posts.filter(post => post.tags?.includes(selectedTag))
    : posts;

  return (
    <PageContainer className="mx-auto max-w-screen-md overflow-auto">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-4xl font-bold">Posts</h1>
        <div className="flex items-center">
          <Switch
            id="sound-toggle"
            checked={soundEnabled}
            onCheckedChange={setSoundEnabled}
            className="mr-2"
          />
          <label htmlFor="sound-toggle" className="cursor-pointer">
            {soundEnabled ? <Volume2 className="size-4" /> : <VolumeX className="size-4" />}
          </label>
        </div>
      </div>

      <div className="mb-8 space-y-4">
        {filteredPosts.map((post, index) => (
          <div
            key={index}
            className={`group cursor-pointer rounded-lg border py-4 transition-all 
              duration-300 hover:border-[#FFB800] hover:bg-[#FFB800]/5
              ${selectedPost === index ? 'border-blue-500' : 'border-transparent'}`}
            onMouseEnter={handleHover}
            onClick={() => {
              handleClick();
              setSelectedPost(index);
            }}
          >
            <div className="mb-2 flex items-start justify-between">
              <h2 className="text-xl font-semibold transition-colors group-hover:text-[#FFB800]">
                {post.title}
              </h2>
              <span className="text-sm font-bold text-neutral-400">{post.date}</span>
            </div>
            <p className="mb-2 text-neutral-400">{post.description}</p>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-neutral-500">{post.readTime}</span>
              {post.tags && (
                <div className="flex flex-wrap gap-1">
                  {post.tags.map((tag, tagIndex) => (
                    <span key={tagIndex} className="text-neutral-400 hover:text-neutral-300">
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
            className={`whitespace-nowrap rounded-full px-3 py-1 text-xs transition-colors ${
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
    </PageContainer>
  );
}
