import { Geist, Geist_Mono, Inter } from 'next/font/google';

// If loading a variable font, you don't need to specify the font weight
export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export const geist = Geist({
  subsets: ['latin'],
  display: 'swap',
});

export const geistMono = Geist_Mono({
  subsets: ['latin'],
  display: 'swap',
});
