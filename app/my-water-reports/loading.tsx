export default function Loading() {
  return (
    <div className="container pt-8 pb-12">
      <div className="mb-8 space-y-3">
        <div className="h-3 w-28 rounded bg-surface-container-high animate-pulse" />
        <div className="h-8 w-56 rounded-lg bg-surface-container-high animate-pulse" />
        <div className="h-4 w-80 rounded bg-surface-container-high animate-pulse" />
      </div>
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="kasi-card animate-pulse flex gap-4 items-start">
            <div className="h-10 w-10 shrink-0 rounded-xl bg-surface-container-high" />
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-5 w-16 rounded-full bg-surface-container-high" />
                <div className="h-4 w-24 rounded bg-surface-container-high" />
              </div>
              <div className="h-5 w-2/3 rounded-lg bg-surface-container-high" />
              <div className="h-4 w-full rounded bg-surface-container-high" />
              <div className="h-4 w-3/4 rounded bg-surface-container-high" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
