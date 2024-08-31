import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata } from 'next';

import Header from '@/components/header';
import '@/styles/globals.css';
import React from 'react';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { geistMono, geistSans } from '@/lib/font';
import { Button } from '@repo/ui/components/ui/button';

export const metadata: Metadata = {
  title: 'Portfolio',
  description: 'Portfolio of Devvrat Shukla',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <body className="container flex min-h-screen max-w-screen-lg scroll-my-12 flex-col overflow-auto bg-black">
        {/* <div className="main">
          <div className="gradient" />
        </div> */}
        <div className="lg:gap-140 flex flex-grow flex-col gap-72">{children}</div>
        <Button>Click me</Button>
        <Footer />
        <SpeedInsights />
      </body>
      <Analytics />
    </html>
  );
}
