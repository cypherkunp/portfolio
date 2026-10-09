import { Geist, Geist_Mono } from 'next/font/google';

// If loading a variable font, you don't need to specify the font weight
export const geist = Geist({
  subsets: ['latin'],
  display: 'swap',
});

export const geistMono = Geist_Mono({
  subsets: ['latin'],
  display: 'swap',
});
