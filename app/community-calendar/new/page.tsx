"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { Eyebrow, SectionHeading } from "@/components/ui/PagePrimitives";

const EVENT_TYPES = [
  { value: "job_fair", label: "Job Fair" },
  { value: "market", label: "Market" },
  { value: "meeting", label: "Meeting" },
  { value: "awareness", label: "Awareness" },
  { value: "social", label: "Social" },
  { value: "other", label: "Other" },
];

const SUBURBS = [
  "Khayelitsha", "Mitchells Plain", "Gugulethu", "Langa", "Nyanga",
  "Philippi", "Delft", "Mfuleni", "Crossroads", "Soweto", "Alexandra",
  "Tembisa", "Cape Town CBD", "Bellville", "Johannesburg CBD",
];

export default function NewCommunityEventPage() {
  const router = useRouter();
  const { isLoaded, isSignedIn, user } = useUser();
  const [form, setForm] = useState({
    type: "other", title: "", description: "", suburb: "", date: "", time: "", organizerName: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  if (isLoaded && !isSignedIn) {
    router.push("/sign-in");
    return null;
  }

  const set = (field: string, value: string) =>
    setForm((current) => ({ ...current, [field]: value }));

  const fieldClass = (name: keyof typeof form) =>
    `kasi-input ${errors[name] ? "border-error" : ""}`;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});

    const nextErrors: Record<string, string> = {};
    if (form.title.trim().length < 5) nextErrors.title = "At least 5 characters";
    if (form.description.trim().length < 10) nextErrors.description = "At least 10 characters";
    if (!form.suburb) nextErrors.suburb = "Select your suburb";
    if (!form.date) nextErrors.date = "Choose an event date";
    if (!form.time.trim()) nextErrors.time = "Provide a start time";

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/community-calendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          organizerName: form.organizerName.trim() || user?.fullName || user?.firstName || "",
          date: new Date(form.date).toISOString(),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setErrors(data.errors ?? { general: data.error ?? "Failed to create event" });
        return;
      }

      router.push("/community-calendar");
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
              <Eyebrow>Add event</Eyebrow>
              <h1 className="page-hero-title mt-4 font-headline font-black text-on-background">
                Put your event in front of people who live nearby.
              </h1>
              <p className="page-hero-description">
                Job fairs, markets, meetings, and awareness campaigns all
                belong here. Listing is free and your event appears on the
                community calendar immediately.
              </p>
              <div className="page-hero-actions">
                <Link href="/community-calendar" className="btn btn-outline btn-lg">
                  View calendar
                </Link>
              </div>
            </div>

            <aside className="page-hero-aside">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-outline">
                Listing tips
              </p>
              <div className="mt-4 space-y-3">
                <div className="kasi-card">
                  <p className="text-xs font-semibold uppercase tracking-wide text-outline mb-1">
                    Lead with the purpose
                  </p>
                  <p className="text-sm text-on-surface-variant">
                    People scan fast. Job Fair, Market, or Meeting in the
                    title makes it instantly findable.
                  </p>
                </div>
                <div className="kasi-card">
                  <p className="text-xs font-semibold uppercase tracking-wide text-outline mb-1">
                    Include the suburb
                  </p>
                  <p className="text-sm text-on-surface-variant">
                    Local context is the whole point. Residents filter by
                    where they live, not the city name.
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
              eyebrow={<Eyebrow tone="neutral">Event details</Eyebrow>}
              title="Tell the neighbourhood what is happening"
              description="Clear event type, date, time, and location are the minimum. Add a description to help people decide whether to come."
            />

            {errors.general && (
              <div className="alert alert-danger mb-5">{errors.general}</div>
            )}

            <form onSubmit={handleSubmit} className="form-grid">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="form-group">
                  <label className="label" htmlFor="type">Event type *</label>
                  <select
                    id="type"
                    className={fieldClass("type")}
                    value={form.type}
                    onChange={(e) => set("type", e.target.value)}
                  >
                    {EVENT_TYPES.map((et) => (
                      <option key={et.value} value={et.value}>{et.label}</option>
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
                  placeholder="e.g. Saturday youth jobs fair at community hall"
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
                  placeholder="Explain what is happening, who should attend, and any key details."
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                />
                {errors.description && <span className="error-text">{errors.description}</span>}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="form-group">
                  <label className="label" htmlFor="date">Date *</label>
                  <input
                    id="date"
                    type="date"
                    className={fieldClass("date")}
                    value={form.date}
                    onChange={(e) => set("date", e.target.value)}
                  />
                  {errors.date && <span className="error-text">{errors.date}</span>}
                </div>

                <div className="form-group">
                  <label className="label" htmlFor="time">Start time *</label>
                  <input
                    id="time"
                    className={fieldClass("time")}
                    placeholder="e.g. 10:00 AM"
                    value={form.time}
                    onChange={(e) => set("time", e.target.value)}
                  />
                  {errors.time && <span className="error-text">{errors.time}</span>}
                </div>
              </div>

              <div className="form-group">
                <label className="label" htmlFor="organizerName">Organizer name</label>
                <input
                  id="organizerName"
                  className="kasi-input"
                  placeholder="Defaults to your profile name"
                  value={form.organizerName}
                  onChange={(e) => set("organizerName", e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="mt-2 btn btn-primary btn-lg"
              >
                {submitting ? "Publishing…" : "Publish event"}
              </button>
            </form>
          </div>

          <aside className="form-sidebar">
            <div className="surface-band">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-outline">
                After publishing
              </p>
              <div className="mt-3 space-y-3 text-sm text-on-surface-variant">
                <p>Your event appears on the community calendar right away.</p>
                <p>Share the calendar link with people in your area so they can find it.</p>
                <p>Events are listed by date — the next upcoming show first.</p>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
