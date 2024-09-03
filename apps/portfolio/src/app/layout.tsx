import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata } from 'next';

import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { inter } from '@/lib/font';
import '@/styles/globals.css';
import React from 'react';
import { ThemeProvider } from '@/components/theme-provider';
import Header from '@/components/header';

export const metadata: Metadata = {
  title: 'Portfolio',
  description: 'Portfolio of Devvrat Shukla',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.className} antialiased`}>
      <body
        className="dark:bg-grid-small-white/[0.2] bg-grid-small-black/[0.2] container relative z-10 flex min-h-screen
          max-w-screen-lg scroll-my-12 flex-col overflow-auto bg-black"
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <Header />
          <div className="lg:gap-140 flex flex-grow flex-col gap-72">{children}</div>
          <Footer />
        </ThemeProvider>

        <SpeedInsights />
      </body>
      <Analytics />
    </html>
  );
}
