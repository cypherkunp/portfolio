import { cn } from '@/lib/utils';
import ConnectBlock from '@/components/connect-block';

export function Footer({ className }: { className?: string }) {
  return (
    <footer
      className={cn(
        'border-secondary flex flex-col items-center border-t pt-6',
        className,
      )}
    >
      <ConnectBlock />
    </footer>
  );
}
