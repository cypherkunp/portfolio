'use client';

import { FollowerPointerCard } from '@/components/ui/following-pointer';
import Image from 'next/image';
import { Cover } from './ui/cover';

interface InfoBlockProps {
  title: string;
  pointerText: string;
  highlight: string;
  description: string;
  avatarUrl: string;
  avatarAlt: string;
}

export default function InfoBlock({
  pointerText,
  title,
  highlight,
  description,
  avatarUrl,
  avatarAlt,
}: InfoBlockProps) {
  return (
    <div className="flex flex-col items-start gap-8 md:flex-row md:items-center md:justify-start md:gap-16">
      <FollowerPointerCard title={<Pointer title={pointerText} avatar={avatarUrl} />}>
        <Image
          src={avatarUrl}
          alt={avatarAlt}
          className="rounded-md object-cover"
          width={200}
          height={200}
        />
      </FollowerPointerCard>
      <Cover className="flex max-w-[350px] flex-col items-start gap-2 py-2 md:items-start">
        <h1 className="text-2xl font-semibold text-white ">{title}</h1>
        <p className="text-md font-bold text-white ">{highlight}</p>
        <p className="md:text-md text-sm text-white md:text-left ">{description}</p>{' '}
      </Cover>
    </div>
  );
}

const Pointer = ({ title, avatar }: { title: string; avatar: string }) => (
  <div className="flex items-center space-x-2 rounded-full bg-sky-500 ">
    <Image
      src={avatar}
      height="20"
      width="20"
      alt="thumbnail"
      className="rounded-full border-2 border-white"
    />
    <p className="pr-2 ">{title}</p>
  </div>
);
