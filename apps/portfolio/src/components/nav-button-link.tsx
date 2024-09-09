import { cn } from '@/lib/utils';
import Link from 'next/link';
import { ArrowIcon } from '@/images/icons/arrow';

type NavButtonProps = {
  text: string;
  target: '_self' | '_blank';
  type: 'primary' | 'secondary';
  ring: boolean;
  href: string;
};

export default function NavButtonLink({ text, target, type, ring, href }: NavButtonProps) {
  return (
    <Link
      target={target}
      className={cn(
        `text-warm-black active:bg-warm-black md:hover:bg-warm-black ease duration-600 group inline-flex
        items-center justify-center gap-4 rounded-md px-4 py-1 font-bold`,
        {
          'bg-fluorescent-green': type === 'primary',
          'bg-warm-white': type === 'secondary',
          'ring-fluorescent-green ring-2 ring-offset-4 ring-offset-slate-900':
            ring && type === 'primary',
          'ring-warm-white ring-2 ring-offset-4 ring-offset-slate-900 transition-colors':
            ring && type === 'secondary',
        },
      )}
      href={href}
    >
      <span className="text-navLink ">{text}</span>
      <div
        className="ease relative top-[-1px] flex translate-x-0 justify-center leading-[100%] transition-transform
          duration-300 md:group-hover:translate-x-[2px]"
      >
        <ArrowIcon />
      </div>
    </Link>
  );
}
