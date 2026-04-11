"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  EmptyStateCard,
  Eyebrow,
  MetricGrid,
  SectionHeading,
} from "@/components/ui/PagePrimitives";

interface CommunityEvent {
  _id: string;
  type: "job_fair" | "market" | "meeting" | "awareness" | "social" | "other";
  title: string;
  description: string;
  suburb: string;
  date: string;
  time: string;
}

const TYPE_LABELS: Record<CommunityEvent["type"], string> = {
  job_fair: "Job Fair",
  market: "Market",
  meeting: "Meeting",
  awareness: "Awareness",
  social: "Social",
  other: "Other",
};

const TYPE_BADGE: Record<CommunityEvent["type"], string> = {
  job_fair: "badge-success",
  market: "badge-primary",
  meeting: "badge-secondary",
  awareness: "badge-info",
  social: "badge-secondary",
  other: "badge-secondary",
};

export default function CommunityCalendarPage() {
  const [events, setEvents] = useState<CommunityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [suburb, setSuburb] = useState("");
  const [type, setType] = useState("all");

  const activeFilterCount = [suburb, type !== "all" ? type : ""].filter(
    Boolean,
  ).length;

  useEffect(() => {
    let cancelled = false;

    async function loadEvents() {
      setLoading(true);
      const params = new URLSearchParams();
      if (suburb) params.set("suburb", suburb);
      if (type && type !== "all") params.set("type", type);

      try {
        const res = await fetch(`/api/community-calendar?${params.toString()}`);
        const data = await res.json();
        if (!cancelled) {
          setEvents(data.events ?? []);
        }
      } catch {
        if (!cancelled) {
          setEvents([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadEvents();

    return () => {
      cancelled = true;
    };
  }, [suburb, type]);

  const suburbs = useMemo(
    () => [...new Set(events.map((e) => e.suburb))].filter(Boolean),
    [events],
  );

  const jobFairCount = events.filter((e) => e.type === "job_fair").length;
  const highlightedEvent = events[0] ?? null;
  const highlightedDay = highlightedEvent
    ? new Date(highlightedEvent.date).getDate()
    : new Date().getDate();
  const monthLabel = highlightedEvent
    ? new Date(highlightedEvent.date).toLocaleDateString("en-ZA", {
        month: "long",
        year: "numeric",
      })
    : new Date().toLocaleDateString("en-ZA", {
        month: "long",
        year: "numeric",
      });
  const monthDays = Array.from({ length: 14 }, (_, i) => i + 1);

  return (
    <div className="pb-12">
      <section className="container page-shell">
        <div className="page-hero animate-fade-in">
          <div className="page-hero-grid">
            <div className="page-hero-copy">
              <Eyebrow>Community calendar</Eyebrow>
              <h1 className="page-hero-title mt-4 font-headline font-black text-on-background">
                Local events, job fairs, and community meetups.
              </h1>
              <p className="page-hero-description">
                Job fairs, markets, awareness events, and neighbourhood
                meetings — all in one place. Add your own event so people close
                to home can find it without hunting across platforms.
              </p>
              <div className="page-hero-actions">
                <Link
                  href="/community-calendar/new"
                  className="btn btn-primary btn-lg"
                >
                  Add an event
                </Link>
                <Link href="/forum" className="btn btn-outline btn-lg">
                  Community forum
                </Link>
              </div>
            </div>

            <aside className="page-hero-aside">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-outline">
                Calendar stats
              </p>
              <MetricGrid
                className="mt-4"
                items={[
                  {
                    label: "Upcoming events",
                    value: loading ? "—" : events.length,
                    helper: "Community-submitted listings",
                  },
                  {
                    label: "Job fairs",
                    value: loading ? "—" : jobFairCount,
                    helper: "Employment-focused events",
                  },
                  {
                    label: "Free to list",
                    value: "Yes",
                    helper: "No cost to add your event",
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
            eyebrow={<Eyebrow tone="neutral">Filter events</Eyebrow>}
            title="Narrow by suburb or event type"
            description="Find what is happening close to home or focus on the type of event that matters to you."
          />

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <div className="form-group">
              <label htmlFor="cal-suburb" className="label">
                Suburb
              </label>
              <select
                id="cal-suburb"
                className="kasi-input"
                value={suburb}
                onChange={(e) => setSuburb(e.target.value)}
              >
                <option value="">All suburbs</option>
                {suburbs.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="cal-type" className="label">
                Event type
              </label>
              <select
                id="cal-type"
                className="kasi-input"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="all">All types</option>
                {Object.entries(TYPE_LABELS).map(([v, l]) => (
                  <option key={v} value={v}>
                    {l}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group flex items-end">
              <button
                className="btn btn-outline w-full"
                onClick={() => {
                  setSuburb("");
                  setType("all");
                }}
                disabled={activeFilterCount === 0}
              >
                Clear filters
              </button>
            </div>
          </div>

          {activeFilterCount > 0 && (
            <div className="flex flex-wrap gap-2">
              <span className="badge badge-info">
                {activeFilterCount} active filter
                {activeFilterCount !== 1 ? "s" : ""}
              </span>
              {suburb && (
                <span className="badge badge-secondary">
                  Suburb: {suburb}
                </span>
              )}
              {type !== "all" && (
                <span className="badge badge-primary">
                  Type: {TYPE_LABELS[type as CommunityEvent["type"]] ?? type}
                </span>
              )}
            </div>
          )}
        </div>
      </section>

      <section className="container pb-8">
        <div className="bento-grid md:grid-cols-12">
          <div className="calendar-shell md:col-span-7">
            <div className="flex items-center justify-between">
              <div>
                <p className="mini-stat-label">{monthLabel}</p>
                <h2 className="mt-2 text-2xl font-black">Calendar view</h2>
              </div>
              <span className="badge badge-primary">Live community listings</span>
            </div>
            <div className="mt-5 calendar-grid-shell">
              {["S", "M", "T", "W", "T", "F", "S"].map((label, index) => (
                <div key={`${label}-${index}`} className="text-center text-[11px] font-bold uppercase tracking-[0.16em] text-outline">
                  {label}
                </div>
              ))}
              {monthDays.map((day) => (
                <div
                  key={day}
                  className={`calendar-day ${day === highlightedDay ? "calendar-day-active" : ""}`}
                >
                  <span className="text-sm font-semibold">{day}</span>
                  <div className="flex gap-1">
                    {day === highlightedDay ? (
                      <>
                        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                        <span className="h-1.5 w-1.5 rounded-full bg-info" />
                      </>
                    ) : day % 4 === 0 ? (
                      <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="feature-panel md:col-span-5">
            <p className="mini-stat-label">Featured date</p>
            <h2 className="mt-2 text-2xl font-black">
              {highlightedEvent ? highlightedEvent.title : "Nothing highlighted yet"}
            </h2>
            <p className="mt-2 text-sm leading-7 text-on-surface-variant">
              {highlightedEvent
                ? highlightedEvent.description
                : "Add a job fair, market, or community meeting so local residents can discover it quickly."}
            </p>
            {highlightedEvent ? (
              <div className="mt-4 flex flex-wrap gap-2">
                <span className={`badge ${TYPE_BADGE[highlightedEvent.type] ?? "badge-secondary"}`}>
                  {TYPE_LABELS[highlightedEvent.type]}
                </span>
                <span className="badge badge-secondary">{highlightedEvent.suburb}</span>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <section className="container pb-12">
        <p className="sr-only" role="status" aria-live="polite">
          {loading
            ? "Loading events"
            : `${events.length} events loaded`}
        </p>

        {loading ? (
          <div className="grid gap-4 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="kasi-card skeleton h-36" />
            ))}
          </div>
        ) : events.length === 0 ? (
          <EmptyStateCard
            title="No events in this area yet"
            description="Be the first to add a local event — job fairs, markets, community meetings, and awareness campaigns all belong here."
            action={
              <Link href="/community-calendar/new" className="btn btn-primary">
                Add an event
              </Link>
            }
            secondary={
              activeFilterCount > 0 ? (
                <button
                  className="btn btn-outline"
                  onClick={() => {
                    setSuburb("");
                    setType("all");
                  }}
                >
                  Reset filters
                </button>
              ) : undefined
            }
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {events.map((event, index) => (
              <article
                key={event._id}
                className="editorial-entry editorial-entry-accent animate-slide-up flex h-full flex-col"
                style={{ animationDelay: `${index * 40}ms` }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <span
                      className={`badge ${TYPE_BADGE[event.type] ?? "badge-secondary"} mb-2`}
                    >
                      {TYPE_LABELS[event.type]}
                    </span>
                    <h3 className="text-lg font-bold leading-tight">
                      {event.title}
                    </h3>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-sm font-semibold text-on-background">
                      {new Date(event.date).toLocaleDateString("en-ZA", {
                        day: "numeric",
                        month: "short",
                      })}
                    </p>
                    <p className="text-xs text-outline">{event.time}</p>
                  </div>
                </div>

                <p className="mt-3 text-sm leading-7 text-on-surface-variant">
                  {event.description}
                </p>

                <p className="mt-auto pt-4 text-[11px] uppercase tracking-[0.16em] text-outline">
                  {event.suburb}
                </p>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
