"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

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

const SEVERITY_CLASSES: Record<string, string> = {
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
    setLoading(true);
    setSuburb("");
    setType("");
    setSeverity("");
    setSortBy("newest");
  };

  useEffect(() => {
    const params = new URLSearchParams();
    if (suburb) params.set("suburb", suburb);
    if (type) params.set("type", type);
    fetch(`/api/incidents?${params.toString()}`)
      .then((r) => r.json())
      .then((d) => setIncidents(d.incidents ?? []))
      .catch(() => setIncidents([]))
      .finally(() => setLoading(false));
  }, [suburb, type]);

  const visibleIncidents = useMemo(() => {
    const filtered = severity
      ? incidents.filter((incident) => incident.severity === severity)
      : incidents;

    const severityWeight: Record<Incident["severity"], number> = {
      high: 3,
      medium: 2,
      low: 1,
    };

    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === "oldest") {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      if (sortBy === "severity") {
        return severityWeight[b.severity] - severityWeight[a.severity];
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return sorted;
  }, [incidents, severity, sortBy]);

  const totalCount = incidents.length;
  const highSeverityCount = incidents.filter(
    (incident) => incident.severity === "high",
  ).length;
  const filteredCount = visibleIncidents.length;

  return (
    <div className="container max-w-screen-md pt-8 pb-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-headline text-3xl font-bold">Community Incidents</h1>
          <p className="text-on-surface-variant text-sm mt-1">
            Safety alerts, utility outages, and road issues reported by the community.
          </p>
        </div>
        <Link href="/incidents/new" className="btn btn-primary btn-sm">
          Report Incident
        </Link>
      </div>

      <div className="flex gap-3 mb-6 flex-wrap">
        <input
          className="kasi-input max-w-[180px]"
          placeholder="Filter by suburb"
          value={suburb}
          onChange={(e) => {
            setLoading(true);
            setSuburb(e.target.value);
          }}
        />
        <select
          className="kasi-input max-w-[200px]"
          value={type}
          onChange={(e) => {
            setLoading(true);
            setType(e.target.value);
          }}
        >
          <option value="">All types</option>
          {Object.entries(TYPE_LABELS).map(([v, l]) => (
            <option key={v} value={v}>{l}</option>
          ))}
        </select>
        <select
          className="kasi-input max-w-[180px]"
          value={severity}
          onChange={(e) => setSeverity(e.target.value as "" | "high" | "medium" | "low")}
        >
          <option value="">All severity</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <select
          className="kasi-input max-w-[200px]"
          value={sortBy}
          onChange={(e) =>
            setSortBy(e.target.value as "newest" | "oldest" | "severity")
          }
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="severity">Highest severity first</option>
        </select>
        <button className="btn btn-outline btn-sm" onClick={clearFilters}>
          Clear filters
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <div className="kasi-card bg-surface-container-low text-center">
          <p className="text-xs uppercase tracking-wider text-outline mb-1">Total</p>
          <p className="text-lg font-bold">{totalCount}</p>
        </div>
        <div className="kasi-card bg-surface-container-low text-center">
          <p className="text-xs uppercase tracking-wider text-outline mb-1">High Severity</p>
          <p className="text-lg font-bold text-danger">{highSeverityCount}</p>
        </div>
        <div className="kasi-card bg-surface-container-low text-center">
          <p className="text-xs uppercase tracking-wider text-outline mb-1">Filtered</p>
          <p className="text-lg font-bold">{filteredCount}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {activeFilterCount > 0 && (
          <span className="badge badge-info">{activeFilterCount} active filters</span>
        )}
        {suburb && <span className="badge badge-secondary">Suburb: {suburb}</span>}
        {type && (
          <span className="badge badge-secondary">
            Type: {TYPE_LABELS[type] ?? type}
          </span>
        )}
        {severity && (
          <span className={`badge ${SEVERITY_CLASSES[severity] ?? "badge-secondary"}`}>
            Severity: {severity}
          </span>
        )}
      </div>

      <p className="sr-only" role="status" aria-live="polite">
        {loading
          ? "Loading incidents"
          : visibleIncidents.length === 0
            ? "No incidents found"
            : `${visibleIncidents.length} incidents loaded`}
      </p>

      {loading ? (
        <p className="text-on-surface-variant text-center py-8">Loading incidents...</p>
      ) : visibleIncidents.length === 0 ? (
        <div className="kasi-card text-center">
          <p className="text-on-surface-variant mb-3">No active incidents in this area.</p>
          {activeFilterCount > 0 && (
            <button className="btn btn-outline btn-sm mb-3" onClick={clearFilters}>
              Reset filters
            </button>
          )}
          <Link href="/incidents/new" className="btn btn-primary btn-sm">Report One</Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {visibleIncidents.map((incident) => (
            <div key={incident._id} className="kasi-card">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <span className="text-xs text-on-surface-variant font-medium uppercase tracking-wide">
                    {TYPE_LABELS[incident.type] ?? incident.type}
                  </span>
                  <h2 className="font-bold text-lg">{incident.title}</h2>
                </div>
                <span className={`badge ${SEVERITY_CLASSES[incident.severity] ?? "badge-success"} shrink-0`}>
                  {incident.severity}
                </span>
              </div>
              <p className="text-sm text-on-surface-variant mb-3 line-clamp-3">
                {incident.description}
              </p>
              <div className="flex gap-3 text-xs text-outline flex-wrap">
                <span>{incident.suburb}</span>
                <span>·</span>
                <span>Reported by {incident.reporterName}</span>
                <span>·</span>
                <span>{timeAgo(incident.createdAt)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
