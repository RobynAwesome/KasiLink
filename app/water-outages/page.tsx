"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  EmptyStateCard,
  Eyebrow,
  MetricGrid,
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
  const [loadStage, setLoadStage] = useState<number>(0);
  const [loadStatus, setLoadStatus] = useState<string>("Checking...");
  const [alerts, setAlerts] = useState<WaterAlert[]>([]);
  const [alertSuburb, setAlertSuburb] = useState("");
  const [loadingAlerts, setLoadingAlerts] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ suburb: "", issue: "dry" });
  const [reportStatus, setReportStatus] = useState("");

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
    setLoadingAlerts(true);
    const params = new URLSearchParams();
    if (alertSuburb) params.set("suburb", alertSuburb);
    fetch(`/api/water-alerts?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => setAlerts(data.alerts ?? []))
      .catch(() => setAlerts([]))
      .finally(() => setLoadingAlerts(false));
  }, [alertSuburb]);

  const handleReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.suburb) return;
    setReportStatus(
      `Outage reported for ${form.suburb}. Thank you for helping the community.`,
    );
    setForm({ suburb: "", issue: "dry" });
    setShowForm(false);
  };

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
                Power context
              </p>
              <MetricGrid
                className="mt-4"
                items={[
                  {
                    label: "Load-shedding stage",
                    value: loadStage === 0 ? "None" : `Stage ${loadStage}`,
                    helper: loadStage === 0 ? "No active cuts" : "Active load-shedding",
                  },
                  {
                    label: "Power status",
                    value: loadStage === 0 ? "Normal" : "Disrupted",
                    helper: loadStatus,
                  },
                  {
                    label: "Water alerts",
                    value: loadingAlerts ? "—" : alerts.length,
                    helper: "Community-reported outages",
                  },
                ]}
              />
            </aside>
          </div>
        </div>
      </section>

      {reportStatus && (
        <div className="container pb-4">
          <div className="alert alert-success" role="status">
            {reportStatus}
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
              description="Add your suburb and the type of problem so others can see what is happening nearby."
            />
            <div className="grid gap-4 md:grid-cols-2">
              <div className="form-group">
                <label htmlFor="outage-suburb" className="label">
                  Location / suburb
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
                <label htmlFor="outage-issue" className="label">
                  Issue type
                </label>
                <select
                  id="outage-issue"
                  className="kasi-input"
                  value={form.issue}
                  onChange={(e) => setForm({ ...form, issue: e.target.value })}
                >
                  <option value="dry">Completely dry taps</option>
                  <option value="low_pressure">Very low pressure</option>
                  <option value="pipe_burst">Pipe burst</option>
                  <option value="maintenance">Scheduled maintenance</option>
                </select>
              </div>
            </div>
            <div className="mt-4 flex gap-3">
              <button type="submit" className="btn btn-primary">
                Submit report
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
          <div className="flex flex-col gap-4">
            {alerts.map((alert) => (
              <article
                key={alert._id}
                className="kasi-card border-l-4 border-error/60"
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
                body: "Community alerts help others avoid unsafe or disrupted areas. The forum is also a good place to share real-time water and safety updates.",
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
