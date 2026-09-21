export function PageSkeleton({ cards = 4 }: { cards?: number }) {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <div className="h-7 w-48 animate-pulse rounded-lg bg-cream-300" />
        <div className="h-4 w-72 animate-pulse rounded-lg bg-cream-300" />
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: cards }).map((_, i) => (
          <div
            key={i}
            className="h-24 animate-pulse rounded-2xl border border-cream-300 bg-cream-100"
          />
        ))}
      </div>

      <div className="h-40 animate-pulse rounded-2xl border border-cream-300 bg-cream-100" />
    </div>
  );
}
