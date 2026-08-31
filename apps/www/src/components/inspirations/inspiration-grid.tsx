'use client';

import { useState } from 'react';
import { Check, Copy, Pin } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardFooter, CardHeader } from '@/components/ui/card';
import { Empty, EmptyHeader, EmptyTitle } from '@/components/ui/empty';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

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

interface TagFilter {
  id: InspirationTag | 'all';
  label: string;
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
  const tagFilters = t.raw('tagFilters') as TagFilter[];
  const emptyMessage = t('emptyState');

  const [activeTag, setActiveTag] = useState<InspirationTag | 'all'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filtered = activeTag === 'all' ? items : items.filter(i => i.tag === activeTag);

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

  return (
    <div className="flex flex-col gap-6">
      <ToggleGroup
        type="single"
        variant="default"
        value={activeTag}
        onValueChange={value => {
          if (value) setActiveTag(value as InspirationTag | 'all');
        }}
        className="w-full flex-wrap justify-start"
        aria-label="Filter quotes"
      >
        {tagFilters.map(filter => (
          <ToggleGroupItem
            key={filter.id}
            value={filter.id}
            className={cn(
              'min-h-11 text-muted-foreground hover:bg-transparent hover:text-foreground data-[state=on]:bg-transparent data-[state=on]:text-foreground data-[state=on]:shadow-none',
              activeTag === filter.id && 'decoration-primary',
            )}
          >
            {filter.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>

      {filtered.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyTitle>{emptyMessage}</EmptyTitle>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
          {filtered.map(item => (
            <InspirationCard
              key={item.id}
              item={item}
              isCopied={copiedId === item.id}
              onCopy={copy}
            />
          ))}
        </div>
      )}
    </div>
  );
}
