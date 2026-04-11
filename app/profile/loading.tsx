export default function Loading() {
  return (
    <div className="container pt-8 pb-12">
      {/* Profile header */}
      <div className="mb-8 flex items-center gap-4">
        <div className="h-16 w-16 rounded-full bg-surface-container-high animate-pulse shrink-0" />
        <div className="space-y-2">
          <div className="h-6 w-40 rounded-lg bg-surface-container-high animate-pulse" />
          <div className="h-4 w-28 rounded bg-surface-container-high animate-pulse" />
        </div>
      </div>
      {/* Stats row */}
      <div className="mb-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="kasi-card animate-pulse space-y-2">
            <div className="h-3 w-16 rounded bg-surface-container-high" />
            <div className="h-7 w-10 rounded-lg bg-surface-container-high" />
          </div>
        ))}
      </div>
      {/* Content panels */}
      <div className="grid gap-4 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="kasi-card animate-pulse space-y-3">
            <div className="h-5 w-1/3 rounded-lg bg-surface-container-high" />
            {Array.from({ length: 3 }).map((_, j) => (
              <div key={j} className="flex gap-3 items-start border-t border-outline-variant/20 pt-3">
                <div className="h-10 w-10 shrink-0 rounded-xl bg-surface-container-high" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 rounded bg-surface-container-high" />
                  <div className="h-3 w-1/2 rounded bg-surface-container-high" />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
