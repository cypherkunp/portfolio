'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';

import { FollowerPointerCard } from '@/components/ui/following-pointer';
import { Cover } from './ui/cover';
import ProfilePic from '@/images/profile.jpg';

export default function InfoBlock() {
  const t = useTranslations();
  return (
    <div className="flex flex-col items-start gap-8 md:flex-row md:items-center md:justify-start md:gap-16">
      <FollowerPointerCard
        title={<Pointer title={t('HomePage.infoBlock.pointer.text')} avatar={ProfilePic.src} />}
      >
        <Image
          src={ProfilePic.src}
          alt={t('Common.contact.name')}
          className="h-[400px] w-[400px] w-full rounded-md object-cover md:h-[200px] md:w-[200px]"
          width={200}
          height={200}
        />
      </FollowerPointerCard>
      <Cover className="">
        <div className="flex max-w-[350px] flex-col items-start gap-2 py-2 md:items-start">
          <h1 className="text-2xl font-semibold text-white ">{t('HomePage.infoBlock.title')}</h1>
          <p className="text-md font-bold text-white ">{t('HomePage.infoBlock.highlight')}</p>
          <p className="md:text-md text-sm text-white md:text-left ">
            {t('HomePage.infoBlock.description')}
          </p>{' '}
        </div>
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
