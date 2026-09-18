import { createFlagsDiscoveryEndpoint } from 'flags/next';
import { getProviderData } from '@flags-sdk/vercel';

import { vercelFlags } from '@/flags';

export const GET = createFlagsDiscoveryEndpoint(async () => {
  return getProviderData(vercelFlags);
});
