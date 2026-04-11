export default function Loading() {
  return (
    <div className="container pt-8 pb-12">
      <div className="mb-8 space-y-3">
        <div className="h-3 w-32 rounded bg-surface-container-high animate-pulse" />
        <div className="h-8 w-64 rounded-lg bg-surface-container-high animate-pulse" />
        <div className="h-4 w-96 rounded bg-surface-container-high animate-pulse" />
      </div>
      {/* Bento grid skeleton matching the real page layout */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {/* Large featured card */}
        <div className="kasi-card animate-pulse md:col-span-2 xl:col-span-1 space-y-3">
          <div className="h-4 w-24 rounded bg-surface-container-high" />
          <div className="h-10 w-3/4 rounded-lg bg-surface-container-high" />
          <div className="h-6 w-1/2 rounded bg-surface-container-high" />
          <div className="h-4 w-full rounded bg-surface-container-high" />
          <div className="h-4 w-4/5 rounded bg-surface-container-high" />
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="kasi-card animate-pulse space-y-3">
            <div className="flex items-center justify-between">
              <div className="h-4 w-20 rounded bg-surface-container-high" />
              <div className="h-5 w-16 rounded-full bg-surface-container-high" />
            </div>
            <div className="h-6 w-2/3 rounded-lg bg-surface-container-high" />
            <div className="h-4 w-full rounded bg-surface-container-high" />
            <div className="h-4 w-3/4 rounded bg-surface-container-high" />
            <div className="flex gap-2 pt-1">
              <div className="h-5 w-14 rounded-full bg-surface-container-high" />
              <div className="h-5 w-18 rounded-full bg-surface-container-high" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
