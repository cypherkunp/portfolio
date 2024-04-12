import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/react';
import { Inter } from 'next/font/google';

import '@/styles/globals.css';
import React from 'react';

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
      <body>{children}</body>
      <Analytics />
    </html>
  );
}
