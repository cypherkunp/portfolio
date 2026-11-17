'use client';

import React, { useEffect, useState } from 'react';

import { cn } from '../lib/utils';

export const InfiniteMovingCards = ({
  items,
  direction = 'left',
  speed = 'fast',
  pauseOnHover = true,
  className,
}: {
  items: {
    quote: string;
    name: string;
    title: string;
  }[];
  direction?: 'left' | 'right';
  speed?: 'fast' | 'normal' | 'slow';
  pauseOnHover?: boolean;
  className?: string;
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const scrollerRef = React.useRef<HTMLUListElement>(null);

  const [start, setStart] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const scroller = scrollerRef.current;
    if (!container || !scroller) return;

    if (scroller.dataset.cloned !== 'true') {
      Array.from(scroller.children).forEach(item => {
        scroller.appendChild(item.cloneNode(true));
      });
      scroller.dataset.cloned = 'true';
    }

    container.style.setProperty(
      '--animation-direction',
      direction === 'left' ? 'forwards' : 'reverse',
    );
    const duration = speed === 'fast' ? '20s' : speed === 'normal' ? '40s' : '80s';
    container.style.setProperty('--animation-duration', duration);
    setStart(true);
  }, [direction, speed]);
  return (
    <div
      ref={containerRef}
      className={cn(
        `scroller relative z-20 max-w-7xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]`,
        className,
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          'flex w-max min-w-full shrink-0 flex-nowrap gap-4 py-4',
          start && 'animate-scroll',
          pauseOnHover && 'hover:[animation-play-state:paused]',
        )}
      >
        {items.map(item => (
          <li
            className="relative w-[350px] max-w-full flex-shrink-0 rounded-2xl border border-b-0 border-slate-700 px-8 py-6 md:w-[450px]"
            style={{
              background: 'linear-gradient(180deg, var(--slate-800), var(--slate-900)',
            }}
            key={item.name}
          >
            <div className="flex items-center justify-center">
              <div
                aria-hidden="true"
                className="user-select-none pointer-events-none absolute -top-0.5 -left-0.5 -z-1 h-[calc(100%_+_4px)] w-[calc(100%_+_4px)]"
              ></div>
              <span className="relative z-20 text-sm leading-[1.6] font-normal text-gray-100">
                {item.quote}
              </span>
              <div className="relative z-20 mt-6 flex flex-row items-center">
                <span className="flex flex-col gap-1">
                  <span className="text-sm leading-[1.6] font-normal text-gray-400">
                    {item.name}
                  </span>
                  <span className="text-sm leading-[1.6] font-normal text-gray-400">
                    {item.title}
                  </span>
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
