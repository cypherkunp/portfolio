import React from 'react';

import { Navbar } from '../navbar';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/contact', label: 'Contact' },
];

export default function Header() {
  return (
    <header
      className="border-layout flex
      w-full flex-col items-start justify-between bg-neutral-950 p-0 md:flex-row
        md:pb-6 print:hidden"
    >
      <Navbar items={navItems} />
    </header>
  );
}
