'use client';

import Image from 'next/image';
import ProfilePic from '@/images/profile.jpg';
import { useTranslations } from 'next-intl';

import { FollowerPointerCard } from '@/components/ui/following-pointer';

import { Cover } from './ui/cover';

export default function InfoBlock() {
  const t = useTranslations();
  return (
    <Cover className="p-2">
      <div className="flex flex-col items-center gap-8 md:flex-row md:items-center md:justify-start md:gap-16">
        <FollowerPointerCard
          title={<Pointer title={t('HomePage.infoBlock.pointer.text')} avatar={ProfilePic.src} />}
        >
          <Image
            src={ProfilePic.src}
            alt={t('Common.contact.name')}
            className="size-[200px] rounded-full object-cover md:size-[200px] md:rounded-md"
            width={200}
            height={200}
          />
        </FollowerPointerCard>
        <div className="flex max-w-[350px] flex-col items-start gap-3 py-2 md:items-start">
          <h1 className="text-2xl font-semibold text-white ">{t('HomePage.infoBlock.title')}</h1>
          <p className="text-sm font-bold text-white ">{t('HomePage.infoBlock.highlight')}</p>
          <p className="text-xs text-white md:text-left md:text-sm ">
            {t('HomePage.infoBlock.description')}
          </p>{' '}
        </div>
      </div>
    </Cover>
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
