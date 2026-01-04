import { ComponentPropsWithoutRef } from 'react';
import Link from 'next/link';
import { highlight } from 'sugar-high';

import { cn } from '@/lib/utils';
import { Callout } from '@/components/callout';
import { CodeBlockCommand } from '@/components/code-block-command';
import { CopyButton } from '@/components/copy-button';

type HeadingProps = ComponentPropsWithoutRef<'h1'>;
type ParagraphProps = ComponentPropsWithoutRef<'p'>;
type ListProps = ComponentPropsWithoutRef<'ul'>;
type ListItemProps = ComponentPropsWithoutRef<'li'>;
type AnchorProps = ComponentPropsWithoutRef<'a'>;
type BlockquoteProps = ComponentPropsWithoutRef<'blockquote'>;

const components = {
  h1: (props: HeadingProps) => <h1 className="mb-4 pt-12 text-xl" {...props} />,
  h2: (props: HeadingProps) => (
    <h2
      className="decoration-primary mb-3 mt-8 text-lg text-gray-800 underline dark:text-zinc-200"
      {...props}
    />
  ),
  h3: (props: HeadingProps) => (
    <h3 className="text-md mb-3 mt-8 text-gray-800 dark:text-zinc-200" {...props} />
  ),
  h4: (props: HeadingProps) => <h4 className="text-md" {...props} />,
  p: (props: ParagraphProps) => (
    <p className="text-md leading-snug text-gray-800 dark:text-zinc-300" {...props} />
  ),
  ol: (props: ListProps) => (
    <ol className="list-decimal space-y-2 pl-5 text-gray-800 dark:text-zinc-300" {...props} />
  ),
  ul: (props: ListProps) => (
    <ul className="list-disc space-y-1 pl-5 text-gray-800 dark:text-zinc-300" {...props} />
  ),
  li: (props: ListItemProps) => <li className="pl-1" {...props} />,
  em: (props: ComponentPropsWithoutRef<'em'>) => <em className="font-medium" {...props} />,
  strong: (props: ComponentPropsWithoutRef<'strong'>) => (
    <strong className="font-medium" {...props} />
  ),
  a: ({ href, children, ...props }: AnchorProps) => {
    const className =
      'text-blue-500 hover:text-blue-700 dark:text-gray-400 hover:dark:text-gray-300 dark:underline dark:underline-offset-2 dark:decoration-gray-800';
    if (href?.startsWith('/')) {
      return (
        <Link href={href} className={className} {...props}>
          {children}
        </Link>
      );
    }
    if (href?.startsWith('#')) {
      return (
        <a href={href} className={className} {...props}>
          {children}
        </a>
      );
    }
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className} {...props}>
        {children}
      </a>
    );
  },
  hr: ({ ...props }: React.ComponentProps<'hr'>) => <hr className=" my-4  md:my-8" {...props} />,
  pre: (props: ComponentPropsWithoutRef<'pre'>) => {
    return <pre className="overflow-x-auto rounded-lg bg-neutral-900 p-4 text-sm" {...props} />;
  },
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
  }: React.ComponentProps<'code'> & {
    __raw__?: string;
    __src__?: string;
    __npm__?: string;
    __yarn__?: string;
    __pnpm__?: string;
    __bun__?: string;
  }) => {
    // npm command.
    const isNpmCommand = __npm__ && __yarn__ && __pnpm__ && __bun__;
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

    // Code block (has language-* className).
    const isCodeBlock = className?.includes('language-');
    if (isCodeBlock) {
      // Extract string content from children
      const codeContent =
        typeof children === 'string'
          ? children
          : Array.isArray(children)
            ? children.map(c => (typeof c === 'string' ? c : String(c))).join('')
            : children != null
              ? String(children)
              : '';

      const trimmedContent = codeContent.trim();

      if (trimmedContent) {
        try {
          const highlightedCode = highlight(trimmedContent);
          return (
            <code
              className={cn('relative font-mono text-sm', className)}
              dangerouslySetInnerHTML={{ __html: highlightedCode }}
            />
          );
        } catch {
          // Fallback if highlighting fails
          return (
            <code className={cn('relative font-mono text-sm', className)}>{trimmedContent}</code>
          );
        }
      }
    }

    // Inline Code.
    if (typeof children === 'string') {
      return (
        <code
          className={cn(
            'bg-muted relative rounded-md px-[0.3rem] py-[0.2rem] font-mono text-[0.8rem] outline-none',
            className,
          )}
          {...props}
        >
          {children}
        </code>
      );
    }

    // Default codeblock.
    return (
      <>
        {__raw__ && <CopyButton value={__raw__} src={__src__} />}
        <code className={className} {...props}>
          {children}
        </code>
      </>
    );
  },
  Table: ({ data }: { data: { headers: string[]; rows: string[][] } }) => (
    <table>
      <thead>
        <tr>
          {data.headers.map((header, index) => (
            <th key={index}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.rows.map((row, index) => (
          <tr key={index}>
            {row.map((cell, cellIndex) => (
              <td key={cellIndex}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  ),
  blockquote: (props: BlockquoteProps) => (
    <blockquote
      className="border-l-3 ml-[0.075em] border-gray-300 pl-4 text-gray-700 dark:border-zinc-600 dark:text-zinc-300"
      {...props}
    />
  ),
  Callout,
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
