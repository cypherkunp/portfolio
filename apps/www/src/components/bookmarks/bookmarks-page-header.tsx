import Link from 'next/link';

interface BookmarksPageHeaderProps {
  title: string;
  description?: string;
  backHref?: string;
}

export function BookmarksPageHeader({ title, description, backHref }: BookmarksPageHeaderProps) {
  const parts = title.trim().split(/\s+/);
  const last = parts.pop() ?? title;
  const lead = parts.join(' ');

  return (
    <header className="flex flex-col gap-3 px-1 py-6 sm:gap-4 sm:py-10">
      {backHref ? (
        <Link
          href={backHref}
          className="w-fit text-[11px] font-medium tracking-[0.16em] text-neutral-500 uppercase hover:text-neutral-300"
        >
          Bookmarks
        </Link>
      ) : null}
      <h1 className="text-2xl font-light tracking-tight text-neutral-100 sm:text-4xl">
        {lead ? `${lead} ` : null}
        <span className="text-yellow-400 italic">{last}</span>
      </h1>
      {description ? (
        <p className="max-w-2xl text-sm leading-relaxed text-neutral-400 sm:text-base">
          {description}
        </p>
      ) : null}
    </header>
  );
}
