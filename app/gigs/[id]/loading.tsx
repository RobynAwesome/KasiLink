export default function Loading() {
  return (
    <div className="container pt-8 pb-12 max-w-3xl">
      {/* Breadcrumb */}
      <div className="mb-6 h-4 w-32 rounded bg-surface-container-high animate-pulse" />
      {/* Badges + title */}
      <div className="kasi-card animate-pulse space-y-4 mb-6">
        <div className="flex gap-2">
          <div className="h-5 w-16 rounded-full bg-surface-container-high" />
          <div className="h-5 w-20 rounded-full bg-surface-container-high" />
          <div className="h-5 w-18 rounded-full bg-surface-container-high" />
        </div>
        <div className="h-8 w-3/4 rounded-lg bg-surface-container-high" />
        <div className="space-y-2">
          <div className="h-4 w-full rounded bg-surface-container-high" />
          <div className="h-4 w-full rounded bg-surface-container-high" />
          <div className="h-4 w-2/3 rounded bg-surface-container-high" />
        </div>
        <div className="grid grid-cols-2 gap-4 pt-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-1">
              <div className="h-3 w-16 rounded bg-surface-container-high" />
              <div className="h-5 w-24 rounded bg-surface-container-high" />
            </div>
          ))}
        </div>
      </div>
      {/* Apply panel */}
      <div className="kasi-card animate-pulse space-y-4">
        <div className="h-6 w-40 rounded-lg bg-surface-container-high" />
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-surface-container-high shrink-0" />
          <div className="space-y-2">
            <div className="h-4 w-32 rounded bg-surface-container-high" />
            <div className="h-3 w-20 rounded bg-surface-container-high" />
          </div>
        </div>
        <div className="h-11 w-full rounded-xl bg-surface-container-high" />
        <div className="h-10 w-full rounded-xl bg-primary/20" />
      </div>
    </div>
  );
}
