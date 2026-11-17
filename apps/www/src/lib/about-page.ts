import { PORTFOLIO_BASE_URL } from '@/config/site-data';

import en from '../../messages/en.json';

export function aboutPageHead() {
  const title = en.AboutPage.title;
  const description = en.AboutPage.description;
  const url = `${PORTFOLIO_BASE_URL}/about`;

  return {
    meta: [
      { title },
      { name: 'description', content: description },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:url', content: url },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
    ],
    links: [{ rel: 'canonical', href: url }],
  };
}
