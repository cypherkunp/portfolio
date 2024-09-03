import Link from 'next/link';

interface DockItem {
  title: string;
  icon: React.ReactNode;
  href: string;
}

interface SeparatorItem {
  type: 'separator';
}

interface FloatingDockProps {
  items: (DockItem | SeparatorItem)[];
  showLabels?: boolean;
}

export function FloatingDock({ items, showLabels = false }: FloatingDockProps) {
  return (
    <div
      className="flex items-center space-x-2 rounded-full bg-white/80 px-4 py-2 shadow-lg backdrop-blur-sm
        dark:bg-black/80"
    >
      {items.map((item, index) =>
        'type' in item ? (
          <div key={index} className="h-8 w-px bg-neutral-300 dark:bg-neutral-700" />
        ) : (
          <Link
            key={index}
            href={item.href}
            className="flex flex-col items-center justify-center rounded-full p-2 transition-colors hover:bg-neutral-100
              dark:hover:bg-neutral-800"
          >
            {item.icon}
            {showLabels && (
              <span className="mt-1 text-xs text-neutral-600 dark:text-neutral-400">
                {item.title}
              </span>
            )}
          </Link>
        ),
      )}
    </div>
  );
}
