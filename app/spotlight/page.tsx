"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { formatRelativeTime } from "@/lib/format";
import {
  EmptyStateCard,
  Eyebrow,
  MetricGrid,
  SectionHeading,
} from "@/components/ui/PagePrimitives";

interface Business {
  _id: string;
  businessName: string;
  category: string;
  description: string;
  suburb: string;
  phone: string;
  verified: boolean;
  createdAt?: string;
}

export default function SpotlightPage() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [suburb, setSuburb] = useState("");
  const [category, setCategory] = useState("all");

  const activeFilterCount = [suburb, category !== "all" ? category : ""].filter(
    Boolean,
  ).length;

  const clearFilters = () => {
    setSuburb("");
    setCategory("all");
  };

  useEffect(() => {
    let cancelled = false;

    async function loadBusinesses() {
      setLoading(true);
      const params = new URLSearchParams();
      if (suburb) params.set("suburb", suburb);
      if (category && category !== "all") params.set("category", category);

      try {
        const res = await fetch(`/api/spotlight?${params.toString()}`);
        const data = await res.json();
        if (!cancelled) {
          setBusinesses(data.businesses ?? []);
        }
      } catch {
        if (!cancelled) {
          setBusinesses([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadBusinesses();

    return () => {
      cancelled = true;
    };
  }, [suburb, category]);

  const categories = useMemo(
    () => ["all", ...new Set(businesses.map((b) => b.category))],
    [businesses],
  );

  const verifiedCount = businesses.filter((b) => b.verified).length;
  const featuredBusiness = businesses[0] ?? null;

  return (
    <div className="pb-12">
      <section className="container page-shell">
        <div className="page-hero animate-fade-in">
          <div className="page-hero-grid">
            <div className="page-hero-copy">
              <Eyebrow>Business spotlight</Eyebrow>
              <h1 className="page-hero-title mt-4 font-headline font-black text-on-background">
                Support local businesses in your neighbourhood.
              </h1>
              <p className="page-hero-description">
                Discover informal and small businesses operating in your area.
                Each listing helps connect township businesses with the people
                closest to them — reducing the need for long-distance spending.
              </p>
              <div className="page-hero-actions">
                <Link href="/spotlight/new" className="btn btn-primary btn-lg">
                  List your business
                </Link>
                <Link href="/marketplace" className="btn btn-outline btn-lg">
                  Browse gigs
                </Link>
              </div>
            </div>

            <aside className="page-hero-aside">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-outline">
                Directory stats
              </p>
              <MetricGrid
                className="mt-4"
                items={[
                  {
                    label: "Businesses listed",
                    value: loading ? "—" : businesses.length,
                    helper: "Across all categories",
                  },
                  {
                    label: "Verified",
                    value: loading ? "—" : verifiedCount,
                    helper: "Trust-checked listings",
                  },
                  {
                    label: "CV required",
                    value: "0",
                    helper: "Discovery first, paperwork never",
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
            eyebrow={<Eyebrow tone="neutral">Filter businesses</Eyebrow>}
            title="Search by suburb or category"
            description="Find businesses close to home or narrow by service type."
          />

          <div className="flex flex-wrap gap-3">
            <input
              className="kasi-input max-w-[240px]"
              placeholder="Filter by suburb"
              value={suburb}
              onChange={(e) => setSuburb(e.target.value)}
              aria-label="Filter businesses by suburb"
            />
            <select
              className="kasi-input max-w-[240px]"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              aria-label="Filter businesses by category"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === "all" ? "All categories" : cat}
                </option>
              ))}
            </select>
            <button
              className="btn btn-outline"
              onClick={clearFilters}
              disabled={activeFilterCount === 0}
            >
              Clear filters
            </button>
          </div>

          {activeFilterCount > 0 && (
            <div className="flex flex-wrap gap-2">
              <span className="badge badge-info">
                {activeFilterCount} active filter{activeFilterCount !== 1 ? "s" : ""}
              </span>
              {suburb && (
                <span className="badge badge-secondary">Suburb: {suburb}</span>
              )}
              {category !== "all" && (
                <span className="badge badge-secondary">
                  Category: {category}
                </span>
              )}
            </div>
          )}
        </div>
      </section>

      <section className="container pb-8">
        <div className="bento-grid md:grid-cols-12">
          <div className="feature-panel md:col-span-7">
            <p className="mini-stat-label">Featured spotlight</p>
            <h2 className="mt-2 text-3xl font-black">
              {featuredBusiness ? featuredBusiness.businessName : "Local business feature pending"}
            </h2>
            <p className="mt-2 text-sm leading-7 text-on-surface-variant">
              {featuredBusiness
                ? featuredBusiness.description
                : "List a business so the directory can highlight a trusted local service this week."}
            </p>
            {featuredBusiness ? (
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="badge badge-primary capitalize">
                  {featuredBusiness.category}
                </span>
                <span className="badge badge-secondary">{featuredBusiness.suburb}</span>
                {featuredBusiness.verified ? (
                  <span className="badge badge-success">Verified</span>
                ) : null}
              </div>
            ) : null}
          </div>
          <div className="feature-panel md:col-span-5">
            <p className="mini-stat-label">Why spotlight exists</p>
            <p className="mt-3 text-sm leading-7 text-on-surface-variant">
              Township-first discovery reduces long-distance spending and gives
              neighbours a better chance of finding trusted services close to home.
            </p>
          </div>
        </div>
      </section>

      <section className="container pb-12">
        <p className="sr-only" role="status" aria-live="polite">
          {loading
            ? "Loading businesses"
            : `${businesses.length} businesses loaded`}
        </p>

        {loading ? (
          <div className="grid gap-4 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="kasi-card skeleton h-40" />
            ))}
          </div>
        ) : businesses.length === 0 ? (
          <EmptyStateCard
            title="No businesses in this area yet"
            description="Be the first to list a local business and help your community find nearby services."
            action={
              <Link href="/spotlight/new" className="btn btn-primary">
                List your business
              </Link>
            }
            secondary={
              activeFilterCount > 0 ? (
                <button className="btn btn-outline" onClick={clearFilters}>
                  Reset filters
                </button>
              ) : undefined
            }
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {businesses.map((business, index) => (
              <article
                key={business._id}
                className="editorial-entry editorial-entry-accent animate-slide-up flex h-full flex-col"
                style={{ animationDelay: `${index * 40}ms` }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="truncate text-lg font-bold">
                      {business.businessName}
                    </h3>
                    <p className="text-xs text-outline">{business.suburb}</p>
                  </div>
                  <span className="badge badge-primary shrink-0 capitalize">
                    {business.category}
                  </span>
                </div>

                <p className="mt-3 text-sm leading-7 text-on-surface-variant">
                  {business.description}
                </p>

                <div className="mt-auto pt-4">
                  <div className="flex items-center justify-between gap-3 border-t border-outline-variant/30 pt-3">
                    <a
                      href={`tel:${business.phone.replace(/\s+/g, "")}`}
                      className="text-sm font-semibold text-primary hover:underline"
                    >
                      {business.phone}
                    </a>
                    <div className="flex items-center gap-2">
                      {business.verified && (
                        <span className="badge badge-success">Verified</span>
                      )}
                      {business.createdAt && (
                        <span className="text-[11px] text-outline">
                          {formatRelativeTime(business.createdAt)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
