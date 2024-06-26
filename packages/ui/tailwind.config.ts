import { Config } from 'tailwindcss';
import { shadcnPlugin } from './src/lib/shadcn-plugin';

const tailwindConfig = {
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: '',
  plugins: [shadcnPlugin],
} as Config;

export default tailwindConfig;
