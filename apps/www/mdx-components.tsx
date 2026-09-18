import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { highlight } from 'sugar-high';

import { cn } from '@/lib/utils';
import { Callout } from '@/components/callout';
import { CodeBlockCommand } from '@/components/code-block-command';
import { CopyButton } from '@/components/copy-button';
import { References } from '@/components/references';
import { Terminal } from '@/components/terminal';
import UnderlineText from '@/components/underline-text';

type HeadingProps = ComponentPropsWithoutRef<'h1'>;
type ParagraphProps = ComponentPropsWithoutRef<'p'>;
type ListProps = ComponentPropsWithoutRef<'ul'>;
type ListItemProps = ComponentPropsWithoutRef<'li'>;
type AnchorProps = ComponentPropsWithoutRef<'a'>;
type BlockquoteProps = ComponentPropsWithoutRef<'blockquote'>;
type MdxImageProps = ComponentPropsWithoutRef<'img'>;

function parseImageDimension(value: string | number | undefined): number | undefined {
  if (value === undefined) return undefined;
  if (typeof value === 'number') return Number.isFinite(value) && value > 0 ? value : undefined;
  const n = parseInt(value, 10);
  return Number.isFinite(n) && n > 0 ? n : undefined;
}

function getCodeText(children: ReactNode): string {
  if (typeof children === 'string') return children;
  if (Array.isArray(children)) {
    return children.map(child => (typeof child === 'string' ? child : String(child ?? ''))).join('');
  }
  if (children == null) return '';
  return String(children);
}

const headingClass = {
  h1: 'mt-0 mb-6 scroll-m-20 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl',
  h2: 'mt-10 mb-4 scroll-m-20 text-lg font-bold tracking-tight text-foreground first:mt-0',
  h3: 'mt-8 mb-2 scroll-m-20 text-base font-bold tracking-tight text-foreground',
  h4: 'mt-6 mb-2 scroll-m-20 text-lg font-semibold tracking-tight text-foreground',
  h5: 'mt-6 mb-2 scroll-m-20 text-base font-semibold tracking-tight text-foreground',
  h6: 'mt-4 mb-2 scroll-m-20 text-sm font-semibold tracking-tight text-muted-foreground',
} as const;

const bodyText = 'text-base leading-relaxed text-foreground/90';
const listBase = cn(
  'my-4 list-inside space-y-2 pl-4',
  bodyText,
  'marker:font-normal marker:text-foreground/60',
  '[&_ol]:my-2 [&_ul]:my-2 [&_ol]:pl-4 [&_ul]:pl-4',
);

