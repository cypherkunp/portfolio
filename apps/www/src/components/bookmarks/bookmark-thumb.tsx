'use client';

import { useState } from 'react';

interface BookmarkThumbProps {
  src: string | null;
  title: string;
}

function Letter({ title }: { title: string }) {
  return (
    <span className="flex size-10 items-center justify-center rounded bg-neutral-900 text-xs font-medium text-neutral-500">
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
      width={40}
      height={40}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className="size-10 rounded object-cover"
    />
  );
}
