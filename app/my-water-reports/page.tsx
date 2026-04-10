"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eyebrow, MetricGrid } from "@/components/ui/PagePrimitives";

interface WaterReport {
  _id: string;
  title: string;
  description: string;
  suburb: string;
  type: string;
  status: "pending" | "in_progress" | "resolved" | "dismissed";
  createdAt: string;
}

const STATUS_BADGE: Record<string, string> = {
  pending: "badge-warning",
  in_progress: "badge-info",
  resolved: "badge-success",
  dismissed: "badge-secondary",
};

const STATUS_LABEL: Record<string, string> = {
  pending: "Under review",
  in_progress: "In progress",
  resolved: "Resolved",
  dismissed: "Dismissed",
};

const FILTERS = [
  { id: "all", label: "All" },
  { id: "pending", label: "Under review" },
  { id: "in_progress", label: "In progress" },
  { id: "resolved", label: "Resolved" },
];

export default function MyWaterReportsPage() {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useUser();
  const [reports, setReports] = useState<WaterReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
      return;
    }
    if (!isSignedIn) return;

    fetch("/api/water-alerts?mine=true")
      .then((r) => r.json())
      .then((d) => setReports(d.alerts ?? d.waterAlerts ?? []))
      .catch(() => setReports([]))
      .finally(() => setLoading(false));
  }, [isLoaded, isSignedIn, router]);

  if (isLoaded && !isSignedIn) return null;

  const filtered = filter === "all" ? reports : reports.filter((r) => r.status === filter);
  const resolvedCount = reports.filter((r) => r.status === "resolved").length;
  const openCount = reports.filter((r) => r.status === "pending" || r.status === "in_progress").length;

  return (
    <div className="pb-12">
      <section className="container page-shell">
        <div className="page-hero animate-fade-in">
          <div className="page-hero-grid">
            <div className="page-hero-copy">
              <Eyebrow>My water reports</Eyebrow>
              <h1 className="page-hero-title mt-4 font-headline font-black text-on-background">
                Track your submitted water issue reports.
              </h1>
              <p className="page-hero-description">
                Every report you submit goes to the community water board and
                is tracked until resolved. Check status here and report new
                issues directly from this page.
              </p>
              <div className="page-hero-actions">
                <Link href="/water-outages" className="btn btn-primary btn-lg">
                  Report new issue
                </Link>
                <Link href="/community-status" className="btn btn-outline btn-lg">
                  Community status
                </Link>
              </div>
            </div>

            <aside className="page-hero-aside">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-outline">
                Your reports
              </p>
              <MetricGrid
                className="mt-4"
                items={[
                  { label: "Total submitted", value: loading ? "—" : reports.length, helper: "All water reports you have filed" },
                  { label: "Open", value: loading ? "—" : openCount, helper: "Pending review or in progress" },
                  { label: "Resolved", value: loading ? "—" : resolvedCount, helper: "Issues confirmed closed" },
                ]}
              />
            </aside>
          </div>
        </div>
      </section>

      <section className="container pb-12">
        <div className="flex flex-wrap gap-2 mb-6">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`chip-toggle ${filter === f.id ? "chip-toggle-active" : ""}`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <p className="sr-only" role="status" aria-live="polite">
          {loading ? "Loading reports" : `${filtered.length} reports shown`}
        </p>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="kasi-card skeleton h-20" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="kasi-card py-10 text-center">
            <p className="text-on-surface-variant mb-4">
              {filter === "all"
                ? "You haven't submitted any water reports yet."
                : `No ${STATUS_LABEL[filter] ?? filter} reports.`}
            </p>
            <Link href="/water-outages" className="btn btn-primary">
              Report a water issue
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((report, index) => (
              <article
                key={report._id}
                className="kasi-card animate-slide-up border-l-4 border-l-primary/40"
                style={{ animationDelay: `${index * 40}ms` }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-bold text-on-background">{report.title}</h3>
                    <p className="mt-1 text-sm text-on-surface-variant line-clamp-1">
                      {report.description}
                    </p>
                    <p className="mt-2 text-[11px] uppercase tracking-[0.16em] text-outline">
                      {report.suburb} · {new Date(report.createdAt).toLocaleDateString("en-ZA", {
                        day: "numeric", month: "short", year: "numeric",
                      })}
                    </p>
                  </div>
                  <span className={`badge shrink-0 ${STATUS_BADGE[report.status] ?? "badge-secondary"}`}>
                    {STATUS_LABEL[report.status] ?? report.status}
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