const components = {
  h1: ({ className, ...props }: HeadingProps) => (
    <h1 className={cn(headingClass.h1, className)} {...props} />
  ),
  h2: ({ className, children, ...props }: HeadingProps) => (
    <h2 className={cn(headingClass.h2, className)} {...props}>
      <UnderlineText>{children}</UnderlineText>
    </h2>
  ),
  h3: ({ className, ...props }: HeadingProps) => (
    <h3 className={cn(headingClass.h3, className)} {...props} />
  ),
  h4: ({ className, ...props }: HeadingProps) => (
    <h4 className={cn(headingClass.h4, className)} {...props} />
  ),
  h5: ({ className, ...props }: HeadingProps) => (
    <h5 className={cn(headingClass.h5, className)} {...props} />
  ),
  h6: ({ className, ...props }: HeadingProps) => (
    <h6 className={cn(headingClass.h6, className)} {...props} />
  ),
  p: ({ className, ...props }: ParagraphProps) => (
    <p className={cn('my-4', bodyText, className)} {...props} />
  ),
  ol: ({ className, ...props }: ListProps) => (
    <ol className={cn(listBase, 'list-decimal', className)} {...props} />
  ),
  ul: ({ className, ...props }: ListProps) => (
    <ul className={cn(listBase, 'list-disc', className)} {...props} />
  ),
  li: ({ className, ...props }: ListItemProps) => (
    <li className={cn('wrap-break-words', className)} {...props} />
  ),
  em: ({ className, ...props }: ComponentPropsWithoutRef<'em'>) => (
    <em className={cn('italic', className)} {...props} />
  ),
  strong: ({ className, ...props }: ComponentPropsWithoutRef<'strong'>) => (
    <strong className={cn('font-semibold text-foreground', className)} {...props} />
  ),
  del: ({ className, ...props }: ComponentPropsWithoutRef<'del'>) => (
    <del className={cn('text-muted-foreground line-through', className)} {...props} />
  ),
  img: ({ src, alt, width, height, className }: MdxImageProps) => {
    if (!src || typeof src !== 'string') return null;
    const w = parseImageDimension(width);
    const h = parseImageDimension(height);
    return (
      <Image
        src={src}
        alt={alt ?? ''}
        width={w ?? 800}
        height={h ?? 450}
        className={cn('my-6 h-auto max-w-full rounded-lg', className)}
        sizes="(max-width: 768px) 100vw, 42rem"
      />
    );
  },
  a: ({ href, children, className, ...props }: AnchorProps) => {
    const linkClass = cn(
      'wrap-break-words font-medium text-blue-500 underline-offset-4 hover:underline',
      'dark:text-sky-400 dark:decoration-sky-400/40 hover:dark:text-sky-300',
      className,
    );
    if (href?.startsWith('/')) {
      return (
        <Link href={href} className={linkClass} {...props}>
          {children}
        </Link>
      );
    }
    if (href?.startsWith('#')) {
      return (
        <a href={href} className={linkClass} {...props}>
          {children}
        </a>
      );
    }
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={linkClass} {...props}>
        {children}
      </a>
    );
  },
  hr: ({ className, ...props }: ComponentPropsWithoutRef<'hr'>) => (
    <hr className={cn('my-8 border-border', className)} {...props} />
  ),
  pre: ({ className, children, ...props }: ComponentPropsWithoutRef<'pre'>) => (
    <pre
      className={cn(
        'my-6 overflow-x-auto rounded-lg border border-border bg-neutral-950 p-4 text-sm text-neutral-100',
        'dark:border-neutral-800',
        className,
      )}
      {...props}
    >
      {children}
    </pre>
  ),
  code: ({
    className,
    __raw__,
    __src__,
    __npm__,
    __yarn__,
    __pnpm__,
    __bun__,
    children,
    ...props
  }: ComponentPropsWithoutRef<'code'> & {
    __raw__?: string;
    __src__?: string;
    __npm__?: string;
    __yarn__?: string;
    __pnpm__?: string;
    __bun__?: string;
  }) => {
    const isNpmCommand = Boolean(__npm__ && __yarn__ && __pnpm__ && __bun__);
    if (isNpmCommand) {
      return (
        <CodeBlockCommand
          __npm__={__npm__}
          __yarn__={__yarn__}
          __pnpm__={__pnpm__}
          __bun__={__bun__}
        />
      );
    }

    const isCodeBlock = className?.includes('language-');
    if (isCodeBlock) {
      const trimmedContent = getCodeText(children).trim();
      if (!trimmedContent) return null;

      try {
        const highlightedCode = highlight(trimmedContent);
        return (
          <code
            className={cn('relative font-mono text-sm text-neutral-100', className)}
            dangerouslySetInnerHTML={{ __html: highlightedCode }}
          />
        );
      } catch {
        return (
          <code className={cn('relative font-mono text-sm text-neutral-100', className)}>
            {trimmedContent}
          </code>
        );
      }
    }

    if (typeof children === 'string') {
      return (
        <code
          className={cn(
            'relative rounded-md bg-muted px-[0.35rem] py-[0.15rem] font-mono text-[0.85em] text-foreground',
            className,
          )}
          {...props}
        >
          {children}
        </code>
      );
    }

    return (
      <>
        {__raw__ ? <CopyButton value={__raw__} src={__src__} /> : null}
        <code className={cn('font-mono text-sm', className)} {...props}>
          {children}
        </code>
      </>
    );
  },
  table: ({ className, ...props }: ComponentPropsWithoutRef<'table'>) => (
    <div className="my-6 w-full overflow-x-auto">
      <table
        className={cn('w-full min-w-md border-collapse text-left text-sm', className)}
        {...props}
      />
    </div>
  ),
  thead: ({ className, ...props }: ComponentPropsWithoutRef<'thead'>) => (
    <thead className={cn('border-b border-border bg-muted/40', className)} {...props} />
  ),
  tbody: ({ className, ...props }: ComponentPropsWithoutRef<'tbody'>) => (
    <tbody className={cn('[&_tr:last-child]:border-0', className)} {...props} />
  ),
  tr: ({ className, ...props }: ComponentPropsWithoutRef<'tr'>) => (
    <tr className={cn('border-b border-border', className)} {...props} />
  ),
  th: ({ className, ...props }: ComponentPropsWithoutRef<'th'>) => (
    <th
      className={cn('px-3 py-2 font-semibold text-foreground', className)}
      {...props}
    />
  ),
  td: ({ className, ...props }: ComponentPropsWithoutRef<'td'>) => (
    <td className={cn('px-3 py-2 align-top text-foreground/90', className)} {...props} />
  ),
  Table: ({ data }: { data: { headers: string[]; rows: string[][] } }) => (
    <div className="my-6 w-full overflow-x-auto">
      <table className="w-full min-w-md border-collapse text-left text-sm">
        <thead className="border-b border-border bg-muted/40">
          <tr>
            {data.headers.map((header, index) => (
              <th key={index} className="px-3 py-2 font-semibold text-foreground">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row, index) => (
            <tr key={index} className="border-b border-border">
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="px-3 py-2 align-top text-foreground/90">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ),
  blockquote: ({ className, ...props }: BlockquoteProps) => (
    <blockquote
      className={cn(
        'my-6 border-l-4 border-border pl-4 text-foreground/80 italic',
        '[&_p]:my-2 [&_p:first-child]:mt-0 [&_p:last-child]:mb-0',
        className,
      )}
      {...props}
    />
  ),
  Callout,
  References,
  Terminal,
};

declare global {
  type MDXProvidedComponents = typeof components;
}

export function useMDXComponents(): MDXProvidedComponents {
  return components;
}

export function getMDXComponents(): MDXProvidedComponents {
  return components;
}
