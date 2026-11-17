import { cn } from '../lib/utils';

interface ImageContractProps {
  title: string;
  widths: readonly number[];
}

function captionId(title: string) {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return `image-contract-${slug || 'widths'}`;
}

export function ImageContract({ title, widths }: ImageContractProps) {
  const fallback = widths.reduce(
    (max, width) => (width > max ? width : max),
    Number.NEGATIVE_INFINITY,
  );
  const hasFallback = Number.isFinite(fallback);
  const labelId = captionId(title);

  return (
    <figure
      aria-labelledby={labelId}
      className="border-border my-6 overflow-hidden rounded-lg border"
    >
      <figcaption
        id={labelId}
        className="border-border bg-muted/40 text-muted-foreground border-b px-3 py-1.5 font-mono text-xs"
      >
        {title}
      </figcaption>
      <ul className="flex flex-wrap gap-x-3 gap-y-2 px-4 py-4">
        {widths.map((width, index) => (
          <li
            key={`${width}-${index}`}
            className={cn(
              'text-foreground font-mono text-sm',
              hasFallback && width === fallback && 'border-b-2 border-yellow-500',
            )}
          >
            {width}
          </li>
        ))}
      </ul>
      {hasFallback ? (
        <p className="border-border text-muted-foreground border-t px-4 py-3 text-sm">
          Fallback src is {fallback}.
        </p>
      ) : null}
    </figure>
  );
}
