export function BookmarksSkeleton() {
  return (
    <div className="mt-2 border-t border-neutral-900 pt-6 sm:pt-10">
      <div className="grid gap-8 md:grid-cols-[220px_1fr]">
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-10 animate-pulse rounded-lg bg-neutral-900/50"
              style={{ animationDelay: `${i * 80}ms` }}
            />
          ))}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-56 animate-pulse rounded-2xl bg-neutral-900/40"
              style={{ animationDelay: `${i * 80}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
