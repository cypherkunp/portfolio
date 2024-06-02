import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata } from 'next';

import Header from '@/components/header';
import '@/styles/globals.css';
import React from 'react';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { geistMono, geistSans } from '@/lib/font';

export const metadata: Metadata = {
  title: 'Portfolio',
  description: 'Portfolio of Devvrat Shukla',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <body className="bg-warm-black mx-auto flex min-h-screen w-full scroll-my-12 flex-col overflow-auto">
        <Header>
          <Navbar />
        </Header>
        <div className="lg:gap-140 container flex w-full flex-grow flex-col gap-72">{children}</div>
        <Footer />
        <SpeedInsights />
      </body>
      <Analytics />
    </html>
  );
}
