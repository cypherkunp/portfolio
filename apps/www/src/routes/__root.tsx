import type { ReactNode } from 'react';
import { ThemeProvider } from '@repo/ui/components/theme-provider';
import { geistMono } from '@repo/ui/lib/fonts';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { HeadContent, Outlet, Scripts, createRootRoute } from '@tanstack/react-router';
import { NextIntlClientProvider } from 'next-intl';

import { PORTFOLIO_BASE_URL } from '@/config/site-data';
import {
  OG_HOME_IMAGE,
  SITE_DESCRIPTION,
  SITE_LOCALE,
  SITE_NAME,
  THEME_COLOR,
  TWITTER_SITE,
} from '@/lib/seo';

import '@/styles/globals.css';
import '@/styles/start-fonts.css';

import { NotFound } from './-not-found';

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Devvrat | Portfolio' },
      { name: 'description', content: SITE_DESCRIPTION },
      { name: 'application-name', content: SITE_NAME },
      { name: 'theme-color', content: THEME_COLOR },
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: SITE_NAME },
      { property: 'og:locale', content: SITE_LOCALE },
      { property: 'og:title', content: 'Devvrat | Portfolio' },
      { property: 'og:description', content: SITE_DESCRIPTION },
      { property: 'og:url', content: PORTFOLIO_BASE_URL },
      { property: 'og:image', content: `${PORTFOLIO_BASE_URL}${OG_HOME_IMAGE.url}` },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:site', content: TWITTER_SITE },
      { name: 'twitter:creator', content: TWITTER_SITE },
      { name: 'twitter:title', content: 'Devvrat | Portfolio' },
      { name: 'twitter:description', content: SITE_DESCRIPTION },
      { name: 'twitter:image', content: `${PORTFOLIO_BASE_URL}${OG_HOME_IMAGE.url}` },
    ],
    links: [
      { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
      { rel: 'icon', href: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
      { rel: 'apple-touch-icon', href: '/apple-touch-icon.png', sizes: '180x180' },
      { rel: 'manifest', href: '/site.webmanifest' },
    ],
  }),
  component: RootComponent,
  notFoundComponent: NotFound,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="en-GB" className={`${geistMono.className} antialiased`} suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="bg-app-dots relative z-10 flex min-h-screen flex-col overflow-auto">
        <NextIntlClientProvider locale="en">
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
            {children}
          </ThemeProvider>
        </NextIntlClientProvider>
        <SpeedInsights />
        <Analytics />
        <Scripts />
      </body>
    </html>
  );
}
