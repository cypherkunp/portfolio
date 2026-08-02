import { Suspense, type ReactNode } from 'react';
import { assertAppEnabled, type AppFlagId } from '@/flags';

interface AppEnabledGateProps {
  id: AppFlagId;
  children: ReactNode;
  fallback?: ReactNode;
}

async function AssertEnabled({ id, children }: { id: AppFlagId; children: ReactNode }) {
  await assertAppEnabled(id);
  return children;
}

/** Wraps flag checks so Cache Components can stream instead of blocking the route. */
export function AppEnabledGate({ id, children, fallback = null }: AppEnabledGateProps) {
  return (
    <Suspense fallback={fallback}>
      <AssertEnabled id={id}>{children}</AssertEnabled>
    </Suspense>
  );
}
