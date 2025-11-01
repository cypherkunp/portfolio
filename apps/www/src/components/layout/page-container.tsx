import { cn } from '@/lib/utils';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export default function PageContainer({ children, className }: PageContainerProps) {
  return <main className={cn('pt-5 md:pt-10', className)}>{children}</main>;
}
