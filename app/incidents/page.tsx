"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  EmptyStateCard,
  Eyebrow,
  MetricGrid,
  SectionHeading,
} from "@/components/ui/PagePrimitives";

interface Incident {
  _id: string;
  type: string;
  title: string;
  description: string;
  suburb: string;
  severity: "low" | "medium" | "high";
  reporterName: string;
  createdAt: string;
}

const TYPE_LABELS: Record<string, string> = {
  safety: "Safety",
  load_shedding: "Load Shedding",
  water_outage: "Water Outage",
  road: "Road",
  other: "Other",
};

const SEVERITY_BADGE: Record<string, string> = {
  high: "badge-danger",
  medium: "badge-warning",
  low: "badge-success",
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [suburb, setSuburb] = useState("");
  const [type, setType] = useState("");
  const [severity, setSeverity] = useState<"" | "high" | "medium" | "low">("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "severity">(
    "newest",
  );

  const activeFilterCount = [suburb, type, severity].filter(Boolean).length;

  const clearFilters = () => {
    setSuburb("");
    setType("");
    setSeverity("");
    setSortBy("newest");
  };

  useEffect(() => {
    let cancelled = false;

    async function loadIncidents() {
      setLoading(true);
      const params = new URLSearchParams();
      if (suburb) params.set("suburb", suburb);
      if (type) params.set("type", type);

      try {
        const res = await fetch(`/api/incidents?${params.toString()}`);
        const data = await res.json();
        if (!cancelled) {
          setIncidents(data.incidents ?? []);
        }
      } catch {
        if (!cancelled) {
          setIncidents([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadIncidents();

    return () => {
      cancelled = true;
    };
  }, [suburb, type]);

  const visibleIncidents = useMemo(() => {
    const filtered = severity
      ? incidents.filter((i) => i.severity === severity)
      : incidents;
    const weight: Record<Incident["severity"], number> = {
      high: 3,
      medium: 2,
      low: 1,
    };
    return [...filtered].sort((a, b) => {
      if (sortBy === "oldest")
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      if (sortBy === "severity") return weight[b.severity] - weight[a.severity];
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [incidents, severity, sortBy]);

  const highCount = incidents.filter((i) => i.severity === "high").length;

  return (
    <div className="pb-12">
      <section className="container page-shell">
        <div className="page-hero animate-fade-in">
          <div className="page-hero-grid">
            <div className="page-hero-copy">
              <Eyebrow>Incidents</Eyebrow>
              <h1 className="page-hero-title mt-4 font-headline font-black text-on-background">
                Community safety alerts and local incidents.
              </h1>
              <p className="page-hero-description">
                Safety concerns, road issues, utility outages, and local
                disruptions reported by the community. Check before you travel
                or accept a gig in an unfamiliar area.
              </p>
              <div className="page-hero-actions">
                <Link href="/incidents/new" className="btn btn-primary btn-lg">
                  Report an incident
                </Link>
                <Link
                  href="/community-status"
                  className="btn btn-outline btn-lg"
                >
                  Community status
                </Link>
              </div>
            </div>

            <aside className="page-hero-aside">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-outline">
                Current snapshot
              </p>
              <MetricGrid
                className="mt-4"
                items={[
                  {
                    label: "Total incidents",
                    value: loading ? "—" : incidents.length,
                    helper: "Open reports in the system",
                  },
                  {
                    label: "High severity",
                    value: loading ? "—" : highCount,
                    helper: "Requires immediate attention",
                  },
                  {
                    label: "Showing",
                    value: loading ? "—" : visibleIncidents.length,
                    helper: "After current filters",
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
            eyebrow={<Eyebrow tone="neutral">Filter incidents</Eyebrow>}
            title="Narrow by suburb, type, and severity"
            description="Sort by newest or highest severity to see what matters most first."
          />

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="form-group">
              <label htmlFor="incident-suburb" className="label">
                Suburb
              </label>
              <input
                id="incident-suburb"
                className="kasi-input"
                placeholder="e.g. Soweto"
                value={suburb}
                onChange={(e) => setSuburb(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="incident-type" className="label">
                Type
              </label>
              <select
                id="incident-type"
                className="kasi-input"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="">All types</option>
                {Object.entries(TYPE_LABELS).map(([v, l]) => (
                  <option key={v} value={v}>
                    {l}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="incident-severity" className="label">
                Severity
              </label>
              <select
                id="incident-severity"
                className="kasi-input"
                value={severity}
                onChange={(e) =>
                  setSeverity(e.target.value as "" | "high" | "medium" | "low")
                }
              >
                <option value="">All severity</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="incident-sort" className="label">
                Sort by
              </label>
              <select
                id="incident-sort"
                className="kasi-input"
                value={sortBy}
                onChange={(e) =>
                  setSortBy(
                    e.target.value as "newest" | "oldest" | "severity",
                  )
                }
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
                <option value="severity">Highest severity first</option>
              </select>
            </div>
          </div>

          {activeFilterCount > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="badge badge-info">
                {activeFilterCount} active filter
                {activeFilterCount !== 1 ? "s" : ""}
              </span>
              {suburb && (
                <span className="badge badge-secondary">
                  Suburb: {suburb}
                </span>
              )}
              {type && (
                <span className="badge badge-secondary">
                  Type: {TYPE_LABELS[type] ?? type}
                </span>
              )}
              {severity && (
                <span
                  className={`badge ${SEVERITY_BADGE[severity] ?? "badge-secondary"}`}
                >
                  Severity: {severity}
                </span>
              )}
              <button
                className="btn btn-outline btn-sm"
                onClick={clearFilters}
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="container pb-12">
        <p className="sr-only" role="status" aria-live="polite">
          {loading
            ? "Loading incidents"
            : `${visibleIncidents.length} incidents loaded`}
        </p>

        {loading ? (
          <div className="flex flex-col gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="kasi-card skeleton h-28" />
            ))}
          </div>
        ) : visibleIncidents.length === 0 ? (
          <EmptyStateCard
            title="No incidents found"
            description="No active reports in this area. Report one if you see a safety concern or service disruption."
            action={
              <Link href="/incidents/new" className="btn btn-primary">
                Report an incident
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
          <div className="flex flex-col gap-4">
            {visibleIncidents.map((incident, index) => (
              <article
                key={incident._id}
                className="kasi-card animate-slide-up"
                style={{ animationDelay: `${index * 40}ms` }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="mb-1 flex flex-wrap gap-2">
                      <span className="badge badge-secondary capitalize">
                        {TYPE_LABELS[incident.type] ?? incident.type}
                      </span>
                    </div>
                    <h3 className="font-bold text-on-background">
                      {incident.title}
                    </h3>
                  </div>
                  <span
                    className={`badge shrink-0 capitalize ${SEVERITY_BADGE[incident.severity] ?? "badge-secondary"}`}
                  >
                    {incident.severity}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-7 text-on-surface-variant line-clamp-3">
                  {incident.description}
                </p>
                <p className="mt-3 text-[11px] uppercase tracking-[0.16em] text-outline">
                  {incident.suburb} · Reported by {incident.reporterName} ·{" "}
                  {timeAgo(incident.createdAt)}
                </p>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
