import React from 'react';
import UnderlineText from './underline-text';

interface ContentBlockProps {
  title: string;
  description: string;
}

export default function ContentBlock({ title, description }: ContentBlockProps) {
  return (
    <div
      className="border-1 border-glow-stroke prose md:prose-lg lg:prose-lg dark:prose-invert prose-zinc flex flex-col
        gap-4 rounded-xl"
    >
      <h1 className="text-xl font-semibold text-white ">{title}</h1>
      <p className="text-md font-semibold text-white ">{description}</p>
    </div>
  );
}
