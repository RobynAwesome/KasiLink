"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { formatRelativeTime } from "@/lib/format";
import {
  EmptyStateCard,
  Eyebrow,
  MetricGrid,
  SectionHeading,
} from "@/components/ui/PagePrimitives";

// ── Types ──────────────────────────────────────────────────────────
interface Gig {
  _id: string;
  title: string;
  description: string;
  category: string;
  location: { suburb: string; city: string; coordinates: [number, number] };
  payDisplay: string;
  payType: string;
  isProviderVerified: boolean;
  providerName: string;
  isUrgent: boolean;
  applicationCount: number;
  slots: number;
  createdAt: string;
  distance?: number;
}

// ── Constants ──────────────────────────────────────────────────────
const CATEGORIES = [
  { value: "", label: "All" },
  { value: "car_wash", label: "Car Wash" },
  { value: "cleaning", label: "Cleaning" },
  { value: "tutoring", label: "Tutoring" },
  { value: "repairs", label: "Repairs" },
  { value: "delivery", label: "Delivery" },
  { value: "handyman", label: "Handyman" },
  { value: "retail", label: "Retail" },
  { value: "construction", label: "Construction" },
  { value: "healthcare", label: "Healthcare" },
  { value: "other", label: "Other" },
];

const CITY_OPTIONS = ["", "Johannesburg", "Cape Town"];
const RADIUS_OPTIONS = ["5", "10", "25", "50"];

// ── GigCard ────────────────────────────────────────────────────────
function GigCard({ gig }: { gig: Gig }) {
  return (
    <Link href={`/gigs/${gig._id}`} className="no-underline block">
      <article className="directory-card directory-card-soft cursor-pointer">
        <div className="directory-card-header">
          <div className="directory-card-meta">
            {gig.isUrgent ? (
              <span className="badge badge-danger">Urgent</span>
            ) : null}
            <span className="badge badge-primary">
              {gig.category.replace("_", " ")}
            </span>
            {gig.isProviderVerified ? (
              <span className="badge badge-success">Verified</span>
            ) : null}
          </div>
          <span className="mini-stat-value text-primary">{gig.payDisplay}</span>
        </div>

        <div className="directory-card-body">
          <h3 className="text-xl font-bold text-on-background">{gig.title}</h3>
          <p className="directory-card-detail line-clamp-3">
            {gig.description}
          </p>
          <div className="impact-list">
            <div className="impact-row">
              <div>
                <p className="text-sm font-semibold">Location</p>
                <p className="text-sm text-on-surface-variant">
                  {gig.location.suburb}, {gig.location.city}
                </p>
              </div>
              {gig.distance !== undefined ? (
                <span className="badge badge-info">
                  {gig.distance < 1
                    ? `${Math.round(gig.distance * 1000)}m`
                    : `${gig.distance.toFixed(1)}km`} away
                </span>
              ) : null}
            </div>
          </div>
        </div>

        <div className="directory-card-footer">
          <span className="text-sm font-semibold text-on-surface-variant">
            {gig.providerName}
          </span>
          <span className="text-xs text-outline">
            {gig.applicationCount} applied · {gig.slots} slot
            {gig.slots !== 1 ? "s" : ""} · {formatRelativeTime(gig.createdAt)}
          </span>
        </div>
      </article>
    </Link>
  );
}

