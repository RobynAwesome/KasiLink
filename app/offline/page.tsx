import Link from "next/link";

export default function OfflinePage() {
  return (
    <main className="container flex min-h-[80vh] flex-col items-center justify-center py-16">
      <div className="w-full max-w-md text-center">
        {/* Icon */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-surface-container border border-outline-variant/30">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-outline">
            <path d="M1 1l22 22M16.72 11.06A10.94 10.94 0 0 1 19 12.55M5 12.55a10.94 10.94 0 0 1 5.17-2.39M10.71 5.05A16 16 0 0 1 22.56 9M1.42 9a15.91 15.91 0 0 1 4.7-2.88M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        {/* Heading */}
        <h1 className="font-headline text-3xl font-black text-on-background">
          You&apos;re offline
        </h1>
        <p className="mt-3 text-base leading-7 text-on-surface-variant">
          No connection right now. KasiLink needs data to load gigs and community updates.
        </p>

        {/* Township context */}
        <div className="mt-6 rounded-2xl border border-outline-variant/30 bg-surface-container-low p-4 text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-outline">Load-shedding?</p>
          <p className="mt-2 text-sm leading-7 text-on-surface-variant">
            Pages you visited recently may still be available from cache.
            Try navigating back to the marketplace or your profile.
          </p>
        </div>

        {/* Tips */}
        <div className="mt-4 space-y-2 text-left">
          {[
            "Check your mobile data is on",
            "Move closer to a Wi-Fi source",
            "Wait for load-shedding to end and retry",
          ].map((tip) => (
            <div key={tip} className="flex items-start gap-3 rounded-xl border border-outline-variant/20 bg-surface-container px-4 py-3">
              <span className="mt-0.5 text-primary">→</span>
              <p className="text-sm text-on-surface-variant">{tip}</p>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-col gap-3">
          <Link href="/" className="btn btn-primary w-full">
            Try again
          </Link>
          <Link href="/marketplace" className="btn btn-outline w-full">
            Go to marketplace
          </Link>
        </div>
      </div>
    </main>
  );
}
