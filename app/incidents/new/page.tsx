"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { Eyebrow, SectionHeading } from "@/components/ui/PagePrimitives";

const INCIDENT_TYPES = [
  { value: "safety", label: "Safety Concern" },
  { value: "load_shedding", label: "Load Shedding Alert" },
  { value: "water_outage", label: "Water Outage" },
  { value: "road", label: "Road Problem" },
  { value: "other", label: "Other" },
];

const SUBURBS = [
  "Khayelitsha", "Mitchells Plain", "Gugulethu", "Langa", "Nyanga",
  "Philippi", "Delft", "Mfuleni", "Crossroads", "Soweto", "Alexandra",
  "Tembisa", "Cape Town CBD", "Bellville", "Johannesburg CBD",
];

export default function ReportIncidentPage() {
  const router = useRouter();
  const { isLoaded, isSignedIn, user } = useUser();
  const [form, setForm] = useState({
    type: "", title: "", description: "", suburb: "", severity: "medium",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  if (isLoaded && !isSignedIn) {
    router.push("/sign-in");
    return null;
  }

  const set = (field: string, value: string) =>
    setForm((f) => ({ ...f, [field]: value }));

  const fieldClass = (name: keyof typeof form) =>
    `kasi-input ${errors[name] ? "border-error" : ""}`;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});

    const errs: Record<string, string> = {};
    if (!form.type) errs.type = "Select an incident type";
    if (form.title.trim().length < 5) errs.title = "At least 5 characters";
    if (form.description.trim().length < 10) errs.description = "At least 10 characters";
    if (!form.suburb) errs.suburb = "Select your suburb";

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/incidents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          reporterName: user?.fullName ?? user?.firstName ?? "Anonymous",
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setErrors(data.errors ?? { general: data.error ?? "Failed to submit" });
        return;
      }
      router.push("/incidents");
    } catch {
      setErrors({ general: "Network error. Please try again." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="pb-12">
      <section className="container page-shell">
        <div className="page-hero animate-fade-in">
          <div className="page-hero-grid">
            <div className="page-hero-copy">
              <Eyebrow tone="danger">Report incident</Eyebrow>
              <h1 className="page-hero-title mt-4 font-headline font-black text-on-background">
                Alert the community about safety or service issues.
              </h1>
              <p className="page-hero-description">
                Safety concerns, road problems, and utility outages affect
                everyone close by. A clear, direct report helps neighbours
                plan around it and gives responders something to act on.
              </p>
              <div className="page-hero-actions">
                <Link href="/incidents" className="btn btn-outline btn-lg">
                  View all incidents
                </Link>
              </div>
            </div>

            <aside className="page-hero-aside">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-outline">
                Reporting guide
              </p>
              <div className="mt-4 space-y-3">
                <div className="kasi-card">
                  <p className="text-xs font-semibold uppercase tracking-wide text-outline mb-1">
                    Be specific
                  </p>
                  <p className="text-sm text-on-surface-variant">
                    Name the street, section, or block. Vague reports are
                    harder to act on.
                  </p>
                </div>
                <div className="kasi-card">
                  <p className="text-xs font-semibold uppercase tracking-wide text-outline mb-1">
                    Set severity honestly
                  </p>
                  <p className="text-sm text-on-surface-variant">
                    High means dangerous or widespread. Low means a nuisance
                    that can wait.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="container pb-12">
        <div className="form-shell">
          <div className="kasi-card">
            <SectionHeading
              eyebrow={<Eyebrow tone="neutral">Incident form</Eyebrow>}
              title="Describe what is happening and where"
              description="Be direct. State the location, what you have seen, and how serious it is."
            />

            {errors.general && (
              <div className="alert alert-danger mb-5">{errors.general}</div>
            )}

            <form onSubmit={handleSubmit} className="form-grid">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="form-group">
                  <label className="label" htmlFor="type">Incident type *</label>
                  <select
                    id="type"
                    className={fieldClass("type")}
                    value={form.type}
                    onChange={(e) => set("type", e.target.value)}
                  >
                    <option value="">Select type…</option>
                    {INCIDENT_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                  {errors.type && <span className="error-text">{errors.type}</span>}
                </div>

                <div className="form-group">
                  <label className="label" htmlFor="suburb">Suburb / township *</label>
                  <select
                    id="suburb"
                    className={fieldClass("suburb")}
                    value={form.suburb}
                    onChange={(e) => set("suburb", e.target.value)}
                  >
                    <option value="">Select suburb…</option>
                    {SUBURBS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  {errors.suburb && <span className="error-text">{errors.suburb}</span>}
                </div>
              </div>

              <div className="form-group">
                <label className="label" htmlFor="title">Title *</label>
                <input
                  id="title"
                  className={fieldClass("title")}
                  placeholder="e.g. Water off in Section B since 6am"
                  value={form.title}
                  onChange={(e) => set("title", e.target.value)}
                />
                {errors.title && <span className="error-text">{errors.title}</span>}
              </div>

              <div className="form-group">
                <label className="label" htmlFor="description">Description *</label>
                <textarea
                  id="description"
                  rows={4}
                  className={fieldClass("description")}
                  placeholder="Describe what is happening, where exactly, and how people are affected."
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                />
                {errors.description && <span className="error-text">{errors.description}</span>}
              </div>

              <div className="form-group">
                <label className="label" htmlFor="severity">Severity</label>
                <select
                  id="severity"
                  className="kasi-input"
                  value={form.severity}
                  onChange={(e) => set("severity", e.target.value)}
                >
                  <option value="low">Low — Minor issue, not urgent</option>
                  <option value="medium">Medium — Affects daily life</option>
                  <option value="high">High — Dangerous or widespread</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="mt-2 btn btn-primary btn-lg"
              >
                {submitting ? "Submitting…" : "Submit report"}
              </button>
            </form>
          </div>

          <aside className="form-sidebar">
            <div className="surface-band">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-outline">
                After you report
              </p>
              <div className="mt-3 space-y-3 text-sm text-on-surface-variant">
                <p>Your report becomes visible on the incidents board immediately.</p>
                <p>Other community members can confirm or add context to the same issue.</p>
                <p>Emergency contacts: Eskom 0860 037 566 · SAPS 10111 · Joburg Water 011 688 1400</p>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
