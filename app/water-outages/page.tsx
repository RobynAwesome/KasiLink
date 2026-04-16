"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import {
  EmptyStateCard,
  Eyebrow,
  SectionHeading,
} from "@/components/ui/PagePrimitives";

interface WaterAlert {
  _id: string;
  title: string;
  description: string;
  suburb: string;
  createdAt: string;
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function WaterOutagePage() {
  const { isSignedIn } = useUser();
  const [loadStage, setLoadStage] = useState<number>(0);
  const [loadStatus, setLoadStatus] = useState<string>("Checking...");
  const [alerts, setAlerts] = useState<WaterAlert[]>([]);
  const [alertSuburb, setAlertSuburb] = useState("");
  const [loadingAlerts, setLoadingAlerts] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ suburb: "", title: "", description: "", type: "water_outage" });
  const [submitting, setSubmitting] = useState(false);
  const [reportStatus, setReportStatus] = useState<{ kind: "success" | "error"; message: string } | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchStage = async () => {
      try {
        const res = await fetch("/api/load-shedding");
        if (res.ok) {
          const data = await res.json();
          setLoadStage(data.stage ?? 0);
          setLoadStatus(data.status ?? "Unknown");
        }
      } catch {
        setLoadStatus("Status unavailable");
      }
    };
    void fetchStage();
    const id = setInterval(fetchStage, 300_000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadAlerts() {
      setLoadingAlerts(true);
      const params = new URLSearchParams();
      if (alertSuburb) params.set("suburb", alertSuburb);

      try {
        const res = await fetch(`/api/water-alerts?${params.toString()}`);
        const data = await res.json();
        if (!cancelled) {
          setAlerts(data.alerts ?? []);
        }
      } catch {
        if (!cancelled) {
          setAlerts([]);
        }
      } finally {
        if (!cancelled) {
          setLoadingAlerts(false);
        }
      }
    }

    void loadAlerts();

    return () => {
      cancelled = true;
    };
  }, [alertSuburb, refreshKey]);

  const handleReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.suburb || !form.title || !form.description) return;
    setSubmitting(true);
    setReportStatus(null);
    try {
      const res = await fetch("/api/water-alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          suburb: form.suburb,
          type: form.type,
        }),
      });
      if (res.ok) {
        setReportStatus({
          kind: "success",
          message: `Outage reported for ${form.suburb}. Thank you for helping the community.`,
        });
        setForm({ suburb: "", title: "", description: "", type: "water_outage" });
        setShowForm(false);
        setRefreshKey((k) => k + 1);
      } else if (res.status === 401) {
        setReportStatus({ kind: "error", message: "Please sign in to report an outage." });
      } else {
        const data = await res.json();
        setReportStatus({ kind: "error", message: data.error ?? "Failed to submit. Please try again." });
      }
    } catch {
      setReportStatus({ kind: "error", message: "Network error. Please check your connection and try again." });
    } finally {
      setSubmitting(false);
    }
  };

  const affectedSuburbs = new Set(alerts.map((a) => a.suburb)).size;
  const mostRecent = alerts.length > 0 ? timeAgo(alerts[0].createdAt) : null;

  return (
    <div className="pb-12">
      <section className="container page-shell">
        <div className="page-hero animate-fade-in">
          <div className="page-hero-grid">
            <div className="page-hero-copy">
              <Eyebrow tone="danger">Water alerts</Eyebrow>
              <h1 className="page-hero-title mt-4 font-headline font-black text-on-background">
                Water outages and community pressure reports.
              </h1>
              <p className="page-hero-description">
                Pipe bursts, dry taps, and low pressure affect dignity, health,
                and work. Community alerts help residents see problems early and
                plan around them together.
              </p>
              <div className="page-hero-actions">
                <button
                  className="btn btn-primary btn-lg"
                  onClick={() => setShowForm((v) => !v)}
                >
                  {showForm ? "Cancel report" : "Report dry tap"}
                </button>
                <Link href="/community-status" className="btn btn-outline btn-lg">
                  Full community status
                </Link>
              </div>
            </div>

            <aside className="page-hero-aside">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-outline">
                Live alert pulse
              </p>
              <div className="mt-4 space-y-3">
                <div className="mini-stat">
                  <p className="mini-stat-label">Load-shedding stage</p>
                  <p className="mini-stat-value text-warning">
                    {loadStage === 0 ? "None" : `Stage ${loadStage}`}
                  </p>
                  <p className="mt-1 text-sm text-on-surface-variant">{loadStatus}</p>
                </div>
                <div className="mini-stat">
                  <p className="mini-stat-label">Community water alerts</p>
                  <p className="mini-stat-value text-error">
                    {loadingAlerts ? "—" : alerts.length}
                  </p>
                  <p className="mt-1 text-sm text-on-surface-variant">
                    Shared to help households, workers, and local businesses plan.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {reportStatus && (
        <div className="container pb-4">
          <div
            className={`alert ${reportStatus.kind === "success" ? "alert-success" : "alert-error"}`}
            role="status"
          >
            {reportStatus.message}
          </div>
        </div>
      )}

      {showForm && (
        <section className="container pb-6">
          <form
            onSubmit={handleReport}
            className="kasi-card animate-fade-in border-error/40"
          >
            <SectionHeading
              eyebrow={<Eyebrow tone="danger">Report an outage</Eyebrow>}
              title="Help your neighbourhood plan around disruptions"
              description="Add your suburb and what is happening so others can see it in the live feed."
            />
            {!isSignedIn && (
              <div className="mb-4 rounded-lg border border-warning/40 bg-warning/10 px-4 py-3 text-sm text-on-background">
                <Link href="/sign-in" className="font-semibold text-primary hover:underline">
                  Sign in
                </Link>{" "}
                to submit a report. Your identity is not shown publicly — only the suburb and issue type appear.
              </div>
            )}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="form-group">
                <label htmlFor="outage-suburb" className="label">
                  Location / suburb <span className="text-error">*</span>
                </label>
                <input
                  id="outage-suburb"
                  type="text"
                  className="kasi-input"
                  placeholder="e.g. Khayelitsha Site C"
                  value={form.suburb}
                  onChange={(e) => setForm({ ...form, suburb: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="outage-type" className="label">
                  Issue type <span className="text-error">*</span>
                </label>
                <select
                  id="outage-type"
                  className="kasi-input"
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                >
                  <option value="water_outage">Water outage / dry taps</option>
                  <option value="load_shedding">Load-shedding related</option>
                  <option value="both">Both water and power</option>
                </select>
              </div>
            </div>
            <div className="mt-4 form-group">
              <label htmlFor="outage-title" className="label">
                Short title <span className="text-error">*</span>
              </label>
              <input
                id="outage-title"
                type="text"
                className="kasi-input"
                placeholder="e.g. No water since 6am in Site C"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                minLength={5}
                maxLength={120}
                required
              />
            </div>
            <div className="mt-4 form-group">
              <label htmlFor="outage-description" className="label">
                Details <span className="text-error">*</span>
              </label>
              <textarea
                id="outage-description"
                className="kasi-input min-h-[80px] resize-y"
                placeholder="Describe what you are experiencing — e.g. completely dry, very low pressure, pipe burst on the corner of X and Y"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                minLength={10}
                maxLength={500}
                required
              />
            </div>
            <div className="mt-4 flex gap-3">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={submitting || !isSignedIn}
              >
                {submitting ? "Submitting…" : "Submit report"}
              </button>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      )}

      <section className="container pb-10">
        <div className="filter-shell">
          <SectionHeading
            eyebrow={<Eyebrow tone="neutral">Filter alerts</Eyebrow>}
            title="Community water outage reports"
            description="Filter by suburb to see what is happening close to home."
          />
          <div className="flex flex-wrap gap-3">
            <input
              className="kasi-input max-w-[220px]"
              placeholder="Filter by suburb"
              value={alertSuburb}
              onChange={(e) => setAlertSuburb(e.target.value)}
              aria-label="Filter by suburb"
            />
            <button
              className="btn btn-outline"
              onClick={() => setAlertSuburb("")}
              disabled={!alertSuburb}
            >
              Clear
            </button>
          </div>
          {alertSuburb && (
            <div className="flex gap-2">
              <span className="badge badge-secondary">Suburb: {alertSuburb}</span>
            </div>
          )}
        </div>
      </section>

      <section className="container pb-8">
        <div className="bento-grid md:grid-cols-12">
          <div className="feature-panel-contrast md:col-span-7 text-on-background">
            <div className="flex items-center gap-3">
              <span className="badge badge-danger">High alert</span>
              <span className="text-xs uppercase tracking-[0.16em] text-outline">
                {loadingAlerts ? "Updating" : `${alerts.length} reports in scope`}
              </span>
            </div>
            <h2 className="mt-4 text-2xl font-black">
              Water service disruption details
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-on-surface-variant">
              Use this page like an incident brief: confirm severity, see community
              impact, and decide whether work, study, or travel plans need to shift.
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="mini-stat">
                <p className="mini-stat-label">Affected suburbs</p>
                <p className="mini-stat-value text-error">
                  {loadingAlerts ? "—" : affectedSuburbs}
                </p>
              </div>
              <div className="mini-stat">
                <p className="mini-stat-label">Most recent report</p>
                <p className="mini-stat-value text-primary">
                  {loadingAlerts ? "—" : mostRecent ?? "None active"}
                </p>
              </div>
            </div>
          </div>
          <div className="feature-panel md:col-span-5">
            <p className="mini-stat-label">Official response frame</p>
            <div className="impact-list mt-4">
              <div className="impact-row">
                <div>
                  <p className="text-sm font-semibold">Municipal lead</p>
                  <p className="text-sm text-on-surface-variant">
                    Water and sanitation interruptions should be escalated through local municipal channels first.
                  </p>
                </div>
                <span className="badge badge-warning">In progress</span>
              </div>
              <div className="impact-row">
                <div>
                  <p className="text-sm font-semibold">Community impact</p>
                  <p className="text-sm text-on-surface-variant">
                    Alerts affect hygiene, schooling, food prep, and the ability to take paid work confidently.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container pb-12">
        <p className="sr-only" role="status" aria-live="polite">
          {loadingAlerts
            ? "Loading water alerts"
            : `${alerts.length} water alerts loaded`}
        </p>

        {loadingAlerts ? (
          <div className="flex flex-col gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="kasi-card skeleton h-24" />
            ))}
          </div>
        ) : alerts.length === 0 ? (
          <EmptyStateCard
            title="No water alerts in this area"
            description="No reported outages right now. Report a dry tap if your area is affected so others can see it."
            action={
              <button
                className="btn btn-primary"
                onClick={() => {
                  setAlertSuburb("");
                  setShowForm(true);
                }}
              >
                Report an outage
              </button>
            }
            secondary={
              alertSuburb ? (
                <button
                  className="btn btn-outline"
                  onClick={() => setAlertSuburb("")}
                >
                  Remove suburb filter
                </button>
              ) : undefined
            }
          />
        ) : (
          <div className="editorial-feed">
            {alerts.map((alert) => (
              <article
                key={alert._id}
                className="editorial-entry editorial-entry-danger"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-bold text-on-background">{alert.title}</h3>
                    <p className="mt-1 text-sm leading-7 text-on-surface-variant">
                      {alert.description}
                    </p>
                  </div>
                  <span className="badge badge-danger shrink-0">Alert</span>
                </div>
                <p className="mt-3 text-[11px] uppercase tracking-[0.16em] text-outline">
                  {alert.suburb} · {timeAgo(alert.createdAt)}
                </p>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="container pb-12">
        <div className="surface-band">
          <SectionHeading
            eyebrow={<Eyebrow tone="neutral">Context</Eyebrow>}
            title="Why water alerts matter for local work"
            description="Water outages affect dignity, health, and the ability to work. Knowing what is happening in your area helps you plan around disruptions before they cost you time or money."
            align="center"
          />
          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                title: "Who is responsible?",
                body: "Municipalities deliver water and sanitation services. Contact your local municipality first when you have a service interruption.",
              },
              {
                title: "Free basic water",
                body: "Government provides free basic services to poor households where available. If you are not receiving this, contact your ward councillor.",
              },
              {
                title: "Report and coordinate",
                body: "Community alerts help others avoid unsafe or disrupted areas. Use the forum and community status page to coordinate updates instead of repeating the same report across channels.",
              },
            ].map((item) => (
              <article key={item.title} className="kasi-card h-full">
                <h3 className="text-base font-bold">{item.title}</h3>
                <p className="mt-2 text-sm leading-7 text-on-surface-variant">
                  {item.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
