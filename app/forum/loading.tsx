export default function Loading() {
  return (
    <div className="container pt-8 pb-12">
      {/* Header skeleton */}
      <div className="mb-8 space-y-3">
        <div className="h-3 w-24 rounded bg-surface-container-high animate-pulse" />
        <div className="h-8 w-52 rounded-lg bg-surface-container-high animate-pulse" />
        <div className="h-4 w-80 rounded bg-surface-container-high animate-pulse" />
      </div>

      {/* Thread rows */}
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="kasi-card animate-pulse flex items-start gap-4">
            {/* Avatar */}
            <div className="h-10 w-10 shrink-0 rounded-full bg-surface-container-high" />
            {/* Content */}
            <div className="flex-1 space-y-2">
              <div className="h-5 w-2/3 rounded-lg bg-surface-container-high" />
              <div className="h-4 w-full rounded bg-surface-container-high" />
              <div className="h-4 w-4/5 rounded bg-surface-container-high" />
              <div className="flex gap-3 pt-1">
                <div className="h-4 w-16 rounded bg-surface-container-high" />
                <div className="h-4 w-20 rounded bg-surface-container-high" />
                <div className="h-4 w-12 rounded bg-surface-container-high" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
