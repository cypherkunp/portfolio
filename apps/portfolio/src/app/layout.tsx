import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';

import { Footer } from '@/components/footer';
import { inter } from '@/lib/font';
import '@/styles/globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import Header from '@/components/header';

export const metadata: Metadata = {
  title: 'Portfolio',
  description: 'Portfolio of Devvrat Shukla',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang="en" className={`${inter.className} antialiased`}>
      <body
        className="dark:bg-grid-small-white/[0.2] bg-grid-small-black/[0.2] container relative z-10 flex min-h-screen
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
            <div className="flex flex-grow flex-col gap-72">{children}</div>
            <Footer />
          </ThemeProvider>
        </NextIntlClientProvider>

        <SpeedInsights />
      </body>
      <Analytics />
    </html>
  );
}
