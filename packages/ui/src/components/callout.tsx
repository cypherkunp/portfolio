import { cn } from '../lib/utils';
import { Alert, AlertDescription, AlertTitle } from './alert';

export function Callout({
  title,
  children,
  icon,
  className,
  variant = 'default',
  ...props
}: React.ComponentProps<typeof Alert> & {
  icon?: React.ReactNode;
  variant?: 'default' | 'info' | 'warning';
}) {
  return (
    <Alert
      data-variant={variant}
      className={cn('bg-background text-foreground mt-6 w-auto border md:-mx-1', className)}
      {...props}
    >
      {icon}
      {title && <AlertTitle className="mb-2">{title}</AlertTitle>}
      <AlertDescription
        className={cn(
          'text-card-foreground/80',
          '[&_ol]:my-0 [&_ol]:text-sm [&_ul]:my-0 [&_ul]:text-sm',
          '[&_li]:text-sm [&_p]:my-0',
        )}
      >
        {children}
      </AlertDescription>
    </Alert>
  );
}
