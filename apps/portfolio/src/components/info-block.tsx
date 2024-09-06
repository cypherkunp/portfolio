import React from 'react';
import UnderlineText from './underline-text';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { BackgroundGlow } from './background-glow';

interface InfoBlockProps {
  title: string;
  highlight: string;
  description: string;
  avatarUrl: string;
  avatarAlt: string;
}

export default function InfoBlock({
  title,
  highlight,
  description,
  avatarUrl,
  avatarAlt,
}: InfoBlockProps) {
  return (
    <div className="flex flex-col items-center gap-8 md:flex-row md:justify-start md:gap-16">
      <BackgroundGlow>
        <Avatar className="z-10 size-36 rounded-full md:size-48">
          <AvatarImage alt={avatarAlt} src={avatarUrl} />
          <AvatarFallback>{avatarAlt[0]}</AvatarFallback>
        </Avatar>
      </BackgroundGlow>
      <div className="flex flex-col items-center gap-2 md:items-start">
        <h1 className="text-2xl font-semibold text-white ">{title}</h1>
        <p className="text-md font-bold text-white ">{highlight}</p>
        <p className="md:text-md text-center text-sm text-white md:text-left ">{description}</p>
      </div>
    </div>
  );
}
