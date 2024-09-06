import { cn } from '@/lib/utils';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export default function PageContainer({ children, className }: PageContainerProps) {
  return <main className={cn('pt-10 md:pt-20', className)}>{children}</main>;
}
