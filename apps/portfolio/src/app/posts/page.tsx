'use client';

import { useState } from 'react';

import PageContainer from '@/components/layout/page-container';

interface Post {
  title: string;
  description: string;
  readTime: string;
  date: string;
}

const posts: Post[] = [
  {
    title: 'The "GitHub Tree" structure',
    description: 'A convention for organizing your GitHub repository clones',
    readTime: '5min',
    date: 'Aug 2023',
  },
  {
    title: 'Introducing pkg-size.dev',
    description: 'A powerful online tool to analyze npm packages and their impact',
    readTime: '5min',
    date: 'Jul 2023',
  },
  {
    title: '4 reasons to avoid using `npm link`',
    description: 'The dangers of `npm link` and why you should use `npx link` instead',
    readTime: '10min',
    date: 'Apr 2022',
  },
  {
    title: '4 tips from my SWE promotion at Square',
    description: 'My learnings and advice for software engineers applying for their next promotion',
    readTime: '5min',
    date: 'Apr 2022',
  },
  {
    title: 'Why I built this website',
    description: 'Motivations behind making a website after not having one for so long.',
    readTime: '5min',
    date: 'Mar 2022',
  },
];

export default function PostsPage() {
  const [selectedPost, setSelectedPost] = useState<number | null>(null);

  return (
    <PageContainer className="mx-auto max-w-screen-md overflow-auto ">
      <h1 className="mb-8 text-4xl font-bold">Posts</h1>
      <div className="space-y-6">
        {posts.map((post, index) => (
          <div
            key={index}
            className={`cursor-pointer border-2 border-transparent p-4 transition-colors hover:rounded-md hover:border-2 hover:border-yellow-400 ${
              selectedPost === index ? 'border border-blue-500' : ''
            }`}
            onClick={() => setSelectedPost(index)}
          >
            <div className="mb-2 flex items-start justify-between">
              <h2 className="text-xl font-semibold">{post.title}</h2>
              <span className="text-sm font-bold text-neutral-400">{post.date}</span>
            </div>
            <p className="mb-2 text-neutral-400">{post.description}</p>
            <p className="text-sm text-neutral-500">{post.readTime}</p>
          </div>
        ))}
      </div>
    </PageContainer>
  );
}
