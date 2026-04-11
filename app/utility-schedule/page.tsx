"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Eyebrow, SectionHeading } from "@/components/ui/PagePrimitives";

interface Schedule {
  _id: string;
  type: "power" | "water";
  title: string;
  description: string;
  suburb: string;
  zone: string;
  startTime: string;
  endTime: string;
  stage: number | null;
  status: "confirmed" | "estimated" | "cancelled";
  source: string;
}

function timeUntil(iso: string, now: number): string {
  const diff = new Date(iso).getTime() - now;
  if (diff <= 0) return "Now";
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-ZA", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDay(iso: string): string {
  const d = new Date(iso);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  if (d.toDateString() === today.toDateString()) return "Today";
  if (d.toDateString() === tomorrow.toDateString()) return "Tomorrow";
  return d.toLocaleDateString("en-ZA", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

function durationHours(start: string, end: string): string {
  const diff =
    (new Date(end).getTime() - new Date(start).getTime()) / 3600000;
  return diff === 1 ? "1 hour" : `${diff.toFixed(1)} hours`;
}

export default function UtilitySchedulePage() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [suburb, setSuburb] = useState("");
  const [type, setType] = useState("");
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    let cancelled = false;

    async function loadSchedules() {
      setLoading(true);
      const params = new URLSearchParams();
      if (suburb) params.set("suburb", suburb);
      if (type) params.set("type", type);

      try {
        const res = await fetch(`/api/utility-schedule?${params.toString()}`);
        const data = await res.json();
        if (!cancelled) {
          setSchedules(data.schedules ?? []);
        }
      } catch {
        if (!cancelled) {
          setSchedules([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadSchedules();

    return () => {
      cancelled = true;
    };
  }, [suburb, type]);

  useEffect(() => {
    const tick = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(tick);
  }, []);

  const grouped = useMemo(() => {
    const groups: Record<string, Schedule[]> = {};
    for (const s of schedules) {
      const day = formatDay(s.startTime);
      if (!groups[day]) groups[day] = [];
      groups[day].push(s);
    }
    return groups;
  }, [schedules]);

  const next = useMemo(
    () =>
      schedules.find((s) => new Date(s.startTime).getTime() > now) ?? null,
    [schedules, now],
  );
  const providerTags = ["Eskom Direct", "Joburg Water", "City Power"];

  return (
    <div className="pb-12">
      <section className="container page-shell">
        <div className="page-hero animate-fade-in">
          <div className="page-hero-grid">
            <div className="page-hero-copy">
              <Eyebrow>Utility schedule</Eyebrow>
              <h1 className="page-hero-title mt-4 font-headline font-black text-on-background">
                Plan your work around power and water outages.
              </h1>
              <p className="page-hero-description">
                See the next 48 hours of load-shedding and water disruptions in
                your suburb before you accept a gig, schedule a job, or make
                plans that depend on utilities running.
              </p>
              <div className="page-hero-actions">
                <Link
                  href="/community-status"
                  className="btn btn-primary btn-lg"
                >
                  Full community status
                </Link>
                <Link href="/water-outages" className="btn btn-outline btn-lg">
                  Water outages
                </Link>
              </div>
            </div>

            <aside className="page-hero-aside">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-outline">
                Next outage
              </p>
              <div className="mt-4">
                {loading ? (
                  <div className="kasi-card skeleton h-24" />
                ) : next ? (
                  <div className="kasi-card">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-outline">
                      {next.type === "power" ? "Power" : "Water"} outage in
                    </p>
                    <p className="mt-2 text-3xl font-black text-primary">
                      {timeUntil(next.startTime, now)}
                    </p>
                    <p className="mt-1 text-sm text-on-surface-variant">
                      {next.suburb} · {formatTime(next.startTime)} —{" "}
                      {formatTime(next.endTime)}
                    </p>
                  </div>
                ) : (
                  <div className="kasi-card">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-outline">
                      Status
                    </p>
                    <p className="mt-2 text-lg font-bold text-success">
                      No outages scheduled
                    </p>
                    <p className="mt-1 text-sm text-on-surface-variant">
                      {suburb || "All areas"} · Next 48 hours
                    </p>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="container pb-8">
        <div className="filter-shell">
          <SectionHeading
            eyebrow={<Eyebrow tone="neutral">Filter schedule</Eyebrow>}
            title="Filter by suburb and utility type"
            description="Narrow the view to power, water, or your specific area."
          />
          <div className="flex flex-wrap gap-3">
            <input
              className="kasi-input max-w-[220px]"
              placeholder="Filter by suburb"
              value={suburb}
              onChange={(e) => setSuburb(e.target.value)}
              aria-label="Filter by suburb"
            />
            <button
              className={`chip-toggle ${type === "power" ? "chip-toggle-active" : ""}`}
              onClick={() => setType(type === "power" ? "" : "power")}
            >
              Power
            </button>
            <button
              className={`chip-toggle ${type === "water" ? "chip-toggle-active" : ""}`}
              onClick={() => setType(type === "water" ? "" : "water")}
            >
              Water
            </button>
            {(suburb || type) && (
              <button
                className="btn btn-outline btn-sm"
                onClick={() => {
                  setSuburb("");
                  setType("");
                }}
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="container pb-8">
        <div className="bento-grid md:grid-cols-12">
          <div className="feature-panel md:col-span-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="mini-stat-label">Next 48 hours</p>
                <h2 className="mt-2 text-2xl font-black">
                  Utility timeline for {suburb || "your area"}
                </h2>
                <p className="mt-2 text-sm leading-7 text-on-surface-variant">
                  The schedule should read like a planning board: when the outage starts,
                  how long it lasts, and whether the source is confirmed or estimated.
                </p>
              </div>
              {next ? (
                <span className="badge badge-warning shrink-0">
                  Starts in {timeUntil(next.startTime, now)}
                </span>
              ) : (
                <span className="badge badge-success shrink-0">No near outage</span>
              )}
            </div>
          </div>
          <div className="feature-panel md:col-span-4">
            <p className="mini-stat-label">Service providers</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {providerTags.map((provider) => (
                <span key={provider} className="badge badge-secondary">
                  {provider}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container pb-12">
        <p className="sr-only" role="status" aria-live="polite">
          {loading
            ? "Loading utility schedule"
            : `${schedules.length} scheduled outages loaded`}
        </p>

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="kasi-card skeleton h-28" />
            ))}
          </div>
        ) : schedules.length === 0 ? (
          <div className="kasi-card py-10 text-center">
            <p className="text-on-surface-variant">
              No utility outages scheduled for{" "}
              {suburb || "this area"} in the next 48 hours.
            </p>
            {(suburb || type) && (
              <button
                className="btn btn-outline btn-sm mt-4"
                onClick={() => {
                  setSuburb("");
                  setType("");
                }}
              >
                Remove filter
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(grouped).map(([day, items]) => (
              <div key={day}>
                <div className="mb-4 border-b border-outline-variant/30 pb-2">
                  <span className="text-sm font-bold uppercase tracking-[0.16em] text-outline">
                    {day}
                  </span>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {items.map((s) => (
                    <article
                      key={s._id}
                      className={`editorial-entry ${
                        s.type === "power"
                          ? "editorial-entry-danger"
                          : "editorial-entry-accent"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="mb-1 flex gap-2">
                            <span
                              className={`badge ${s.type === "power" ? "badge-warning" : "badge-info"}`}
                            >
                              {s.type === "power" ? "Power" : "Water"}
                            </span>
                            {s.stage && (
                              <span className="badge badge-secondary">
                                Stage {s.stage}
                              </span>
                            )}
                          </div>
                          <h3 className="font-bold text-on-background">
                            {s.title}
                          </h3>
                          {s.description && (
                            <p className="mt-1 text-sm text-on-surface-variant line-clamp-1">
                              {s.description}
                            </p>
                          )}
                        </div>
                        <span
                          className={`badge shrink-0 capitalize ${
                            s.status === "confirmed"
                              ? "badge-danger"
                              : s.status === "cancelled"
                              ? "badge-success"
                              : "badge-secondary"
                          }`}
                        >
                          {s.status}
                        </span>
                      </div>
                      <div className="mt-3 flex items-end justify-between border-t border-outline-variant/25 pt-3">
                        <div>
                          <p
                            className={`text-xl font-black ${
                              s.type === "power"
                                ? "text-warning"
                                : "text-primary"
                            }`}
                          >
                            {formatTime(s.startTime)} — {formatTime(s.endTime)}
                          </p>
                          <p className="text-xs text-outline">
                            {durationHours(s.startTime, s.endTime)}
                            {s.zone ? ` · Zone ${s.zone}` : ""}
                          </p>
                        </div>
                        <span className="text-xs text-outline">{s.suburb}</span>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
