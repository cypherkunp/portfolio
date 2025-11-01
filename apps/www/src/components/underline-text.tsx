import { cn } from '@/lib/utils';

type UnderlineTextProps = {
  children: React.ReactNode;
  className?: string;
};

export default function UnderlineText({ children, className }: UnderlineTextProps) {
  return <span className={cn('decoration-primary inline-block', className)}>{children}</span>;
}
