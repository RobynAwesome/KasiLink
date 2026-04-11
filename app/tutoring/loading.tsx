export default function Loading() {
  return (
    <div className="container pt-8 pb-12">
      <div className="mb-8 space-y-3">
        <div className="h-3 w-24 rounded bg-surface-container-high animate-pulse" />
        <div className="h-8 w-56 rounded-lg bg-surface-container-high animate-pulse" />
        <div className="h-4 w-72 rounded bg-surface-container-high animate-pulse" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="kasi-card animate-pulse flex flex-col gap-3">
            <div className="flex gap-2">
              <div className="h-5 w-20 rounded-full bg-surface-container-high" />
              <div className="h-5 w-16 rounded-full bg-surface-container-high" />
            </div>
            <div className="h-6 w-3/4 rounded-lg bg-surface-container-high" />
            <div className="space-y-2">
              <div className="h-4 w-full rounded bg-surface-container-high" />
              <div className="h-4 w-5/6 rounded bg-surface-container-high" />
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="h-4 w-full rounded bg-surface-container-high" />
              <div className="h-4 w-full rounded bg-surface-container-high" />
            </div>
            <div className="mt-auto border-t border-outline-variant/30 pt-3 flex justify-between">
              <div className="h-6 w-20 rounded bg-surface-container-high" />
              <div className="h-6 w-16 rounded bg-surface-container-high" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