// ── Inner page (uses useSearchParams — must be inside Suspense) ────
function MarketplaceInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [gigs, setGigs] = useState<Gig[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState(searchParams.get("sort") ?? "newest");

  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [category, setCategory] = useState(searchParams.get("category") ?? "");
  const [suburb, setSuburb] = useState(searchParams.get("suburb") ?? "");
  const [city, setCity] = useState(searchParams.get("city") ?? "");
  const [radius, setRadius] = useState(searchParams.get("radius") ?? "10");
  const [verifiedOnly, setVerifiedOnly] = useState(
    searchParams.get("verified") === "1",
  );
  const [userCoords, setUserCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const activeFilterCount = [
    query,
    category,
    suburb,
    city,
    verifiedOnly ? "verified" : "",
  ].filter(Boolean).length;

  // Ask for location once
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          setUserCoords({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          }),
        () => {}, // silently ignore
        { timeout: 5000 },
      );
    }
  }, []);

  const fetchGigs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query) params.set("q", query);
      if (category) params.set("category", category);
      if (suburb) params.set("suburb", suburb);
      if (city) params.set("city", city);
      if (radius) params.set("radius", radius);
      if (userCoords) {
        params.set("lat", String(userCoords.lat));
        params.set("lng", String(userCoords.lng));
      }
      params.set("page", String(page));
      params.set("limit", "20");

      const res = await fetch(`/api/gigs?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setGigs(data.gigs ?? []);
      setTotal(data.pagination?.total ?? 0);
    } catch {
      setGigs([]);
    } finally {
      setLoading(false);
    }
  }, [query, category, suburb, city, radius, userCoords, page]);

  useEffect(() => {
    fetchGigs();
  }, [fetchGigs]);

  // Sync URL params
  const applyFilter = (
    newQ: string,
    newCat: string,
    newSuburb: string,
    newCity: string,
    newRadius: string,
    newVerifiedOnly: boolean = verifiedOnly,
    newSort: string = sortBy,
  ) => {
    const params = new URLSearchParams();
    if (newQ) params.set("q", newQ);
    if (newCat) params.set("category", newCat);
    if (newSuburb) params.set("suburb", newSuburb);
    if (newCity) params.set("city", newCity);
    if (newRadius) params.set("radius", newRadius);
    if (newVerifiedOnly) params.set("verified", "1");
    if (newSort && newSort !== "newest") params.set("sort", newSort);
    router.replace(`/marketplace?${params.toString()}`, { scroll: false });
    setPage(1);
  };

  const clearFilters = () => {
    setQuery("");
    setCategory("");
    setSuburb("");
    setCity("");
    setRadius("10");
    setVerifiedOnly(false);
    setSortBy("newest");
    setPage(1);
    router.replace("/marketplace", { scroll: false });
  };

  const sortedGigs = [...gigs].sort((a, b) => {
    if (sortBy === "nearest") {
      const aDist = typeof a.distance === "number" ? a.distance : Number.MAX_SAFE_INTEGER;
      const bDist = typeof b.distance === "number" ? b.distance : Number.MAX_SAFE_INTEGER;
      return aDist - bDist;
    }
    if (sortBy === "pay-high") {
      const parsePay = (value: string) => {
        const match = value.replace(/,/g, "").match(/\d+(\.\d+)?/);
        return match ? Number(match[0]) : 0;
      };
      return parsePay(b.payDisplay) - parsePay(a.payDisplay);
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const visibleGigs = verifiedOnly
    ? sortedGigs.filter((gig) => gig.isProviderVerified)
    : sortedGigs;
  const nearbyCount = visibleGigs.filter(
    (gig) => typeof gig.distance === "number",
  ).length;

  return (
    <div className="container page-shell">
      <section className="page-hero animate-fade-in">
        <div className="page-hero-grid">
          <div className="page-hero-copy">
            <Eyebrow>Marketplace</Eyebrow>
            <h1 className="page-hero-title mt-4 font-headline font-black text-on-background">
              Find nearby work without losing time to clutter.
            </h1>
            <p className="page-hero-description">
              The marketplace should lead with distance, urgency, trust, and pay.
              Browse the jobs closest to you first, then refine with filters
              that match township travel reality instead of generic search patterns.
            </p>
            <div className="page-hero-actions">
              <Link href="/gigs/new" className="btn btn-primary btn-lg">
                Post urgent work
              </Link>
              <button
                type="button"
                className="btn btn-outline btn-lg"
                onClick={clearFilters}
                disabled={activeFilterCount === 0 && radius === "10" && sortBy === "newest"}
              >
                Reset filters
              </button>
            </div>
          </div>

          <aside className="page-hero-aside">
            <MetricGrid
              items={[
                {
                  label: "Available gigs",
                  value: total,
                  helper: userCoords ? "Pulled from your current radius" : "Across supported cities",
                },
                {
                  label: "Search mode",
                  value: userCoords ? "Nearby" : "Regional",
                  helper: userCoords ? `${radius} km radius active` : "Location access not granted",
                },
                {
                  label: "Trust filter",
                  value: verifiedOnly ? "On" : "Optional",
                  helper: verifiedOnly ? "Verified providers only" : "Enable it when safety matters most",
                },
              ]}
            />
          </aside>
        </div>
      </section>

      <section className="pb-8">
        <div className="bento-grid md:grid-cols-12">
          <div className="feature-panel-contrast md:col-span-8 text-on-background">
            <p className="mini-stat-label">Marketplace rules</p>
            <h2 className="mt-2 text-2xl font-black">
              Nearby work should beat long-distance guesswork.
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-on-surface-variant">
              Transport is part of economic participation. This route needs to
              foreground neighbourhood relevance before secondary discovery features.
            </p>
            <div className="mt-5 signal-strip">
              <div className="signal-tile">
                <p className="signal-tile-title">Distance first</p>
                <p className="signal-tile-copy">
                  Show users whether the work is realistically close enough to attempt today.
                </p>
              </div>
              <div className="signal-tile">
                <p className="signal-tile-title">Trust visible early</p>
                <p className="signal-tile-copy">
                  Verified providers should appear in the first scan, not after a risky click.
                </p>
              </div>
              <div className="signal-tile">
                <p className="signal-tile-title">Urgency should read fast</p>
                <p className="signal-tile-copy">
                  High-speed jobs need stronger emphasis than passive listings.
                </p>
              </div>
            </div>
          </div>
          <div className="feature-panel md:col-span-4">
            <p className="mini-stat-label">Current result scope</p>
            <div className="mt-4 space-y-3">
              <div className="mini-stat">
                <p className="mini-stat-label">Visible listings</p>
                <p className="mini-stat-value text-primary">{visibleGigs.length}</p>
              </div>
              <div className="mini-stat">
                <p className="mini-stat-label">Distance-tagged gigs</p>
                <p className="mini-stat-value text-warning">{nearbyCount}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="filter-shell">
          <SectionHeading
            eyebrow={<Eyebrow tone="neutral">Search and narrow</Eyebrow>}
            title="Shape the gig list around distance, topic, and trust"
            description="Filter by suburb, city, radius, and provider verification without losing the live feel of the results."
          />

          <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto_auto]">
            <input
              type="search"
              className="kasi-input flex-1"
              placeholder="Search gigs, providers, or work type"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  applyFilter(
                    query,
                    category,
                    suburb,
                    city,
                    radius,
                    verifiedOnly,
                    sortBy,
                  );
                }
              }}
            />
            <button
              className="btn btn-primary"
              onClick={() =>
                applyFilter(
                  query,
                  category,
                  suburb,
                  city,
                  radius,
                  verifiedOnly,
                  sortBy,
                )
              }
            >
              Search
            </button>
            <button
              className="btn btn-outline"
              onClick={clearFilters}
              disabled={activeFilterCount === 0 && radius === "10" && sortBy === "newest"}
            >
              Clear
            </button>
          </div>

          <div className="grid gap-3 md:grid-cols-[1.1fr_0.8fr_0.7fr_0.8fr]">
            <div className="form-group">
              <label className="label" htmlFor="marketplace-suburb">
                Suburb or township
              </label>
              <input
                id="marketplace-suburb"
                type="text"
                className="kasi-input"
                placeholder="Filter by suburb or township"
                value={suburb}
                onChange={(e) => setSuburb(e.target.value)}
                onBlur={() =>
                  applyFilter(
                    query,
                    category,
                    suburb,
                    city,
                    radius,
                    verifiedOnly,
                    sortBy,
                  )
                }
              />
            </div>

            <div className="form-group">
              <label className="label" htmlFor="marketplace-city">
                City
              </label>
              <select
                id="marketplace-city"
                className="kasi-input"
                value={city}
                onChange={(e) => {
                  setCity(e.target.value);
                  applyFilter(
                    query,
                    category,
                    suburb,
                    e.target.value,
                    radius,
                    verifiedOnly,
                    sortBy,
                  );
                }}
              >
                <option value="">All cities</option>
                {CITY_OPTIONS.filter(Boolean).map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="label" htmlFor="marketplace-radius">
                Radius
              </label>
              <select
                id="marketplace-radius"
                className="kasi-input"
                value={radius}
                onChange={(e) => {
                  setRadius(e.target.value);
                  applyFilter(
                    query,
                    category,
                    suburb,
                    city,
                    e.target.value,
                    verifiedOnly,
                    sortBy,
                  );
                }}
              >
                {RADIUS_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option} km radius
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="marketplace-sort" className="label">
                Sort results
              </label>
              <select
                id="marketplace-sort"
                className="kasi-input"
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  applyFilter(
                    query,
                    category,
                    suburb,
                    city,
                    radius,
                    verifiedOnly,
                    e.target.value,
                  );
                }}
              >
                <option value="newest">Newest first</option>
                <option value="nearest">Nearest first</option>
                <option value="pay-high">Highest pay first</option>
              </select>
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-on-surface-variant">
            <input
              type="checkbox"
              checked={verifiedOnly}
              onChange={(e) => {
                const next = e.target.checked;
                setVerifiedOnly(next);
                applyFilter(query, category, suburb, city, radius, next, sortBy);
              }}
            />
            Show verified providers only
          </label>

          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => {
              setCategory(cat.value);
              applyFilter(
                query,
                cat.value,
                suburb,
                city,
                radius,
                verifiedOnly,
                sortBy,
              );
            }}
            className={`chip-toggle shrink-0 whitespace-nowrap ${
              category === cat.value
                ? "chip-toggle-active"
                : ""
            }`}
          >
            {cat.label}
          </button>
        ))}
          </div>

          <MetricGrid
            items={[
              { label: "Search", value: "Focused", helper: "Find by work type, suburb, or employer signal" },
              { label: "Distance", value: "Low-cost", helper: "Keep transport time and spend down" },
              { label: "Trust", value: "Visible", helper: "Verification and reviews appear early" },
            ]}
          />
        </div>
      </section>

      <div className="flex flex-wrap gap-2 mb-6">
        {activeFilterCount > 0 && (
          <span className="badge badge-info">{activeFilterCount} active filters</span>
        )}
        {suburb && (
          <span className="badge badge-secondary">Suburb: {suburb}</span>
        )}
        {city && <span className="badge badge-secondary">City: {city}</span>}
        {category && (
          <span className="badge badge-secondary">
            Category: {category.replace("_", " ")}
          </span>
        )}
        {userCoords && (
          <span className="badge badge-primary">Nearby within {radius} km</span>
        )}
        {sortBy !== "newest" && (
          <span className="badge badge-info">Sort: {sortBy.replace("-", " ")}</span>
        )}
        {verifiedOnly && (
          <span className="badge badge-success">Verified providers only</span>
        )}
      </div>

      <p className="sr-only" role="status" aria-live="polite">
        {loading ? "Loading gigs" : `${gigs.length} gigs loaded`}
      </p>

      {!loading && visibleGigs.length > 0 ? (
        <div className="mb-6 flex items-center justify-between gap-3">
          <div>
            <p className="mini-stat-label">Live results</p>
            <h2 className="mt-1 text-2xl font-black">
              {visibleGigs.length} gigs ready for review
            </h2>
          </div>
          <span className="badge badge-secondary">
            Sort: {sortBy.replace("-", " ")}
          </span>
        </div>
      ) : null}

      {/* Gig grid */}
      <div aria-busy={loading}>
        {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="kasi-card skeleton h-[180px]" />
          ))}
        </div>
      ) : visibleGigs.length === 0 ? (
        <EmptyStateCard
          title="No gigs found"
          description="Try a broader radius, switch topic, or remove the suburb filter first. If no local work is visible yet, seed the loop by posting one."
          action={
            <button className="btn btn-outline" onClick={clearFilters}>
              Reset all filters
            </button>
          }
          secondary={
            <Link href="/gigs/new" className="btn btn-primary">
              Post the first gig
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {visibleGigs.map((gig) => (
            <GigCard key={gig._id} gig={gig} />
          ))}
        </div>
      )}
      </div>

      {/* Pagination */}
      {total > 20 && (
        <div className="flex justify-center gap-3 mt-8">
          <button
            className="btn btn-secondary"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            ← Previous
          </button>
          <span className="p-3 text-on-surface-variant text-sm">
            Page {page} of {Math.ceil(total / 20)}
          </span>
          <button
            className="btn btn-secondary"
            disabled={page >= Math.ceil(total / 20)}
            onClick={() => setPage((p) => p + 1)}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}

// ── Shell with Suspense (required for useSearchParams in Next.js) ──
export default function MarketplacePage() {
  return (
    <Suspense
      fallback={
        <div className="container pt-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="kasi-card skeleton h-[180px]" />
            ))}
          </div>
        </div>
      }
    >
      <MarketplaceInner />
    </Suspense>
  );
}
