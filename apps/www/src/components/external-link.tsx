import Link from 'next/link';

import IconArrow from './icon-arrow';

export default function ExternalLink({ href, text = '' }: { href: string; text: string }) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-secondary inline-flex items-center gap-x-2 text-sm transition-colors hover:underline"
    >
      <IconArrow />
      {text}
    </Link>
  );
}
