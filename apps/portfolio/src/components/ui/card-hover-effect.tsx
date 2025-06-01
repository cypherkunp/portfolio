import { useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRightIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

interface Item {
  title: string;
  description: string;
  link: string | undefined;
}

interface HoverEffectProps {
  items: Item[];
  className?: string;
}

interface CardProps {
  className?: string;
  children: React.ReactNode;
}

export function HoverEffect({ items, className }: HoverEffectProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className={cn('grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3', className)}>
      {items.map((item, idx) => (
        <Link
          href={item.link ?? '#'}
          key={item.title}
          className="group relative block h-[200px] w-full md:h-[250px]"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                className="absolute inset-0 block h-[200px] w-full rounded-3xl bg-neutral-200 md:h-[250px]
                  dark:bg-slate-800/[0.8]"
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration: 0.15 } }}
                exit={{ opacity: 0, transition: { duration: 0.15, delay: 0.2 } }}
              />
            )}
          </AnimatePresence>
          <Card>
            <CardTitle>
              {item.title} <ArrowRightIcon className="ml-[2px] inline-block size-4" />
            </CardTitle>
            <CardDescription>{item.description}</CardDescription>
          </Card>
        </Link>
      ))}
    </div>
  );
}

function Card({ className, children }: CardProps) {
  return (
    <div
      className={cn(
        `bg-tertiary relative z-20 h-[200px] w-full overflow-hidden rounded-2xl border border-transparent p-2	shadow-sm
        md:h-[250px]`,
        'group-hover:border-slate-700 dark:border-white/[0.2]',
        className,
      )}
    >
      <div className="relative z-50 p-4">{children}</div>
    </div>
  );
}

function CardTitle({ className, children }: CardProps) {
  return (
    <h4 className={cn('mt-4 text-xl font-bold tracking-wide text-zinc-100', className)}>
      {children}
    </h4>
  );
}

function CardDescription({ className, children }: CardProps) {
  return (
    <p className={cn('mt-8 text-sm leading-relaxed tracking-wide text-zinc-300', className)}>
      {children}
    </p>
  );
}

export { Card, CardTitle, CardDescription };
