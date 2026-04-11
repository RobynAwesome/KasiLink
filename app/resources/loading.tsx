export default function Loading() {
  return (
    <div className="container pt-8 pb-12">
      <div className="mb-8 space-y-3">
        <div className="h-3 w-24 rounded bg-surface-container-high animate-pulse" />
        <div className="h-8 w-52 rounded-lg bg-surface-container-high animate-pulse" />
        <div className="h-4 w-80 rounded bg-surface-container-high animate-pulse" />
      </div>
      {/* Stats grid */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="kasi-card animate-pulse space-y-2">
            <div className="h-3 w-3/4 rounded bg-surface-container-high" />
            <div className="h-8 w-1/2 rounded-lg bg-surface-container-high" />
            <div className="h-3 w-full rounded bg-surface-container-high" />
          </div>
        ))}
      </div>
      {/* FAQ sections */}
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="mb-6 kasi-card animate-pulse space-y-4">
          <div className="h-6 w-48 rounded-lg bg-surface-container-high" />
          {Array.from({ length: 3 }).map((_, j) => (
            <div key={j} className="space-y-2 border-t border-outline-variant/20 pt-3">
              <div className="h-5 w-3/4 rounded bg-surface-container-high" />
              <div className="h-4 w-full rounded bg-surface-container-high" />
              <div className="h-4 w-5/6 rounded bg-surface-container-high" />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
