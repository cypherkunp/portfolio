import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import Header from '@/components/header';
import '@/styles/globals.css';
import React from 'react';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';

export const metadata: Metadata = {
  title: 'Portfolio',
  description: 'Portfolio of Devvrat Shukla',
};

// If loading a variable font, you don't need to specify the font weight
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <body className="bg-warm-black mx-auto flex min-h-screen w-full scroll-my-12 flex-col overflow-auto">
        <div className="medium-up large container sticky top-0 z-[100]">
          <Header>
            <Navbar />
          </Header>
        </div>
        <div className="lg:gap-140 container flex w-full flex-grow flex-col gap-72">{children}</div>
        <div className="pt-100 md:mt-140 container w-full overflow-hidden">
          <Footer />
        </div>
        <SpeedInsights />
      </body>
      <Analytics />
    </html>
  );
}
