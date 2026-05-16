'use client';

import { useEffect, useState } from 'react';
import { Check, Copy } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface CopyContactLinkProps {
  url: string;
  triggerLabel: string;
  copiedLabel: string;
}

export function CopyContactLink({ url, triggerLabel, copiedLabel }: CopyContactLinkProps) {
  const [hasCopied, setHasCopied] = useState(false);

  useEffect(() => {
    if (!hasCopied) return;
    const timer = setTimeout(() => setHasCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [hasCopied]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setHasCopied(true);
    } catch {
      // clipboard API may be unavailable; silently fail
    }
  }

  return (
    <Button
      type="button"
      size="lg"
      onClick={handleCopy}
      className="w-full bg-yellow-400 text-sm font-medium text-neutral-950 hover:bg-yellow-500"
      aria-live="polite"
    >
      {hasCopied ? <Check className="size-4" /> : <Copy className="size-4" />}
      {hasCopied ? copiedLabel : triggerLabel}
    </Button>
  );
}
