export default function Loading() {
  return (
    <div className="container pt-8 pb-12 max-w-3xl">
      <div className="mb-4 h-4 w-32 rounded bg-surface-container-high animate-pulse" />
      {/* Provider header card */}
      <div className="kasi-card animate-pulse mb-6 space-y-4">
        <div className="flex items-start gap-4">
          <div className="h-20 w-20 shrink-0 rounded-2xl bg-surface-container-high" />
          <div className="flex-1 space-y-2">
            <div className="h-7 w-1/2 rounded-lg bg-surface-container-high" />
            <div className="h-4 w-1/3 rounded bg-surface-container-high" />
            <div className="flex gap-2">
              <div className="h-5 w-20 rounded-full bg-surface-container-high" />
              <div className="h-5 w-16 rounded-full bg-surface-container-high" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 border-t border-outline-variant/20 pt-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-1 text-center">
              <div className="mx-auto h-7 w-12 rounded-lg bg-surface-container-high" />
              <div className="mx-auto h-3 w-16 rounded bg-surface-container-high" />
            </div>
          ))}
        </div>
      </div>
      {/* Reviews + skills */}
      <div className="grid gap-4 md:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="kasi-card animate-pulse space-y-3">
            <div className="h-5 w-1/3 rounded-lg bg-surface-container-high" />
            {Array.from({ length: 3 }).map((_, j) => (
              <div key={j} className="space-y-2 border-t border-outline-variant/20 pt-3">
                <div className="h-4 w-3/4 rounded bg-surface-container-high" />
                <div className="h-3 w-full rounded bg-surface-container-high" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
