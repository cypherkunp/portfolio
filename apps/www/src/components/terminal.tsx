'use client';

import * as React from 'react';
import { IconCheck, IconCopy, IconTerminal } from '@tabler/icons-react';
import { highlight } from 'sugar-high';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { copyToClipboardWithMeta } from '@/components/copy-button';

interface TerminalProps {
  command: string;
  title?: string;
  className?: string;
}

export function Terminal({ command, title = 'Terminal', className }: TerminalProps) {
  const [hasCopied, setHasCopied] = React.useState(false);

  React.useEffect(() => {
    if (hasCopied) {
      const timeout = setTimeout(() => {
        setHasCopied(false);
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [hasCopied]);

  const handleCopy = () => {
    copyToClipboardWithMeta(command);
    setHasCopied(true);
  };

  // Apply syntax highlighting
  const trimmedCommand = command.trim();
  let highlightedCode: string;
  try {
    highlightedCode = highlight(trimmedCommand);
  } catch {
    // Fallback to plain text if highlighting fails
    highlightedCode = trimmedCommand;
  }

  return (
    <div
      className={cn('border-border/50 relative my-6 overflow-hidden rounded-lg border', className)}
    >
      {/* Header */}
      <div className="border-border/50 flex items-center gap-2 border-b bg-neutral-800/50 px-3 py-1.5">
        <div className="bg-foreground flex size-4 items-center justify-center rounded-[1px] opacity-70">
          <IconTerminal className="text-background size-3" />
        </div>
        <span className="text-foreground/90 text-sm">{title}</span>
      </div>

      {/* Content */}
      <div className="relative overflow-x-auto bg-neutral-900 px-8 py-6">
        <code className="font-mono text-sm" dangerouslySetInnerHTML={{ __html: highlightedCode }} />

        {/* Copy Button */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="absolute right-2 top-2 z-10 size-7 opacity-70 hover:opacity-100 focus-visible:opacity-100"
                onClick={handleCopy}
              >
                <span className="sr-only">Copy</span>
                {hasCopied ? <IconCheck className="size-4" /> : <IconCopy className="size-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{hasCopied ? 'Copied' : 'Copy to Clipboard'}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
