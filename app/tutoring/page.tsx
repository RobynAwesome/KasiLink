"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

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
  "Mathematics", "Physical Science", "English", "Accounting",
  "Life Sciences", "Geography", "History", "Business Studies",
  "IsiXhosa", "IsiZulu", "Afrikaans",
];

export default function TutoringPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [subject, setSubject] = useState("");
  const [suburb, setSuburb] = useState("");
  const [locationFilter, setLocationFilter] = useState<"all" | "online" | "physical">(
    "all",
  );
  const [sortBy, setSortBy] = useState<"soonest" | "latest">("soonest");
  const activeFilterCount = [subject, suburb, locationFilter !== "all" ? locationFilter : ""].filter(Boolean).length;

  const clearFilters = () => {
    setLoading(true);
    setSubject("");
    setSuburb("");
    setLocationFilter("all");
    setSortBy("soonest");
  };

  useEffect(() => {
    const params = new URLSearchParams();
    if (subject) params.set("subject", subject);
    if (suburb) params.set("suburb", suburb);
    fetch(`/api/tutoring?${params.toString()}`)
      .then((r) => r.json())
      .then((d) => setSessions(d.sessions ?? []))
      .catch(() => setSessions([]))
      .finally(() => setLoading(false));
  }, [subject, suburb]);

  const visibleSessions = useMemo(() => {
    const filtered =
      locationFilter === "all"
        ? sessions
        : sessions.filter((session) => session.location === locationFilter);

    const sorted = [...filtered].sort((a, b) => {
      const aTime = new Date(a.date).getTime();
      const bTime = new Date(b.date).getTime();
      return sortBy === "latest" ? bTime - aTime : aTime - bTime;
    });

    return sorted;
  }, [sessions, locationFilter, sortBy]);

  const totalSessions = sessions.length;
  const onlineCount = sessions.filter((session) => session.location === "online").length;
  const filteredCount = visibleSessions.length;

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

  return (
    <div className="container max-w-screen-md pt-8 pb-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-headline text-3xl font-bold">Find a Tutor</h1>
          <p className="text-on-surface-variant text-sm mt-1">
            Browse available tutoring sessions in your area.
          </p>
        </div>
        <Link href="/tutoring/new" className="btn btn-primary btn-sm">
          Offer Tutoring
        </Link>
      </div>

      <div className="flex gap-3 mb-6 flex-wrap">
        <select
          className="kasi-input max-w-[200px]"
          value={subject}
          onChange={(e) => {
            setLoading(true);
            setSubject(e.target.value);
          }}
        >
          <option value="">All subjects</option>
          {SUBJECTS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
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
          className="kasi-input max-w-[180px]"
          value={locationFilter}
          onChange={(e) =>
            setLocationFilter(e.target.value as "all" | "online" | "physical")
          }
        >
          <option value="all">All locations</option>
          <option value="online">Online</option>
          <option value="physical">Physical</option>
        </select>
        <select
          className="kasi-input max-w-[180px]"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as "soonest" | "latest")}
        >
          <option value="soonest">Soonest first</option>
          <option value="latest">Latest first</option>
        </select>
        <button className="btn btn-outline btn-sm" onClick={clearFilters}>
          Clear filters
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <div className="kasi-card bg-surface-container-low text-center">
          <p className="text-xs uppercase tracking-wider text-outline mb-1">Total Sessions</p>
          <p className="text-lg font-bold">{totalSessions}</p>
        </div>
        <div className="kasi-card bg-surface-container-low text-center">
          <p className="text-xs uppercase tracking-wider text-outline mb-1">Online</p>
          <p className="text-lg font-bold">{onlineCount}</p>
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
        {subject && <span className="badge badge-secondary">Subject: {subject}</span>}
        {suburb && <span className="badge badge-secondary">Suburb: {suburb}</span>}
        {locationFilter !== "all" && (
          <span className="badge badge-secondary">
            Location: {locationFilter}
          </span>
        )}
        <span className="badge badge-info">Sort: {sortBy}</span>
      </div>

      <p className="sr-only" role="status" aria-live="polite">
        {loading
          ? "Loading tutoring sessions"
          : visibleSessions.length === 0
            ? "No tutoring sessions found"
            : `${visibleSessions.length} tutoring sessions loaded`}
      </p>

      {loading ? (
        <p className="text-on-surface-variant text-center py-8">Loading sessions...</p>
      ) : visibleSessions.length === 0 ? (
        <div className="kasi-card text-center">
          <p className="text-on-surface-variant mb-3">No tutoring sessions available right now.</p>
          {activeFilterCount > 0 && (
            <button className="btn btn-outline btn-sm mb-3" onClick={clearFilters}>
              Reset filters
            </button>
          )}
          <Link href="/tutoring/new" className="btn btn-primary btn-sm">
            Offer Your Skills
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {visibleSessions.map((s) => (
            <Link key={s._id} href={`/tutoring/${s._id}`} className="kasi-card hover:border-primary/50 transition-colors no-underline">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                      {s.subject}
                    </span>
                    <span className="bg-surface-container text-on-surface-variant text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                      {s.grade}
                    </span>
                  </div>
                  <h2 className="font-bold text-lg text-on-surface">
                    {s.subject} — {s.grade}
                  </h2>
                  <p className="text-sm text-on-surface-variant">with {s.tutorName}</p>
                </div>
                <span className="text-xs text-on-surface-variant shrink-0 bg-surface-container px-2 py-1 rounded">
                  {s.location === "online" ? "Online" : s.suburb}
                </span>
              </div>
              <div className="flex gap-4 text-xs text-outline flex-wrap mt-3">
                <span>{formatDate(s.date)}</span>
                <span>·</span>
                <span>{formatTime(s.date)}</span>
                <span>·</span>
                <span>{s.duration} min</span>
                <span>·</span>
                <span>Ref: {s.reference}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
