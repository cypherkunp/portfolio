'use client';

import * as React from 'react';
import { IconCheck, IconCopy, IconTerminal } from '@tabler/icons-react';

import { cn } from '../lib/utils';
import { Button } from './button';
import { copyToClipboardWithMeta } from './copy-button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';

function escapeHtml(text: string): string {
  return text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

export interface TerminalProps {
  command: string;
  title?: string;
  className?: string;
  /** Pre-highlighted code inner HTML from the server. Plain text is escaped. */
  codeHtml?: string;
}

export function Terminal({ command, title = 'Terminal', className, codeHtml }: TerminalProps) {
  const [hasCopied, setHasCopied] = React.useState(false);
  const html = codeHtml ?? escapeHtml(command.trim());

  React.useEffect(() => {
    if (!hasCopied) return;
    const timeout = setTimeout(() => setHasCopied(false), 2000);
    return () => clearTimeout(timeout);
  }, [hasCopied]);

  return (
    <div
      className={cn('border-border/50 relative my-6 overflow-hidden rounded-lg border', className)}
    >
      <div className="border-border/50 flex items-center justify-between border-b bg-neutral-800/50 px-3 py-1.5">
        <div className="flex items-center gap-2">
          <div className="bg-foreground flex size-4 items-center justify-center rounded-[1px] opacity-70">
            <IconTerminal className="text-background size-3" />
          </div>
          <span className="text-foreground/90 text-sm">{title}</span>
        </div>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="hover:bg-primary size-7 opacity-70 hover:opacity-100 focus-visible:opacity-100"
                onClick={() => {
                  copyToClipboardWithMeta(command);
                  setHasCopied(true);
                }}
              >
                <span className="sr-only">Copy</span>
                {hasCopied ? <IconCheck className="size-4" /> : <IconCopy className="size-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{hasCopied ? 'Copied' : 'Copy to Clipboard'}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="bg-neutral-900 px-8 py-6">
        <pre className="m-0">
          <code
            className="font-mono text-sm text-wrap"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </pre>
      </div>
    </div>
  );
}
