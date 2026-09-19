import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['en'],

  // Used when no locale matches
  defaultLocale: 'en',

  // Locale prefix strategy - can be 'always', 'as-needed', or 'never'
  localePrefix: 'never',
});
