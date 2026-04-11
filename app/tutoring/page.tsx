"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  EmptyStateCard,
  Eyebrow,
  MetricGrid,
  SectionHeading,
} from "@/components/ui/PagePrimitives";

interface Session {
  _id: string;
  tutorName: string;
  subject: string;
  grade: string;
  date: string;
  duration: number;
  location: "online" | "physical";
  suburb: string;
  notes: string;
  reference: string;
}

const SUBJECTS = [
  "Mathematics",
  "Physical Science",
  "English",
  "Accounting",
  "Life Sciences",
  "Geography",
  "History",
  "Business Studies",
  "IsiXhosa",
  "IsiZulu",
  "Afrikaans",
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-ZA", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-ZA", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function TutoringPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [subject, setSubject] = useState("");
  const [suburb, setSuburb] = useState("");
  const [locationFilter, setLocationFilter] = useState<
    "all" | "online" | "physical"
  >("all");
  const [sortBy, setSortBy] = useState<"soonest" | "latest">("soonest");

  const activeFilterCount = [
    subject,
    suburb,
    locationFilter !== "all" ? locationFilter : "",
  ].filter(Boolean).length;

  const clearFilters = () => {
    setSubject("");
    setSuburb("");
    setLocationFilter("all");
    setSortBy("soonest");
  };

  useEffect(() => {
    let cancelled = false;

    async function loadSessions() {
      setLoading(true);
      const params = new URLSearchParams();
      if (subject) params.set("subject", subject);
      if (suburb) params.set("suburb", suburb);

      try {
        const res = await fetch(`/api/tutoring?${params.toString()}`);
        const data = await res.json();
        if (!cancelled) {
          setSessions(data.sessions ?? []);
        }
      } catch {
        if (!cancelled) {
          setSessions([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadSessions();

    return () => {
      cancelled = true;
    };
  }, [subject, suburb]);

  const visibleSessions = useMemo(() => {
    const filtered =
      locationFilter === "all"
        ? sessions
        : sessions.filter((s) => s.location === locationFilter);
    return [...filtered].sort((a, b) => {
      const aTime = new Date(a.date).getTime();
      const bTime = new Date(b.date).getTime();
      return sortBy === "latest" ? bTime - aTime : aTime - bTime;
    });
  }, [sessions, locationFilter, sortBy]);

  const onlineCount = sessions.filter((s) => s.location === "online").length;

  return (
    <div className="pb-12">
      <section className="container page-shell">
        <div className="page-hero animate-fade-in">
          <div className="page-hero-grid">
            <div className="page-hero-copy">
              <Eyebrow>Tutoring</Eyebrow>
              <h1 className="page-hero-title mt-4 font-headline font-black text-on-background">
                Skills and tutoring sessions, close to home.
              </h1>
              <p className="page-hero-description">
                KasiLink connects learners with local tutors across all major
                subjects. Skills development is the pathway from informal gigs
                to sustained earning — this feature supports both.
              </p>
              <div className="page-hero-actions">
                <Link href="/tutoring/new" className="btn btn-primary btn-lg">
                  Offer tutoring
                </Link>
                <Link href="/marketplace" className="btn btn-outline btn-lg">
                  Browse gigs
                </Link>
              </div>
            </div>

            <aside className="page-hero-aside">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-outline">
                Session stats
              </p>
              <MetricGrid
                className="mt-4"
                items={[
                  {
                    label: "Available sessions",
                    value: loading ? "—" : sessions.length,
                    helper: "Across all subjects and locations",
                  },
                  {
                    label: "Online sessions",
                    value: loading ? "—" : onlineCount,
                    helper: "No travel required",
                  },
                  {
                    label: "PYEI participants",
                    value: "156K+",
                    helper: "SA youth in employment programmes",
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
            eyebrow={<Eyebrow tone="neutral">Find a session</Eyebrow>}
            title="Filter by subject, location, and suburb"
            description="Narrow to what you need — or browse everything available in your area."
          />

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="form-group">
              <label htmlFor="tutoring-subject" className="label">
                Subject
              </label>
              <select
                id="tutoring-subject"
                className="kasi-input"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              >
                <option value="">All subjects</option>
                {SUBJECTS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="tutoring-suburb" className="label">
                Suburb
              </label>
              <input
                id="tutoring-suburb"
                className="kasi-input"
                placeholder="e.g. Soweto"
                value={suburb}
                onChange={(e) => setSuburb(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="tutoring-location" className="label">
                Location type
              </label>
              <select
                id="tutoring-location"
                className="kasi-input"
                value={locationFilter}
                onChange={(e) =>
                  setLocationFilter(
                    e.target.value as "all" | "online" | "physical",
                  )
                }
              >
                <option value="all">All locations</option>
                <option value="online">Online only</option>
                <option value="physical">In-person only</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="tutoring-sort" className="label">
                Sort by
              </label>
              <select
                id="tutoring-sort"
                className="kasi-input"
                value={sortBy}
                onChange={(e) =>
                  setSortBy(e.target.value as "soonest" | "latest")
                }
              >
                <option value="soonest">Soonest first</option>
                <option value="latest">Latest first</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {activeFilterCount > 0 && (
              <>
                <span className="badge badge-info">
                  {activeFilterCount} active filter
                  {activeFilterCount !== 1 ? "s" : ""}
                </span>
                {subject && (
                  <span className="badge badge-secondary">
                    Subject: {subject}
                  </span>
                )}
                {suburb && (
                  <span className="badge badge-secondary">
                    Suburb: {suburb}
                  </span>
                )}
                {locationFilter !== "all" && (
                  <span className="badge badge-secondary">
                    Location: {locationFilter}
                  </span>
                )}
                <button
                  className="btn btn-outline btn-sm"
                  onClick={clearFilters}
                >
                  Clear all
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="container pb-8">
        <div className="bento-grid md:grid-cols-12">
          <div className="feature-panel md:col-span-8">
            <p className="mini-stat-label">Skills pathway</p>
            <h2 className="mt-2 text-2xl font-black">
              Tutoring should feel like a route from gigs into sustained earning.
            </h2>
            <p className="mt-2 text-sm leading-7 text-on-surface-variant">
              This directory supports learners and tutors who need practical,
              accessible ways to build capability without leaving their area unless necessary.
            </p>
          </div>
          <div className="feature-panel md:col-span-4">
            <p className="mini-stat-label">Session mode</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="badge badge-info">Online first</span>
              <span className="badge badge-secondary">In-person supported</span>
            </div>
          </div>
        </div>
      </section>

      <section className="container pb-12">
        <p className="sr-only" role="status" aria-live="polite">
          {loading
            ? "Loading tutoring sessions"
            : `${visibleSessions.length} sessions loaded`}
        </p>

        {loading ? (
          <div className="flex flex-col gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="kasi-card skeleton h-28" />
            ))}
          </div>
        ) : visibleSessions.length === 0 ? (
          <EmptyStateCard
            title="No sessions available"
            description="No tutoring sessions match your filters right now. Be the first to offer your skills."
            action={
              <Link href="/tutoring/new" className="btn btn-primary">
                Offer tutoring
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
            {visibleSessions.map((s, index) => (
              <Link
                key={s._id}
                href={`/tutoring/${s._id}`}
                className="editorial-entry editorial-entry-accent animate-slide-up no-underline"
                style={{ animationDelay: `${index * 40}ms` }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="mb-2 flex flex-wrap gap-2">
                      <span className="badge badge-primary">{s.subject}</span>
                      <span className="badge badge-secondary">{s.grade}</span>
                      {s.location === "online" ? (
                        <span className="badge badge-info">Online</span>
                      ) : (
                        <span className="badge badge-secondary">
                          {s.suburb}
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-on-background">
                      {s.subject} — {s.grade}
                    </h3>
                    <p className="mt-1 text-sm text-on-surface-variant">
                      with {s.tutorName}
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-4 border-t border-outline-variant/25 pt-3 text-xs text-outline">
                  <span>{formatDate(s.date)}</span>
                  <span>·</span>
                  <span>{formatTime(s.date)}</span>
                  <span>·</span>
                  <span>{s.duration} min</span>
                  {s.reference && (
                    <>
                      <span>·</span>
                      <span>Ref: {s.reference}</span>
                    </>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="container pb-12">
        <div className="surface-band">
          <SectionHeading
            eyebrow={<Eyebrow tone="neutral">Youth skills context</Eyebrow>}
            title="Skills development as the pathway to sustained earning"
            description="Government programmes like PYEI and Higher Health create the pathway from informal gigs to formal work. Tutoring on KasiLink supports that journey."
            align="center"
          />
          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                label: "PYEI participants",
                value: "156,587",
                helper: "Young people in workplace experience (2020–2024)",
              },
              {
                label: "NSF digital skills fund",
                value: "R800M",
                helper: "Allocated 2025 to close the AI and digital skills gap",
              },
              {
                label: "Higher Health reach",
                value: "250K",
                helper: "Target for civic skills programme in the next 2 years",
              },
            ].map((item) => (
              <article key={item.label} className="metric-card text-center">
                <p className="metric-label">{item.label}</p>
                <p className="metric-value">{item.value}</p>
                <p className="metric-helper">{item.helper}</p>
              </article>
            ))}
          </div>
          <p className="mx-auto mt-6 max-w-2xl text-center text-sm text-on-surface-variant">
            KasiLink is not a jobs board — it is a pathway platform. Users may
            start with informal gigs while building skills through PYEI or
            Higher Health. This tutoring feature bridges immediate income and
            longer-term skills.
          </p>
        </div>
      </section>
    </div>
  );
}
