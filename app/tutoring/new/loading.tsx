export default function Loading() {
  return (
    <div className="container pt-8 pb-12 max-w-2xl">
      <div className="mb-8 space-y-3">
        <div className="h-3 w-24 rounded bg-surface-container-high animate-pulse" />
        <div className="h-8 w-48 rounded-lg bg-surface-container-high animate-pulse" />
        <div className="h-4 w-64 rounded bg-surface-container-high animate-pulse" />
      </div>
      <div className="kasi-card animate-pulse space-y-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 w-28 rounded bg-surface-container-high" />
            <div className="h-11 w-full rounded-xl bg-surface-container-high" />
          </div>
        ))}
        <div className="space-y-2">
          <div className="h-4 w-40 rounded bg-surface-container-high" />
          <div className="h-24 w-full rounded-xl bg-surface-container-high" />
        </div>
        <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant/20">
          <div className="h-10 w-24 rounded-xl bg-surface-container-high" />
          <div className="h-10 w-36 rounded-xl bg-surface-container-high" />
        </div>
      </div>
    </div>
  );
}
