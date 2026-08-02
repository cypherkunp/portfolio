import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { assertAppEnabled, isAppEnabled, type AppFlagId } from '@/flags';

interface AppEnabledGateProps {
  id: AppFlagId;
  children: ReactNode;
}

/**
 * Asserts the app flag before rendering children.
 * Deliberately not Suspense-wrapped: disabled apps must 404 before child work starts.
 */
export async function AppEnabledGate({ id, children }: AppEnabledGateProps) {
  await assertAppEnabled(id);
  return children;
}

/** Keep gated routes out of search indexes when the flag is off. */
export async function appPageMetadata(id: AppFlagId, metadata: Metadata): Promise<Metadata> {
  if (!(await isAppEnabled(id))) {
    return { title: 'Not Found', robots: { index: false, follow: false } };
  }
  return metadata;
}
