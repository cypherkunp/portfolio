'use client';

import * as React from 'react';
import { IconCheck, IconCopy } from '@tabler/icons-react';

import { cn } from '../lib/utils';
import { Button } from './button';
import { copyToClipboardWithMeta } from './copy-button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';

const LANGUAGE_LABEL: Record<string, string> = {
  bash: 'Bash',
  css: 'CSS',
  html: 'HTML',
  js: 'JavaScript',
  json: 'JSON',
  jsx: 'JSX',
  md: 'Markdown',
  mdx: 'MDX',
  sh: 'Shell',
  text: 'Text',
  ts: 'TypeScript',
  tsx: 'TSX',
  txt: 'Text',
};

/** Characters before a line wraps. `false` keeps the line on one row. */
export const defaultCodeWrap = 100;

export interface CodeBlockProps extends Omit<React.ComponentProps<'pre'>, 'title'> {
  icon?: React.ReactNode;
  title?: string;
  language?: string;
  wrapAt?: number | false;
}

function isSvgIcon(icon: React.ReactNode): icon is string {
  return typeof icon === 'string' && icon.startsWith('<svg') && !icon.toLowerCase().includes('<script');
}

function labelFor(language?: string, title?: string) {
  if (title) return title;
  if (!language) return 'Code';
  return LANGUAGE_LABEL[language] ?? language;
}

function resolveWrap(wrapAt: number | false | undefined): number | false {
  if (wrapAt === false) return false;
  if (wrapAt === undefined) return defaultCodeWrap;
  if (!Number.isFinite(wrapAt) || wrapAt <= 0) return defaultCodeWrap;
  return wrapAt;
}

export function CodeBlock({
  icon,
  title,
  language,
  wrapAt,
  className,
  style,
  children,
  tabIndex,
  ...props
}: CodeBlockProps) {
  const preRef = React.useRef<HTMLPreElement>(null);
  const [hasCopied, setHasCopied] = React.useState(false);
  const label = labelFor(language, title);
  const wrap = resolveWrap(wrapAt);

  React.useEffect(() => {
    if (!hasCopied) return;
    const timeout = setTimeout(() => setHasCopied(false), 2000);
    return () => clearTimeout(timeout);
  }, [hasCopied]);

  return (
    <figure
      data-language={language}
      dir="ltr"
      className="border-border my-6 overflow-hidden rounded-lg border"
    >
      <div className="border-border bg-muted/40 flex items-center justify-between gap-2 border-b px-3 py-1.5">
        <div className="flex min-w-0 items-center gap-2">
          {isSvgIcon(icon) ? (
            <span
              aria-hidden
              className="text-muted-foreground size-4 shrink-0 [&_svg]:size-4"
              dangerouslySetInnerHTML={{ __html: icon }}
            />
          ) : null}
          <span className="text-muted-foreground truncate font-mono text-xs">{label}</span>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="size-7 shrink-0 opacity-70 hover:opacity-100"
                onClick={() => {
                  copyToClipboardWithMeta(preRef.current?.textContent ?? '');
                  setHasCopied(true);
                }}
              >
                <span className="sr-only">Copy</span>
                {hasCopied ? <IconCheck /> : <IconCopy />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{hasCopied ? 'Copied' : 'Copy to Clipboard'}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <pre
        {...props}
        ref={preRef}
        tabIndex={tabIndex}
        style={
          wrap === false
            ? style
            : {
                ...style,
                ['--code-wrap' as string]: String(wrap),
              }
        }
        className={cn(
          'shiki m-0 px-4 py-3 font-mono text-sm',
          wrap === false ? 'overflow-x-auto' : 'wrap-code',
          className,
        )}
      >
        {children}
      </pre>
    </figure>
  );
}
