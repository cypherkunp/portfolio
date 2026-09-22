import type { Metadata, Viewport } from 'next';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';

import { PORTFOLIO_BASE_URL } from '@/config/site-data';
import { geistMono } from '@/lib/font';
import {
  OG_HOME_IMAGE,
  SITE_DESCRIPTION,
  SITE_LOCALE,
  SITE_NAME,
  THEME_COLOR,
  TWITTER_SITE,
} from '@/lib/seo';
import { ThemeProvider } from '@/components/theme-provider';

import '@/styles/globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(PORTFOLIO_BASE_URL),
  title: {
    default: 'Devvrat | Portfolio',
    template: '%s',
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: 'Devvrat Shukla', url: PORTFOLIO_BASE_URL }],
  creator: 'Devvrat Shukla',
  alternates: {
    canonical: './',
  },
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    locale: SITE_LOCALE,
    images: [OG_HOME_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    site: TWITTER_SITE,
    creator: TWITTER_SITE,
    images: [OG_HOME_IMAGE.url],
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  manifest: '/site.webmanifest',
  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
  },
};

export const viewport: Viewport = {
  themeColor: THEME_COLOR,
  width: 'device-width',
  initialScale: 1,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang="en" className={`${geistMono.className} antialiased`} suppressHydrationWarning>
      <body className="bg-app-dots relative z-10 flex min-h-screen flex-col overflow-auto">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </NextIntlClientProvider>

        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
