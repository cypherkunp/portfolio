'use client';

import { useState } from 'react';
import { Check, Copy, Pin } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardFooter, CardHeader } from '@/components/ui/card';
import { Empty, EmptyHeader, EmptyTitle } from '@/components/ui/empty';

type InspirationVariant = 'default' | 'highlight' | 'accent' | 'primary' | 'mono';
type InspirationTag =
  | 'craft'
  | 'product'
  | 'life'
  | 'engineering'
  | 'design'
  | 'leadership'
  | 'mindset';

interface InspirationItem {
  id: string;
  quote: string;
  author?: string;
  source?: string;
  tag: InspirationTag;
  variant?: InspirationVariant;
}

function quoteClassName(quote: string) {
  if (quote.length < 80) return 'text-lg leading-snug tracking-tight';
  return 'text-base leading-relaxed tracking-tight';
}

interface InspirationCardProps {
  item: InspirationItem;
  isCopied: boolean;
  onCopy: (item: InspirationItem) => void;
}

function InspirationCard({ item, isCopied, onCopy }: InspirationCardProps) {
  const isPinned = item.variant === 'highlight';
  const attribution = [item.author ? `— ${item.author}` : null, item.source]
    .filter(Boolean)
    .join(' · ');

  return (
    <Card className="mb-4 break-inside-avoid rounded-sm border-white/10 bg-transparent shadow-none">
      <CardHeader>
        {isPinned ? (
          <span
            className="mb-4 flex size-10 items-center justify-center self-end"
            aria-label="Pinned"
          >
            <Pin className="size-4" aria-hidden />
          </span>
        ) : null}
        <blockquote className={quoteClassName(item.quote)}>{item.quote}</blockquote>
      </CardHeader>
      <CardFooter className="gap-2">
        {attribution ? (
          <CardDescription className="min-w-0 flex-1">
            <cite className="not-italic">{attribution}</cite>
          </CardDescription>
        ) : null}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="ml-auto"
          onClick={() => onCopy(item)}
          aria-label={isCopied ? 'Copied' : 'Copy quote'}
        >
          {isCopied ? <Check /> : <Copy />}
        </Button>
      </CardFooter>
    </Card>
  );
}

export function InspirationGrid() {
  const t = useTranslations('Blocks.quotesBlock');
  const items = t.raw('content') as InspirationItem[];
  const emptyMessage = t('emptyState');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  async function copy(item: InspirationItem) {
    const suffix = item.author ? ` — ${item.author}` : '';
    try {
      await navigator.clipboard.writeText(`"${item.quote}"${suffix}`);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(c => (c === item.id ? null : c)), 1400);
    } catch {
      // noop
    }
  }

  if (items.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyTitle>{emptyMessage}</EmptyTitle>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
      {items.map(item => (
        <InspirationCard
          key={item.id}
          item={item}
          isCopied={copiedId === item.id}
          onCopy={copy}
        />
      ))}
    </div>
  );
}
