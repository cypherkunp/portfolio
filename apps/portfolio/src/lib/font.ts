import { Inter, Satisfy } from 'next/font/google';

// If loading a variable font, you don't need to specify the font weight
export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export const pacifico = Satisfy({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400'],
});
