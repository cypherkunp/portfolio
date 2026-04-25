import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';

import { geistMono } from '@/lib/font';
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
