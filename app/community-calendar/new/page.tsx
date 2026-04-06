"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

const EVENT_TYPES = [
  { value: "job_fair", label: "Job Fair" },
  { value: "market", label: "Market" },
  { value: "meeting", label: "Meeting" },
  { value: "awareness", label: "Awareness" },
  { value: "social", label: "Social" },
  { value: "other", label: "Other" },
];

const SUBURBS = [
  "Khayelitsha",
  "Mitchells Plain",
  "Gugulethu",
  "Langa",
  "Nyanga",
  "Philippi",
  "Delft",
  "Mfuleni",
  "Crossroads",
  "Soweto",
  "Alexandra",
  "Tembisa",
  "Cape Town CBD",
  "Bellville",
  "Johannesburg CBD",
];

export default function NewCommunityEventPage() {
  const router = useRouter();
  const { isLoaded, isSignedIn, user } = useUser();
  const [form, setForm] = useState({
    type: "other",
    title: "",
    description: "",
    suburb: "",
    date: "",
    time: "",
    organizerName: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  if (isLoaded && !isSignedIn) {
    router.push("/sign-in");
    return null;
  }

  const set = (field: string, value: string) =>
    setForm((current) => ({ ...current, [field]: value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});

    const nextErrors: Record<string, string> = {};
    if (form.title.trim().length < 5) nextErrors.title = "At least 5 characters";
    if (form.description.trim().length < 10) {
      nextErrors.description = "At least 10 characters";
    }
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
          organizerName:
            form.organizerName.trim() || user?.fullName || user?.firstName || "",
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
    <div className="container max-w-screen-sm pt-8 pb-12">
      <h1 className="mb-2 font-headline text-3xl font-bold">Add Community Event</h1>
      <p className="mb-8 text-sm text-on-surface-variant">
        Share job fairs, meetings, markets, and local opportunities with your area.
      </p>

      {errors.general && <div className="alert alert-danger mb-5">{errors.general}</div>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="form-group">
          <label className="label" htmlFor="type">
            Event Type *
          </label>
          <select
            id="type"
            className={`kasi-input ${errors.type ? "border-error" : ""}`}
            value={form.type}
            onChange={(e) => set("type", e.target.value)}
          >
            {EVENT_TYPES.map((eventType) => (
              <option key={eventType.value} value={eventType.value}>
                {eventType.label}
              </option>
            ))}
          </select>
          {errors.type && <span className="error-text">{errors.type}</span>}
        </div>

        <div className="form-group">
          <label className="label" htmlFor="title">
            Title *
          </label>
          <input
            id="title"
            className={`kasi-input ${errors.title ? "border-error" : ""}`}
            placeholder="e.g. Saturday youth jobs fair at community hall"
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
          />
          {errors.title && <span className="error-text">{errors.title}</span>}
        </div>

        <div className="form-group">
          <label className="label" htmlFor="description">
            Description *
          </label>
          <textarea
            id="description"
            rows={4}
            className={`kasi-input ${errors.description ? "border-error" : ""}`}
            placeholder="Explain what is happening, who should attend, and any key details."
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
          />
          {errors.description && (
            <span className="error-text">{errors.description}</span>
          )}
        </div>

        <div className="form-group">
          <label className="label" htmlFor="suburb">
            Suburb / Township *
          </label>
          <select
            id="suburb"
            className={`kasi-input ${errors.suburb ? "border-error" : ""}`}
            value={form.suburb}
            onChange={(e) => set("suburb", e.target.value)}
          >
            <option value="">Select suburb...</option>
            {SUBURBS.map((suburb) => (
              <option key={suburb} value={suburb}>
                {suburb}
              </option>
            ))}
          </select>
          {errors.suburb && <span className="error-text">{errors.suburb}</span>}
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="form-group">
            <label className="label" htmlFor="date">
              Date *
            </label>
            <input
              id="date"
              type="date"
              className={`kasi-input ${errors.date ? "border-error" : ""}`}
              value={form.date}
              onChange={(e) => set("date", e.target.value)}
            />
            {errors.date && <span className="error-text">{errors.date}</span>}
          </div>

          <div className="form-group">
            <label className="label" htmlFor="time">
              Time *
            </label>
            <input
              id="time"
              className={`kasi-input ${errors.time ? "border-error" : ""}`}
              placeholder="e.g. 10:00 AM"
              value={form.time}
              onChange={(e) => set("time", e.target.value)}
            />
            {errors.time && <span className="error-text">{errors.time}</span>}
          </div>
        </div>

        <div className="form-group">
          <label className="label" htmlFor="organizerName">
            Organizer Name
          </label>
          <input
            id="organizerName"
            className="kasi-input"
            placeholder="Defaults to your profile name"
            value={form.organizerName}
            onChange={(e) => set("organizerName", e.target.value)}
          />
        </div>

        <button type="submit" disabled={submitting} className="btn btn-primary btn-lg mt-2">
          {submitting ? "Publishing..." : "Publish Event"}
        </button>
      </form>
    </div>
  );
}
