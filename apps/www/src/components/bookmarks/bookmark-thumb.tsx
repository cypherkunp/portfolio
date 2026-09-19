'use client';

import { useState } from 'react';

interface BookmarkThumbProps {
  src: string;
}

export function BookmarkThumb({ src }: BookmarkThumbProps) {
  const [failed, setFailed] = useState(false);

  if (failed) return null;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      width={32}
      height={32}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className="size-8 rounded-sm object-cover"
    />
  );
}
