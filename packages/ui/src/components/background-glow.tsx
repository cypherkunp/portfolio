import React from 'react';

interface BackgroundGlowProps {
  children: React.ReactNode;
  className?: string;
}

export function BackgroundGlow({ children, className = '' }: BackgroundGlowProps) {
  return (
    <div className="relative">
      <div className={`animate-glow-change absolute inset-0 rounded-full ${className}`}></div>
      {children}
    </div>
  );
}
