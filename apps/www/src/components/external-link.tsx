import Link from 'next/link';

import IconArrow from './icon-arrow';

export default function ExternalLink({ href, text = '' }: { href: string; text: string }) {
  const isMail = href.startsWith('mailto:');

  return (
    <Link
      href={href}
      target={isMail ? undefined : '_blank'}
      rel={isMail ? undefined : 'noopener noreferrer'}
      className="text-secondary inline-flex items-center gap-x-2 text-sm transition-colors hover:underline"
    >
      <IconArrow />
      {text}
    </Link>
  );
}
