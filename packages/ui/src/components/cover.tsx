'use client';

import React, { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';

import { cn } from '../lib/utils';
import { SparklesCore } from './sparkles';

export const Cover = ({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) => {
  const [hovered, setHovered] = useState(false);
  const reduceMotion = useReducedMotion();

  const ref = useRef<HTMLDivElement>(null);

  const [containerWidth, setContainerWidth] = useState(0);
  const [beamPositions, setBeamPositions] = useState<number[]>([]);

  useEffect(() => {
    if (ref.current) {
      setContainerWidth(ref.current?.clientWidth ?? 0);

      const height = ref.current?.clientHeight ?? 0;
      const numberOfBeams = Math.floor(height / 24);
      const positions = Array.from(
        { length: numberOfBeams },
        (_, i) => (i + 1) * (height / (numberOfBeams + 1)),
      );
      setBeamPositions(positions);
    }
  }, []);

  const showSparkles = hovered && !reduceMotion;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      ref={ref}
      className="group/cover relative inline-block rounded-sm bg-neutral-100 p-2 transition duration-200 hover:bg-neutral-900 dark:bg-neutral-900"
    >
      <AnimatePresence>
        {showSparkles && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              opacity: {
                duration: 0.2,
              },
            }}
            className="absolute inset-0 size-full overflow-hidden"
          >
            <motion.div
              animate={{
                translateX: ['-50%', '0%'],
              }}
              transition={{
                translateX: {
                  duration: 10,
                  ease: 'linear',
                  repeat: Infinity,
                },
              }}
              className="flex h-full w-[200%]"
            >
              <SparklesCore
                background="transparent"
                minSize={0.4}
                maxSize={1}
                particleDensity={500}
                className="size-full"
                particleColor="#FFFFFF"
              />
              <SparklesCore
                background="transparent"
                minSize={0.4}
                maxSize={1}
                particleDensity={500}
                className="size-full"
                particleColor="#FFFFFF"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {showSparkles
        ? beamPositions.map((position, index) => (
            <Beam
              key={index}
              hovered={hovered}
              duration={Math.random() * 2 + 1}
              delay={Math.random() * 2 + 1}
              width={containerWidth}
              style={{
                top: `${position}px`,
              }}
            />
          ))
        : null}
      <motion.span
        className={cn(
          'relative z-20 inline-block text-neutral-900 transition duration-200 group-hover/cover:text-white dark:text-white',
          className,
        )}
      >
        {children}
      </motion.span>
      <CircleIcon className="absolute top-[2px] right-[2px]" />
      <CircleIcon className="absolute right-[2px] bottom-[2px]" delay={0.4} />
      <CircleIcon className="absolute top-[2px] left-[2px]" delay={0.8} />
      <CircleIcon className="absolute bottom-[2px] left-[2px]" delay={1.6} />
    </div>
  );
};

export const Beam = ({
  className,
  delay,
  duration,
  hovered,
  width = 600,
  ...svgProps
}: {
  className?: string;
  delay?: number;
  duration?: number;
  hovered?: boolean;
  width?: number;
} & React.ComponentProps<typeof motion.svg>) => {
  const id = useId();

  return (
    <motion.svg
      width={width ?? '600'}
      height="1"
      viewBox={`0 0 ${width ?? '600'} 1`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('absolute inset-x-0 w-full', className)}
      {...svgProps}
    >
      <motion.path d={`M0 0.5H${width ?? '600'}`} stroke={`url(#svgGradient-${id})`} />

      <defs>
        <motion.linearGradient
          id={`svgGradient-${id}`}
          key={String(hovered)}
          gradientUnits="userSpaceOnUse"
          initial={{
            x1: '0%',
            x2: hovered ? '-10%' : '-5%',
            y1: 0,
            y2: 0,
          }}
          animate={{
            x1: '110%',
            x2: hovered ? '100%' : '105%',
            y1: 0,
            y2: 0,
          }}
          transition={{
            duration: hovered ? 0.5 : (duration ?? 2),
            ease: 'linear',
            repeat: Infinity,
            delay: hovered ? Math.random() * (1 - 0.2) + 0.2 : 0,
            repeatDelay: hovered ? Math.random() * (2 - 1) + 1 : (delay ?? 1),
          }}
        >
          <stop stopColor="#eab308" stopOpacity="0" />
          <stop stopColor="#eab308" stopOpacity="0.55" />
          <stop offset="1" stopColor="#eab308" stopOpacity="0" />
        </motion.linearGradient>
      </defs>
    </motion.svg>
  );
};

export const CircleIcon = ({ className, delay }: { className?: string; delay?: number }) => {
  return (
    <div
      className={cn(
        `group pointer-events-none size-2 animate-pulse rounded-full bg-neutral-600 opacity-20 group-hover/cover:hidden group-hover/cover:bg-white group-hover/cover:opacity-100 motion-reduce:animate-none dark:bg-white`,
        className,
      )}
      style={delay === undefined ? undefined : { animationDelay: `${delay}s` }}
    ></div>
  );
};
