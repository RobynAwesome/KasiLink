"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Eyebrow, MetricGrid, SectionHeading } from "@/components/ui/PagePrimitives";

interface StatusData {
  powerStage: number;
  powerStatus: string;
  waterAlerts: number;
  activeIncidents: number;
  lastUpdated: string;
}

const STAGE_COLOR: Record<number, string> = {
  0: "text-success",
  1: "text-success",
  2: "text-warning",
  3: "text-warning",
  4: "text-error",
  5: "text-error",
  6: "text-error",
};

const EMERGENCY_CONTACTS = [
  { name: "Eskom Helpline", number: "0860 037 566", icon: "⚡" },
  { name: "Joburg Water", number: "011 688 1400", icon: "💧" },
  { name: "SAPS Emergency", number: "10111", icon: "🚔" },
];

export default function CommunityStatusPage() {
  const [data, setData] = useState<StatusData | null>(null);
  const [loading, setLoading] = useState(true);
  const travelReadiness = loading
    ? "—"
    : Math.max(
        28,
        100 - ((data?.powerStage ?? 0) * 12 + (data?.activeIncidents ?? 0) * 6 + (data?.waterAlerts ?? 0) * 4),
      );

  useEffect(() => {
    async function load() {
      try {
        const [lsRes, incRes, waterRes] = await Promise.all([
          fetch("/api/load-shedding").then((r) => r.json()).catch(() => null),
          fetch("/api/incidents?limit=1").then((r) => r.json()).catch(() => null),
          fetch("/api/water-alerts?limit=1").then((r) => r.json()).catch(() => null),
        ]);

        setData({
          powerStage: lsRes?.stage ?? 0,
          powerStatus: lsRes?.status ?? "Status unavailable",
          waterAlerts: waterRes?.total ?? waterRes?.alerts?.length ?? 0,
          activeIncidents: incRes?.total ?? 0,
          lastUpdated: new Date().toLocaleTimeString("en-ZA", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        });
      } catch {
        setData(null);
      } finally {
        setLoading(false);
      }
    }

    void load();
    const interval = setInterval(load, 300_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="pb-12">
      <section className="container page-shell">
        <div className="page-hero animate-fade-in">
          <div className="page-hero-grid">
            <div className="page-hero-copy">
              <Eyebrow>Community status</Eyebrow>
              <h1 className="page-hero-title mt-4 font-headline font-black text-on-background">
                Live utility and safety signals for your neighbourhood.
              </h1>
              <p className="page-hero-description">
                Power stage, water alerts, and active incidents in one place.
                Check conditions before you accept a gig, plan a job, or leave home.
              </p>
              <div className="page-hero-actions">
                <Link href="/utility-schedule" className="btn btn-primary btn-lg">
                  View utility schedule
                </Link>
                <Link href="/incidents/new" className="btn btn-outline btn-lg">
                  Report an incident
                </Link>
              </div>
            </div>

            <aside className="page-hero-aside">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-outline">
                Live signals
              </p>
              {loading ? (
                <div className="mt-4 space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="kasi-card skeleton h-16" />
                  ))}
                </div>
              ) : (
                <MetricGrid
                  className="mt-4"
                  items={[
                    {
                      label: "Power stage",
                      value: data?.powerStage === 0 ? "None" : `Stage ${data?.powerStage}`,
                      helper: data?.powerStage === 0 ? "No active load-shedding" : "Load-shedding active",
                    },
                    {
                      label: "Water alerts",
                      value: data?.waterAlerts ?? 0,
                      helper: "Active outage or pressure reports",
                    },
                    {
                      label: "Incidents",
                      value: data?.activeIncidents ?? 0,
                      helper: "Community-reported safety issues",
                    },
                  ]}
                />
              )}
            </aside>
          </div>
        </div>
      </section>

      <section className="container pb-8">
        <div className="bento-grid md:grid-cols-12">
          <div className="feature-panel md:col-span-8">
            <div className="flex items-start justify-between gap-3">
              <div>
                <Eyebrow tone="neutral">Eskom / power</Eyebrow>
                <h2 className="mt-3 text-2xl font-bold">
                  {loading
                    ? "Loading..."
                    : data?.powerStage === 0
                    ? "No load-shedding"
                    : `Load-shedding Stage ${data?.powerStage}`}
                </h2>
                <p
                  className={`mt-1 text-sm font-semibold ${
                    STAGE_COLOR[data?.powerStage ?? 0] ?? "text-success"
                  }`}
                >
                  {loading ? "Checking..." : (data?.powerStatus ?? "Status unavailable")}
                </p>
              </div>
              {!loading && (data?.powerStage ?? 0) >= 4 && (
                <span className="badge badge-danger shrink-0">High alert</span>
              )}
              {!loading && (data?.powerStage ?? 0) === 0 && (
                <span className="badge badge-success shrink-0">No active cuts</span>
              )}
            </div>
            <p className="mt-4 text-[11px] uppercase tracking-[0.16em] text-outline">
              Updated {data?.lastUpdated ?? "—"}
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="mini-stat">
                <p className="mini-stat-label">Travel readiness</p>
                <p className="mini-stat-value text-primary">{travelReadiness}%</p>
                <p className="mt-1 text-sm text-on-surface-variant">
                  Quick confidence score based on power, water, and incident pressure.
                </p>
              </div>
              <div className="mini-stat">
                <p className="mini-stat-label">Community signal</p>
                <p className="mini-stat-value">
                  {(data?.powerStage ?? 0) >= 4 || (data?.activeIncidents ?? 0) > 0 ? "Watch" : "Stable"}
                </p>
                <p className="mt-1 text-sm text-on-surface-variant">
                  Use this as a pre-gig check before you travel.
                </p>
              </div>
            </div>
            <div className="mt-4 border-t border-outline-variant/30 pt-4">
              <Link href="/utility-schedule" className="text-sm font-semibold text-primary">
                View full schedule →
              </Link>
            </div>
          </div>

          <div className="feature-panel md:col-span-4">
            <Eyebrow tone="neutral">Area confidence</Eyebrow>
            <h2 className="mt-3 text-2xl font-bold">
              {loading
                ? "Loading..."
                : `${data?.waterAlerts ?? 0} water alert${data?.waterAlerts !== 1 ? "s" : ""}`}
            </h2>
            <p className="mt-1 text-sm text-on-surface-variant">
              Municipal service failures and neighbourhood incidents can affect
              whether people can safely take or deliver work.
            </p>
            <div className="mt-5 h-2 rounded-full bg-surface-container-high">
              <div
                className="h-2 rounded-full bg-primary transition-all"
                style={{ width: `${loading ? 42 : travelReadiness}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-outline">
              Travel readiness is higher when outages and incidents stay low.
            </p>
          </div>
        </div>
      </section>

      <section className="container pb-10">
        <SectionHeading
          eyebrow={<Eyebrow tone="neutral">Incidents</Eyebrow>}
          title="Safety and community incidents"
          description="Community-reported concerns in your area. Check before you travel or take a gig."
          action={
            <Link href="/incidents/new" className="btn btn-outline btn-sm">
              Report an incident
            </Link>
          }
        />
        <div className="grid gap-4 md:grid-cols-2">
          <div className="editorial-entry editorial-entry-danger">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-outline">
              Active
            </p>
            <p className="mt-3 text-3xl font-black text-on-background">
              {loading ? "—" : (data?.activeIncidents ?? 0)}
            </p>
            <p className="mt-1 text-sm text-on-surface-variant">
              Reported incidents currently open in the system.
            </p>
            <div className="mt-4 border-t border-outline-variant/30 pt-4">
              <Link href="/incidents" className="text-sm font-semibold text-primary">
                Browse all incidents →
              </Link>
            </div>
          </div>
          <div className="editorial-entry editorial-entry-accent">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-outline">
              Report
            </p>
            <p className="mt-3 text-lg font-bold">
              Seen something the community should know?
            </p>
            <p className="mt-2 text-sm leading-7 text-on-surface-variant">
              Post a safety note, road block, or service disruption so others
              can plan around it.
            </p>
            <div className="mt-4">
              <Link href="/incidents/new" className="btn btn-primary btn-sm">
                Submit incident
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="container pb-12">
        <SectionHeading
          eyebrow={<Eyebrow tone="neutral">Emergency contacts</Eyebrow>}
          title="Key numbers for service failures"
          description="Call these directly when utility disruptions or safety issues cannot wait."
        />
        <div className="grid gap-4 sm:grid-cols-3">
          {EMERGENCY_CONTACTS.map((c) => (
            <div key={c.name} className="feature-panel flex items-center gap-4">
              <span className="text-2xl" aria-hidden="true">
                {c.icon}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-bold">{c.name}</p>
                <a
                  href={`tel:${c.number.replace(/\s/g, "")}`}
                  className="font-mono text-sm text-primary hover:underline"
                >
                  {c.number}
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
