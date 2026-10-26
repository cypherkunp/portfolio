import { handleNpmProxy } from '@/lib/npm-proxy';

export type { NpmStreamRow } from '@/lib/npm-proxy';

export function POST(request: Request) {
  return handleNpmProxy(request);
}
