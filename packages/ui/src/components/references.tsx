import { cn } from '../lib/utils';
import UnderlineText from './underline-text';

export interface ReferenceItem {
  author: string;
  url: string;
}

interface ReferencesProps {
  items: ReferenceItem[];
  title?: string;
  className?: string;
}

function displayUrl(url: string): string {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, '');
    const path = parsed.pathname === '/' ? '' : parsed.pathname.replace(/\/$/, '');
    return `${host}${path}${parsed.search}`;
  } catch {
    return url;
  }
}

export function References({ items, title = 'References', className }: ReferencesProps) {
  if (!items.length) return null;

  return (
    <section aria-label={title} className={cn('border-border mt-12 border-t pt-8', className)}>
      <h2 className="text-foreground mt-0 mb-4 scroll-m-20 text-lg font-bold tracking-tight">
        <UnderlineText>{title}</UnderlineText>
      </h2>
      <ol
        className={cn(
          'my-4 list-inside list-decimal space-y-2 pl-4',
          'text-foreground/90 text-base leading-relaxed',
          'marker:text-foreground/60 marker:font-normal',
        )}
      >
        {items.map(item => (
          <li key={`${item.author}-${item.url}`} className="wrap-break-words">
            <span className="text-foreground font-medium">{item.author}</span>
            <span className="text-foreground/50"> - </span>
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                'wrap-break-words font-medium text-blue-500 underline-offset-4 hover:underline',
                'dark:text-sky-400 dark:decoration-sky-400/40 hover:dark:text-sky-300',
              )}
            >
              {displayUrl(item.url)}
            </a>
          </li>
        ))}
      </ol>
    </section>
  );
}
