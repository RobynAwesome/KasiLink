"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { formatRelativeTime } from "@/lib/format";

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
  const activeFilterCount = [suburb, category !== "all" ? category : ""].filter(Boolean).length;

  const clearFilters = () => {
    setLoading(true);
    setSuburb("");
    setCategory("all");
  };

  useEffect(() => {
    const params = new URLSearchParams();
    if (suburb) params.set("suburb", suburb);
    if (category && category !== "all") params.set("category", category);

    fetch(`/api/spotlight?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => setBusinesses(data.businesses ?? []))
      .catch(() => setBusinesses([]))
      .finally(() => setLoading(false));
  }, [suburb, category]);

  const categories = useMemo(
    () => ["all", ...new Set(businesses.map((business) => business.category))],
    [businesses],
  );

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-headline text-3xl font-bold">
            Local Business Spotlight
          </h1>
          <p className="text-on-surface-variant">
            Support businesses in your community.
          </p>
        </div>
        <Link href="/spotlight/new" className="btn btn-primary btn-sm">
          List Your Business
        </Link>
      </div>

      <div className="mb-6 flex flex-wrap gap-3">
        <input
          className="kasi-input max-w-[220px]"
          placeholder="Filter by suburb"
          value={suburb}
          onChange={(e) => {
            setLoading(true);
            setSuburb(e.target.value);
          }}
          aria-label="Filter businesses by suburb"
        />
        <select
          className="kasi-input max-w-[220px]"
          value={category}
          onChange={(e) => {
            setLoading(true);
            setCategory(e.target.value);
          }}
          aria-label="Filter businesses by category"
        >
          {categories.map((item) => (
            <option key={item} value={item}>
              {item === "all" ? "All categories" : item}
            </option>
          ))}
        </select>
        <button className="btn btn-outline btn-sm" onClick={clearFilters}>
          Clear filters
        </button>
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        {activeFilterCount > 0 && (
          <span className="badge badge-info">{activeFilterCount} active filters</span>
        )}
        {suburb && <span className="badge badge-secondary">Suburb: {suburb}</span>}
        {category !== "all" && (
          <span className="badge badge-secondary">Category: {category}</span>
        )}
      </div>

      <p className="sr-only" role="status" aria-live="polite">
        {loading ? "Loading businesses" : `${businesses.length} businesses loaded`}
      </p>

      {loading ? (
        <div className="kasi-card py-10 text-center text-on-surface-variant">
          Loading businesses...
        </div>
      ) : businesses.length === 0 ? (
        <div className="kasi-card py-10 text-center text-on-surface-variant">
          No businesses listed in this area yet.
          {activeFilterCount > 0 && (
            <div className="mt-4">
              <button className="btn btn-outline btn-sm" onClick={clearFilters}>
                Reset filters
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {businesses.map((business) => (
            <div key={business._id} className="kasi-card">
              <div className="mb-2 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold">{business.businessName}</h2>
                  <p className="text-xs text-outline">{business.suburb}</p>
                </div>
                <span className="badge badge-primary capitalize">
                  {business.category}
                </span>
              </div>
              <p className="text-sm text-on-surface-variant">
                {business.description}
              </p>
              <p className="mt-3 text-sm font-medium">
                <a
                  href={`tel:${business.phone.replace(/\s+/g, "")}`}
                  className="text-primary hover:underline"
                >
                  {business.phone}
                </a>
              </p>
              {business.createdAt && (
                <p className="mt-2 text-xs text-outline">
                  Added {formatRelativeTime(business.createdAt)}
                </p>
              )}
              {business.verified && (
                <span className="badge badge-success mt-3">Verified</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
