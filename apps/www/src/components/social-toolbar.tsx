'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Home, Instagram, MapPin, MoreVertical, Twitter, X, Youtube } from 'lucide-react';

const socialLinks = [
  {
    name: 'Home',
    icon: Home,
    target: '_self',
    href: '/',
    color: 'hover:text-blue-400',
  },
  {
    name: 'Twitter/X',
    icon: Twitter,
    target: '_blank',
    href: 'https://twitter.com',
    color: 'hover:text-gray-300',
  },
  {
    name: 'Instagram',
    icon: Instagram,
    target: '_blank',
    href: 'https://instagram.com',
    color: 'hover:text-pink-400',
  },
  {
    name: 'YouTube',
    icon: Youtube,
    target: '_blank',
    href: 'https://youtube.com',
    color: 'hover:text-red-400',
  },
  {
    name: 'Pinterest',
    icon: MapPin,
    target: '_blank',
    href: 'https://pinterest.com',
    color: 'hover:text-red-300',
  },
];

export function SocialToolbar() {
  const [showOverflow, setShowOverflow] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // For mobile, show first 4 icons, rest in overflow
  const visibleIcons = isMobile ? socialLinks.slice(0, 6) : socialLinks;
  const overflowIcons = isMobile ? socialLinks.slice(6) : [];

  return (
    <>
      {/* Mobile Version - Top Sticky */}
      <div className="z-50 mt-4 rounded-lg  bg-black/10 backdrop-blur-lg">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            {visibleIcons.map(social => {
              const IconComponent = social.icon;
              return (
                <Link
                  key={social.name}
                  href={social.href}
                  target={social.target}
                  rel="noopener noreferrer"
                  className={`rounded-full p-2 transition-all duration-200 hover:bg-white/10 ${social.color} text-white/80 hover:text-white`}
                  aria-label={social.name}
                >
                  <IconComponent size={18} />
                </Link>
              );
            })}

            {overflowIcons.length > 0 && (
              <button
                onClick={() => setShowOverflow(!showOverflow)}
                className="rounded-full p-2 text-white/80 transition-all duration-200 hover:bg-white/10 hover:text-white"
                aria-label="More social links"
              >
                <MoreVertical size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Mobile Overflow Menu */}
        {showOverflow && overflowIcons.length > 0 && (
          <div className="absolute inset-x-0 top-full border-b border-white/10 bg-black/60 shadow-lg backdrop-blur-lg">
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-2">
                {overflowIcons.map(social => {
                  const IconComponent = social.icon;
                  return (
                    <Link
                      key={social.name}
                      href={social.href}
                      target={social.target}
                      rel="noopener noreferrer"
                      className={`rounded-full p-2 transition-all duration-200 hover:bg-white/10 ${social.color} text-white/80 hover:text-white`}
                      aria-label={social.name}
                    >
                      <IconComponent size={18} />
                    </Link>
                  );
                })}
              </div>
              <button
                onClick={() => setShowOverflow(false)}
                className="rounded-full p-2 text-white/80 transition-all duration-200 hover:bg-white/10 hover:text-white"
                aria-label="Close overflow menu"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
