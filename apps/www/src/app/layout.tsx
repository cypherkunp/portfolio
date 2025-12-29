import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';

import { geistMono } from '@/lib/font';
import { Footer } from '@/components/layout/footer';
import { ThemeProvider } from '@/components/theme-provider';

import '@/styles/globals.css';

import Header from '@/components/layout/header';

export const metadata: Metadata = {
  title: 'Portfolio',
  description: 'Portfolio of Devvrat Shukla',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang="en" className={`${geistMono.className} antialiased`} suppressHydrationWarning>
      <body
        className="container relative z-10 mx-auto flex
          min-h-screen max-w-2xl scroll-my-12 flex-col overflow-auto bg-neutral-950 px-4 md:px-0"
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <Header className="mt-4 md:mt-10" />
            <div className="flex grow flex-col gap-72">{children}</div>
            <Footer className="mt-10 md:mt-20" />
          </ThemeProvider>
        </NextIntlClientProvider>

        <SpeedInsights />
      </body>
      <Analytics />
    </html>
  );
}
