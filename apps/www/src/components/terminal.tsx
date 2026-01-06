'use client';

import * as React from 'react';
import { IconCheck, IconCopy, IconTerminal } from '@tabler/icons-react';
import { codeToHtml } from 'shiki';

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
  const [highlightedCode, setHighlightedCode] = React.useState<string>('');

  React.useEffect(() => {
    if (hasCopied) {
      const timeout = setTimeout(() => {
        setHasCopied(false);
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [hasCopied]);

  React.useEffect(() => {
    const highlight = async () => {
      try {
        const trimmedCommand = command.trim();
        const html = await codeToHtml(trimmedCommand, {
          lang: 'bash',
          theme: 'github-dark',
        });
        // Extract just the code content from shiki's HTML output
        const match = html.match(/<pre[^>]*><code[^>]*>([\s\S]*?)<\/code><\/pre>/);
        const codeContent = match ? match[1] : trimmedCommand;
        setHighlightedCode(codeContent);
      } catch {
        // Fallback to plain text if highlighting fails
        setHighlightedCode(command.trim());
      }
    };

    highlight();
  }, [command]);

  const handleCopy = () => {
    copyToClipboardWithMeta(command);
    setHasCopied(true);
  };

  return (
    <div
      className={cn('border-border/50 relative my-6 overflow-hidden rounded-lg border', className)}
    >
      {/* Header */}
      <div className="border-border/50 flex items-center justify-between border-b bg-neutral-800/50 px-3 py-1.5">
        <div className="flex items-center gap-2">
          <div className="bg-foreground flex size-4 items-center justify-center rounded-[1px] opacity-70">
            <IconTerminal className="text-background size-3" />
          </div>
          <span className="text-foreground/90 text-sm">{title}</span>
        </div>

        {/* Copy Button */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="hover:bg-primary size-7 opacity-70 hover:opacity-100 focus-visible:opacity-100"
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

      {/* Content */}
      <div className="  bg-neutral-900 px-8 py-6">
        <pre className="m-0">
          <code
            className="text-wrap font-mono text-sm"
            dangerouslySetInnerHTML={{ __html: highlightedCode }}
          />
        </pre>
      </div>
    </div>
  );
}
