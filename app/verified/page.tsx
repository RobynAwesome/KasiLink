"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  EmptyStateCard,
  Eyebrow,
  MetricGrid,
  SectionHeading,
} from "@/components/ui/PagePrimitives";

interface Provider {
  clerkId: string;
  displayName: string;
  category: string;
  rating: number;
  reviewCount: number;
  location: string;
  verified?: boolean;
}

const PAGE_SIZE = 8;

export default function VerifiedProvidersPage() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    setLoading(true);
    const controller = new AbortController();
    fetch(`/api/users?verified=true&page=${page}&limit=${PAGE_SIZE}`, {
      signal: controller.signal,
    })
      .then((res) => res.json())
      .then((data) => {
        setProviders(data.providers || []);
        setHasMore(Boolean(data.hasMore));
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          console.error("Failed to fetch verified providers", err);
        }
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [page]);

  const categories = ["All", ...new Set(providers.map((p) => p.category))];
  const visibleProviders = providers.filter((provider) => {
    const matchesQuery =
      !query ||
      provider.displayName.toLowerCase().includes(query.toLowerCase()) ||
      provider.category.toLowerCase().includes(query.toLowerCase());
    const matchesCategory =
      activeCategory === "All" || provider.category === activeCategory;
    return matchesQuery && matchesCategory;
  });

  return (
    <div className="pb-12">
      <section className="container page-shell">
        <div className="page-hero animate-fade-in">
          <div className="page-hero-grid">
            <div className="page-hero-copy">
              <Eyebrow tone="success">Trust &amp; Safety</Eyebrow>
              <h1 className="page-hero-title mt-4 font-headline font-black text-on-background">
                Verified providers you can book with confidence.
              </h1>
              <p className="page-hero-description">
                Every provider on this page has been vetted through the KasiLink
                trust process. Reviews, ratings, and verification status appear
                upfront so you can decide before you travel.
              </p>
              <div className="page-hero-actions">
                <Link href="/marketplace" className="btn btn-primary btn-lg">
                  Browse live gigs
                </Link>
                <Link href="/forum" className="btn btn-outline btn-lg">
                  Community forum
                </Link>
              </div>
            </div>

            <aside className="page-hero-aside">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-outline">
                Why trust matters here
              </p>
              <MetricGrid
                className="mt-4"
                items={[
                  {
                    label: "Verification",
                    value: "Active",
                    helper: "Providers are checked before they display here",
                  },
                  {
                    label: "CV required",
                    value: "0",
                    helper: "Reviews and ratings replace paperwork",
                  },
                  {
                    label: "Risk signal",
                    value: "Early",
                    helper: "Trust cues surface before money or travel",
                  },
                ]}
              />
            </aside>
          </div>
        </div>
      </section>

      <section className="container pb-8">
        <div className="filter-shell">
          <SectionHeading
            eyebrow={<Eyebrow tone="neutral">Find a provider</Eyebrow>}
            title="Search by name, category, or location"
            description="Narrow by work type or use the search to find someone specific."
          />

          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="search"
              className="kasi-input flex-1"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or category..."
              aria-label="Search providers"
            />
            <button
              className="btn btn-outline"
              onClick={() => {
                setQuery("");
                setActiveCategory("All");
                setPage(1);
              }}
              disabled={!query && activeCategory === "All" && page === 1}
            >
              Reset
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setPage(1);
                }}
                className={`chip-toggle whitespace-nowrap ${
                  activeCategory === cat ? "chip-toggle-active" : ""
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {(query || activeCategory !== "All") && (
            <div className="flex flex-wrap gap-2">
              {query && (
                <span className="badge badge-secondary">Search: {query}</span>
              )}
              {activeCategory !== "All" && (
                <span className="badge badge-primary">
                  Category: {activeCategory}
                </span>
              )}
              <span className="badge badge-info">
                {visibleProviders.length} result
                {visibleProviders.length !== 1 ? "s" : ""}
              </span>
            </div>
          )}
        </div>
      </section>

      <section className="container pb-12">
        <p className="sr-only" role="status" aria-live="polite">
          {loading
            ? "Loading verified providers"
            : `${visibleProviders.length} verified providers shown`}
        </p>

        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="kasi-card skeleton h-[160px]" />
            ))}
          </div>
        ) : visibleProviders.length === 0 ? (
          <EmptyStateCard
            title="No verified providers found"
            description="Try a broader search or switch back to All categories."
            action={
              <button
                className="btn btn-outline"
                onClick={() => {
                  setQuery("");
                  setActiveCategory("All");
                  setPage(1);
                }}
              >
                Reset filters
              </button>
            }
            secondary={
              <Link href="/marketplace" className="btn btn-primary">
                Browse all gigs
              </Link>
            }
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {visibleProviders.map((provider, index) => (
              <article
                key={provider.clerkId}
                className="kasi-card animate-slide-up flex h-full flex-col"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-container text-lg font-black text-primary"
                      aria-hidden="true"
                    >
                      {provider.displayName.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <h3 className="flex items-center gap-1.5 text-base font-bold leading-tight">
                        <span className="truncate">{provider.displayName}</span>
                        <span
                          className="shrink-0 text-sm text-success"
                          title="Verified provider"
                          aria-label="Verified"
                        >
                          ✓
                        </span>
                      </h3>
                      <p className="truncate text-xs text-on-surface-variant">
                        {provider.location}
                      </p>
                    </div>
                  </div>
                  <span className="badge badge-secondary shrink-0 capitalize">
                    {provider.category}
                  </span>
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <span className="text-warning" aria-hidden="true">
                    ★
                  </span>
                  <span className="text-sm font-bold">
                    {provider.rating.toFixed(1)}
                  </span>
                  <span className="text-xs text-outline">
                    ({provider.reviewCount}{" "}
                    {provider.reviewCount === 1 ? "review" : "reviews"})
                  </span>
                  <span className="badge badge-success ml-auto">Verified</span>
                </div>

                <div className="mt-auto flex gap-2 border-t border-outline-variant/30 pt-4">
                  <Link
                    href={`/verified/${provider.clerkId}`}
                    className="btn btn-outline btn-sm flex-1 text-center"
                  >
                    View profile
                  </Link>
                  <Link
                    href="/chat"
                    className="btn btn-primary btn-sm flex-1 text-center"
                  >
                    Message
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}

        {(page > 1 || hasMore) && (
          <div className="mt-8 flex items-center justify-center gap-3">
            <button
              className="btn btn-outline btn-sm"
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
            >
              ← Previous
            </button>
            <span className="text-sm text-on-surface-variant">Page {page}</span>
            <button
              className="btn btn-outline btn-sm"
              onClick={() => setPage((p) => p + 1)}
              disabled={!hasMore}
            >
              Next →
            </button>
          </div>
        )}
      </section>

      <section className="container pb-12">
        <div className="surface-band">
          <SectionHeading
            eyebrow={<Eyebrow tone="neutral">Why this matters</Eyebrow>}
            title="Trust reduces the real cost of local work"
            description="In a township market, risk is physical — bad matches cost transport, time, and sometimes safety. Verified profiles and community reviews cut that risk before money or travel is committed."
            align="center"
          />
          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                title: "Vetted before they appear",
                description:
                  "Providers go through a verification check. Unverified profiles are clearly marked so you always know what you're looking at.",
              },
              {
                title: "Reviews from real work",
                description:
                  "Ratings come from completed gigs on the platform, not self-reported credentials. The signal is grounded in actual outcomes.",
              },
              {
                title: "Community accountability",
                description:
                  "Verified providers are visible to the wider network. Reputation is public and persistent, which raises the standard for everyone.",
              },
            ].map((item) => (
              <article key={item.title} className="kasi-card h-full">
                <h3 className="text-lg font-bold">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-on-surface-variant">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
