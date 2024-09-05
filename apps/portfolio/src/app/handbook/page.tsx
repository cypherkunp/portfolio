import { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import React from 'react';
import { allPosts } from 'content-collections';
import { MDXContent } from '@content-collections/mdx/react';

export const metadata: Metadata = {
  title: '',
  description: ' RESUME_DATA.summary',
};

export default function Page() {
  console.log('allpost', allPosts);
  return (
    <main className="flex flex-col items-start justify-start gap-20">
      <ul>
        {allPosts.map(post => (
          <li key={post._meta.path}>
            <a href={`/posts/${post._meta.path}`}>
              <h3>{post.title} </h3>
              <p>{post.summary}</p>
              <MDXContent code={post.mdx} />
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
}
