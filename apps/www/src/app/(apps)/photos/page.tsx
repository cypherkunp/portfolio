import type { Metadata } from 'next';
import Image from 'next/image';
import ProfilePic from '@/images/profile.jpg';
import { Bookmark, Grid3x3, MapPin, Tag } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { PHOTOS } from '@/config/photos';
import { ToolSubpageLayout } from '@/components/layout/tool-subpage-layout';
import { PhotoGrid } from '@/components/photos/photo-grid';

export const metadata: Metadata = {
  title: 'Photos',
  description: 'A visual journal of moments captured through my lens.',
};

const HANDLE = 'devvrat';
const INSTAGRAM_URL = 'https://instagram.com/cypherkunp';

export default async function PhotosPage() {
  const t = await getTranslations();
  const location = t('Common.contact.address');

  const totalPosts = PHOTOS.length;
  const places = new Set(PHOTOS.map(p => p.location).filter(Boolean)).size;
  const years = new Set(PHOTOS.map(p => new Date(p.date).getFullYear())).size;

  return (
    <ToolSubpageLayout flush>
      <div className="pb-16">
        <header className="flex flex-col gap-6 px-2 py-6 sm:flex-row sm:items-center sm:gap-12 sm:px-4 sm:py-10">
          <div className="shrink-0">
            <div className="rounded-full bg-linear-to-tr from-yellow-400 via-pink-500 to-purple-600 p-[3px]">
              <div className="rounded-full bg-neutral-950 p-[3px]">
                <Image
                  src={ProfilePic}
                  alt={HANDLE}
                  width={150}
                  height={150}
                  priority
                  className="size-[88px] rounded-full object-cover sm:size-[150px]"
                />
              </div>
            </div>
          </div>

          <div className="flex min-w-0 flex-1 flex-col gap-4">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
              <h1 className="text-xl font-light tracking-tight text-neutral-100">{HANDLE}</h1>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md bg-neutral-800/80 px-4 py-1.5 text-xs font-semibold text-neutral-100 transition-colors hover:bg-neutral-700"
              >
                Follow
              </a>
            </div>

            <ul className="flex flex-wrap gap-x-7 gap-y-1 text-sm text-neutral-400">
              <li>
                <span className="font-semibold text-neutral-100 tabular-nums">{totalPosts}</span>{' '}
                posts
              </li>
              <li>
                <span className="font-semibold text-neutral-100 tabular-nums">{places}</span> places
              </li>
              <li>
                <span className="font-semibold text-neutral-100 tabular-nums">{years}</span> years
              </li>
            </ul>

            <div className="flex flex-col gap-1 text-sm text-neutral-300">
              <p className="text-neutral-400">A visual Journal</p>
              <p className="flex items-center gap-1.5 text-xs text-neutral-500">
                <MapPin className="h-3 w-3" />
                {location}
              </p>
            </div>
          </div>
        </header>

        <div className="mt-2 border-t border-neutral-900">
          <nav className="-mt-px flex items-center justify-center gap-12 text-[11px] font-semibold tracking-[0.15em] text-neutral-400 uppercase">
            <span className="flex items-center gap-1.5 border-t border-neutral-100 py-3 text-neutral-100">
              <Grid3x3 className="h-3 w-3" />
              Posts
            </span>
            <span className="flex items-center gap-1.5 py-3 opacity-40">
              <Tag className="h-3 w-3" />
              Tagged
            </span>
            <span className="flex items-center gap-1.5 py-3 opacity-40">
              <Bookmark className="h-3 w-3" />
              Saved
            </span>
          </nav>
        </div>

        <PhotoGrid />
      </div>
    </ToolSubpageLayout>
  );
}
