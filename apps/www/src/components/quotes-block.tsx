'use client';

import { useEffect, useState } from 'react';
import { ArrowLeftIcon, ArrowRightIcon, PauseIcon, PlayIcon } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';

import { RenderIf } from './render-if';

interface InspirationItem {
  id: string;
  quote: string;
  author?: string;
}

const quoteVariants = {
  initial: { y: 50, opacity: 0, rotateX: -15 },
  animate: { y: 0, opacity: 1, rotateX: 0 },
  exit: { y: -50, opacity: 0, rotateX: 15 },
};

const authorVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export default function QuotesBlock() {
  const t = useTranslations('Blocks.quotesBlock');
  const quotes = t.raw('content') as InspirationItem[];

  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isPlaying && quotes.length > 0) {
      interval = setInterval(() => {
        setCurrentQuoteIndex(prevIndex => (prevIndex + 1) % quotes.length);
      }, 5000);
    }

    return () => clearInterval(interval);
  }, [isPlaying, quotes.length]);

  const handlePrevious = () => {
    setCurrentQuoteIndex(prevIndex => (prevIndex - 1 + quotes.length) % quotes.length);
  };

  const handleNext = () => {
    setCurrentQuoteIndex(prevIndex => (prevIndex + 1) % quotes.length);
  };

  const togglePlayPause = () => {
    setIsPlaying(prev => !prev);
  };

  if (quotes.length === 0) return null;

  const current = quotes[currentQuoteIndex % quotes.length];

  return (
    <div className={`relative mx-auto w-full`}>
      <div className="flex h-48 items-center justify-center overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            variants={quoteVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{
              type: 'spring',
              stiffness: 100,
              damping: 15,
              mass: 1,
            }}
            className="text-center"
          >
            <motion.p
              className="text-secondary mb-4 text-xl font-bold md:text-lg md:font-semibold"
              transition={{
                type: 'spring',
                stiffness: 100,
                damping: 15,
                mass: 1,
              }}
            >
              {current.quote}
            </motion.p>
            <motion.p
              variants={authorVariants}
              transition={{
                type: 'spring',
                stiffness: 100,
                damping: 15,
                mass: 0.5,
                delay: 0.2,
              }}
              className="text-muted-foreground md:text-md p-1 text-sm"
            >
              {current.author ?? ''}
            </motion.p>
          </motion.div>
        </AnimatePresence>
      </div>

      <RenderIf condition={false}>
        <div className="flex justify-end space-x-2 pb-3">
          <Button variant="ghost" size="icon" className="rounded-full" onClick={handlePrevious}>
            <ArrowLeftIcon className="size-4" />
            <span className="sr-only">Previous quote</span>
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full" onClick={togglePlayPause}>
            {isPlaying ? <PauseIcon className="size-4" /> : <PlayIcon className="size-4" />}
            <span className="sr-only">{isPlaying ? 'Pause' : 'Play'}</span>
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full" onClick={handleNext}>
            <ArrowRightIcon className="size-4" />
            <span className="sr-only">Next quote</span>
          </Button>
        </div>
      </RenderIf>
    </div>
  );
}
