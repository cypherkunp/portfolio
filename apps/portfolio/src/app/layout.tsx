import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';

import { geistMono } from '@/lib/font';
import { Footer } from '@/components/layout/footer';
import Header from '@/components/layout/header';
import { ThemeProvider } from '@/components/theme-provider';

import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'Portfolio',
  description: 'Portfolio of Devvrat Shukla',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang="en" className={`${geistMono.className} antialiased`}>
      <body
        className="container relative z-10 flex min-h-screen
          max-w-screen-md scroll-my-12 flex-col overflow-auto bg-neutral-950"
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <Header />
            <div className="flex grow flex-col gap-72">{children}</div>
            <Footer />
          </ThemeProvider>
        </NextIntlClientProvider>

        <SpeedInsights />
      </body>
      <Analytics />
    </html>
  );
}
