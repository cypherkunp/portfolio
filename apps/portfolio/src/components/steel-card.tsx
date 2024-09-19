import React from 'react';

export default function SteelCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-full overflow-hidden rounded-lg shadow-sm">
      <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 via-neutral-900 to-neutral-950" />

      {/* Metallic sheen */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white to-transparent opacity-20" />

      {/* Dynamic light reflection */}
      <div className="via-grey-300 absolute inset-0 animate-pulse bg-gradient-to-br from-transparent to-transparent opacity-20" />

      {/* Content container */}
      <div className="relative h-full font-sans">
        {/* Punched holes */}
        <Bolt className="absolute left-2 top-2" />
        <Bolt className="absolute right-2 top-2" />
        <Bolt className="absolute bottom-2 left-2" />
        <Bolt className="absolute bottom-2 right-2" />

        {/* Content */}
        <div className="px-4 py-10 text-neutral-950 md:px-12 md:py-4">{children}</div>
      </div>

      {/* Edge highlight */}
      <div className="pointer-events-none absolute inset-0 rounded-lg border border-white opacity-50" />
    </div>
  );
}

function Bolt({ className }: { className?: string }) {
  return (
    <div className={`${className} size-4 rounded-full shadow-sm shadow-gray-900`}>
      <div className="relative size-full rounded-full bg-gradient-to-br from-gray-300 to-gray-400 shadow-inner">
        <div className="absolute inset-1 rounded-full bg-gradient-to-br from-gray-500 to-gray-600" />
        <div className="absolute inset-2 flex items-center justify-center rounded-full bg-gradient-to-br from-gray-300 to-gray-500"></div>
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white to-transparent opacity-30" />
      </div>
    </div>
  );
}
