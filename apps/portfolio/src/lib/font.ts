import { Inter } from 'next/font/google';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';

// If loading a variable font, you don't need to specify the font weight
export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export const geistSans = GeistSans;
export const geistMono = GeistMono;
