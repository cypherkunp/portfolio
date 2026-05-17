'use client';

import { useState } from 'react';
import { Check, Share2 } from 'lucide-react';

import { cn } from '@/lib/utils';

interface ShareButtonProps {
  url: string;
  label?: string;
}

function absoluteUrl(path: string) {
  if (typeof window === 'undefined') return path;
  if (path.startsWith('http')) return path;
  return new URL(path, window.location.origin).toString();
}

export function ShareButton({ url, label = 'Share' }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  async function onShare() {
    const target = absoluteUrl(url);
    try {
      if (typeof navigator !== 'undefined' && 'share' in navigator) {
        await navigator.share({ url: target, title: label });
        return;
      }
    } catch {
      // user cancelled — fall back to copy
    }
    try {
      await navigator.clipboard.writeText(target);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      // noop
    }
  }

  return (
    <button
      onClick={onShare}
      aria-label={label}
      className={cn(
        'flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-medium tracking-wide transition-all',
        copied
          ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
          : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200',
      )}
    >
      {copied ? <Check className="size-3" /> : <Share2 className="size-3" />}
      <span className="hidden sm:inline">{copied ? 'Link copied' : label}</span>
    </button>
  );
}
