import { createServerFn } from '@tanstack/react-start';

import type { AppId } from '@/lib/app-catalog';
import { isAppEnabled } from '@/lib/app-flags';

export const loadAppEnabled = createServerFn({ method: 'GET' })
  .validator((id: AppId) => id)
  .handler(async ({ data }) => isAppEnabled(data));
