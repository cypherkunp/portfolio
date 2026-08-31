'use client';

import { useState } from 'react';

interface BookmarkThumbProps {
  src: string | null;
  title: string;
}

function Letter({ title }: { title: string }) {
  return (
    <span className="flex size-8 items-center justify-center text-sm text-neutral-600 dark:text-neutral-400">
      {title.charAt(0).toUpperCase() || '·'}
    </span>
  );
}

export function BookmarkThumb({ src, title }: BookmarkThumbProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) return <Letter title={title} />;

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
