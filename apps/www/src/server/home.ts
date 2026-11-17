import { createServerFn } from '@tanstack/react-start';
import { featureAppsSupport } from '@/flags';

import { getEnabledApps } from '@/lib/app-flags';
import { getTimeSortedPosts } from '@/lib/post.utils';

export const loadHomeApps = createServerFn({ method: 'GET' }).handler(async () => {
  const [showApps, enabledApps] = await Promise.all([featureAppsSupport(), getEnabledApps()]);
  const posts = getTimeSortedPosts().map(post => ({
    slug: post.slug,
    title: post.metadata.title,
    publishedOn: post.metadata.publishedOn,
  }));

  return { showApps, enabledApps, posts };
});
