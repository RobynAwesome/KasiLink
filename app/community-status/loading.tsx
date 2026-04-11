export default function Loading() {
  return (
    <div className="container pt-8 pb-12">
      <div className="mb-8 space-y-3">
        <div className="h-3 w-32 rounded bg-surface-container-high animate-pulse" />
        <div className="h-8 w-60 rounded-lg bg-surface-container-high animate-pulse" />
        <div className="h-4 w-88 rounded bg-surface-container-high animate-pulse" />
      </div>
      {/* Status summary cards */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="kasi-card animate-pulse space-y-2">
            <div className="h-3 w-20 rounded bg-surface-container-high" />
            <div className="h-8 w-16 rounded-lg bg-surface-container-high" />
            <div className="h-4 w-full rounded bg-surface-container-high" />
          </div>
        ))}
      </div>
      {/* Detail panels */}
      <div className="grid gap-4 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="kasi-card animate-pulse space-y-3">
            <div className="h-5 w-1/3 rounded-lg bg-surface-container-high" />
            <div className="space-y-2">
              <div className="h-4 w-full rounded bg-surface-container-high" />
              <div className="h-4 w-5/6 rounded bg-surface-container-high" />
              <div className="h-4 w-3/4 rounded bg-surface-container-high" />
            </div>
            <div className="flex gap-2 pt-1">
              <div className="h-5 w-16 rounded-full bg-surface-container-high" />
              <div className="h-5 w-20 rounded-full bg-surface-container-high" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
