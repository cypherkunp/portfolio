'use client';

import { useMemo, useState } from 'react';
import { Bookmark, Check, Copy, Quote } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { pacifico } from '@/lib/font';
import { cn } from '@/lib/utils';

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

const VARIANT_CARD: Record<InspirationVariant, string> = {
  default:
    'border-neutral-800/80 bg-neutral-900/40 hover:border-neutral-700 hover:bg-neutral-900/60',
  highlight:
    'border-yellow-400/30 bg-gradient-to-br from-yellow-500/[0.06] via-neutral-900/30 to-neutral-950 hover:border-yellow-300/50',
  accent:
    'border-teal-400/25 bg-gradient-to-br from-teal-500/[0.05] via-neutral-900/30 to-neutral-950 hover:border-teal-300/45',
  primary:
    'border-pink-500/25 bg-gradient-to-br from-pink-500/[0.06] via-neutral-900/30 to-neutral-950 hover:border-pink-400/45',
  mono: 'border-neutral-700/70 bg-neutral-950 hover:border-neutral-500',
};

const VARIANT_QUOTE: Record<InspirationVariant, string> = {
  default: 'text-neutral-100',
  highlight: 'text-yellow-100',
  accent: 'text-teal-50',
  primary: 'text-pink-50',
  mono: 'font-mono text-emerald-300/90',
};

const VARIANT_GLYPH: Record<InspirationVariant, string> = {
  default: 'text-neutral-700',
  highlight: 'text-yellow-400/60',
  accent: 'text-teal-400/55',
  primary: 'text-pink-400/55',
  mono: 'text-emerald-500/40',
};

const VARIANT_AUTHOR: Record<InspirationVariant, string> = {
  default: 'text-neutral-500',
  highlight: 'text-yellow-300/70',
  accent: 'text-teal-300/70',
  primary: 'text-pink-300/70',
  mono: 'text-emerald-400/70',
};

function sizeForQuote(quote: string, variant: InspirationVariant) {
  if (variant === 'highlight')
    return quote.length < 80
      ? 'text-2xl leading-snug sm:text-3xl'
      : 'text-xl leading-snug sm:text-2xl';
  if (quote.length < 60) return 'text-lg leading-snug sm:text-xl';
  if (quote.length < 140) return 'text-base leading-relaxed sm:text-lg';
  return 'text-sm leading-relaxed sm:text-base';
}

export function InspirationGrid() {
  const t = useTranslations('Blocks.quotesBlock');
  const items = t.raw('content') as InspirationItem[];
  const tagFilters = t.raw('tagFilters') as TagFilter[];
  const emptyMessage = t('emptyState');

  const [activeTag, setActiveTag] = useState<InspirationTag | 'all'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filtered = useMemo(
    () => (activeTag === 'all' ? items : items.filter(i => i.tag === activeTag)),
    [items, activeTag],
  );

  const total = items.length;
  const authors = new Set(items.map(i => i.author).filter(Boolean)).size;
  const tags = new Set(items.map(i => i.tag)).size;

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
    <>
      <div className="scrollbar-hide -mx-2 mb-6 flex gap-1.5 overflow-x-auto px-2 sm:mb-8">
        {tagFilters.map(f => (
          <button
            key={f.id}
            onClick={() => setActiveTag(f.id)}
            className={cn(
              'shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-medium tracking-wide transition-all',
              activeTag === f.id
                ? 'border-neutral-100 bg-neutral-100 text-neutral-950'
                : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200',
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="columns-1 gap-4 sm:columns-2 sm:gap-5 lg:columns-3">
        {filtered.map(item => {
          const variant = (item.variant ?? 'default') as InspirationVariant;
          const isHighlight = variant === 'highlight';
          const isCopied = copiedId === item.id;

          return (
            <figure
              key={item.id}
              className={cn(
                'group relative mb-4 break-inside-avoid rounded-2xl border p-5 transition-all duration-300 sm:mb-5 sm:p-6',
                'hover:-translate-y-0.5 hover:shadow-[0_8px_30px_-12px_rgba(0,0,0,0.6)]',
                VARIANT_CARD[variant],
              )}
            >
              <Quote
                aria-hidden
                className={cn('mb-3 size-5 -scale-x-100 opacity-90', VARIANT_GLYPH[variant])}
              />

              <blockquote
                className={cn(
                  sizeForQuote(item.quote, variant),
                  VARIANT_QUOTE[variant],
                  'font-light tracking-tight',
                  isHighlight && pacifico.className,
                  isHighlight && 'font-normal',
                )}
              >
                {item.quote}
              </blockquote>

              {(item.author || item.source) && (
                <figcaption
                  className={cn(
                    'mt-5 flex flex-wrap items-baseline gap-x-2 text-xs',
                    VARIANT_AUTHOR[variant],
                  )}
                >
                  {item.author && (
                    <cite className="font-medium tracking-wide not-italic">— {item.author}</cite>
                  )}
                  {item.source && (
                    <span className="text-[11px] text-neutral-600">· {item.source}</span>
                  )}
                </figcaption>
              )}

              <div className="absolute inset-x-5 bottom-4 flex items-center justify-end sm:inset-x-6">
                <button
                  onClick={() => copy(item)}
                  aria-label={isCopied ? 'Copied' : 'Copy quote'}
                  className={cn(
                    'rounded-full border border-neutral-800 bg-neutral-950/80 p-1.5 text-neutral-500 opacity-0 backdrop-blur transition-all',
                    'hover:border-neutral-600 hover:text-neutral-200',
                    'group-hover:opacity-100 focus-visible:opacity-100',
                    isCopied && 'border-emerald-500/40 text-emerald-400 opacity-100',
                  )}
                >
                  {isCopied ? <Check className="size-3" /> : <Copy className="size-3" />}
                </button>
              </div>

              <div className="h-5" aria-hidden />
            </figure>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <p className="py-20 text-center text-sm text-neutral-500">{emptyMessage}</p>
      )}
    </>
  );
}
