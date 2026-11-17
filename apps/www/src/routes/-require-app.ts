import { loadAppEnabled } from '@/server/apps';
import { notFound } from '@tanstack/react-router';

import type { AppId } from '@/lib/app-catalog';

export async function requireEnabledApp(id: AppId) {
  const isEnabled = await loadAppEnabled({ data: id });
  if (!isEnabled) throw notFound();
}
