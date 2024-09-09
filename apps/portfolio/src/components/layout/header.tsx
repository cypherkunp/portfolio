import React from 'react';
import { Navbar } from '../navbar';

export default function Header() {
  return (
    <header
      className="border-layout dark:bg-grid-small-white/[0.1] bg-grid-small-black/[0.1] sticky top-0 z-[100] flex
        h-[80px] w-full flex-col items-start justify-between bg-neutral-950 py-6 hover:border-rose-300
        md:flex-row print:hidden"
    >
      <Navbar />
    </header>
  );
}
