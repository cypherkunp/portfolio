import { Config } from 'tailwindcss';
import { shadcnPlugin } from '@repo/ui/lib/shadcn-plugin';

const tailwindConfig = {
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: '',
  plugins: [shadcnPlugin],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-geist-sans)'],
        mono: ['var(--font-geist-mono)'],
      },
    },
  },
} as Config;

export default tailwindConfig;
