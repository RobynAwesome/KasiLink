"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { Eyebrow, MetricGrid, SectionHeading } from "@/components/ui/PagePrimitives";
import { SUBURBS, inferCity, coordsForSuburb } from "@/lib/suburbs";
import UtilityRescheduler from "@/components/UtilityRescheduler";

const CATEGORIES = [
  { value: "car_wash", label: "Car Wash" },
  { value: "cleaning", label: "Cleaning" },
  { value: "tutoring", label: "Tutoring" },
  { value: "repairs", label: "Repairs" },
  { value: "delivery", label: "Delivery" },
  { value: "handyman", label: "Handyman" },
  { value: "solar", label: "Solar / Electricity" },
  { value: "retail", label: "Retail / Shop" },
  { value: "construction", label: "Construction" },
  { value: "healthcare", label: "Healthcare" },
  { value: "logistics", label: "Logistics" },
  { value: "other", label: "Other" },
];


export default function PostGigPage() {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useUser();

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    suburb: "",
    payDisplay: "",
    payType: "negotiable",
    payAmount: "",
    slots: "1",
    isUrgent: false,
    isFlexible: true,
    requirements: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const fieldClass = (name: keyof typeof form) =>
    `kasi-input ${errors[name] ? "border-error" : ""}`;

  if (isLoaded && !isSignedIn) {
    router.push("/sign-in");
    return null;
  }

  const set = (field: string, value: unknown) =>
    setForm((f) => ({ ...f, [field]: value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});

    // Client-side validation
    const errs: Record<string, string> = {};
    if (form.title.trim().length < 5) errs.title = "At least 5 characters";
    if (form.description.trim().length < 10)
      errs.description = "At least 10 characters";
    if (!form.category) errs.category = "Select a category";
    if (!form.suburb) errs.suburb = "Select your suburb";
    if (!form.payDisplay.trim())
      errs.payDisplay = "Describe the pay (e.g. R150/day)";

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/gigs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title.trim(),
          description: form.description.trim(),
          category: form.category,
          payDisplay: form.payDisplay.trim(),
          payType: form.payType,
          payAmount: form.payAmount ? parseFloat(form.payAmount) : undefined,
          slots: parseInt(form.slots) || 1,
          isUrgent: form.isUrgent,
          isFlexible: form.isFlexible,
          requirements: form.requirements
            ? form.requirements
                .split(",")
                .map((r) => r.trim())
                .filter(Boolean)
            : [],
          location: {
            type: "Point",
            coordinates: coordsForSuburb(form.suburb),
            suburb: form.suburb,
            city: inferCity(form.suburb),
          },
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setErrors(
          data.errors ?? { general: data.error ?? "Failed to post gig" },
        );
        return;
      }

      const data = await res.json();
      router.push(`/gigs/${data.gig._id}`);
    } catch {
      setErrors({ general: "Network error. Please try again." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="container page-shell">
      <section className="page-hero animate-fade-in">
        <div className="page-hero-grid">
          <div className="page-hero-copy">
            <Eyebrow>Post work fast</Eyebrow>
            <h1 className="page-hero-title mt-4 font-headline font-black text-on-background">
              Create a gig people nearby can trust and act on quickly.
            </h1>
            <p className="page-hero-description">
              Keep the brief direct, location-specific, and clear about pay.
              The better the local context, the faster the right person can
              respond.
            </p>
            <div className="page-hero-actions">
              <button
                type="button"
                className="btn btn-primary btn-lg"
                onClick={() =>
                  document.getElementById("gig-form")?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  })
                }
              >
                Start posting
              </button>
              <Link href="/marketplace" className="btn btn-outline btn-lg">
                Browse gigs first
              </Link>
            </div>
          </div>

          <aside className="page-hero-aside">
            <MetricGrid
              items={[
                { label: "Best response", value: "Local", helper: "Choose the closest suburb you can" },
                { label: "Trust cue", value: "Clear pay", helper: "State the pay format upfront" },
                { label: "Urgency", value: form.isUrgent ? "High" : "Normal", helper: "Only mark urgent if timing truly matters" },
              ]}
            />
          </aside>
        </div>
      </section>

      <div className="form-shell pt-8">
        <div className="kasi-card">
          <SectionHeading
            eyebrow={<Eyebrow tone="neutral">Gig form</Eyebrow>}
            title="Tell the neighbourhood what you need"
            description="The strongest posts are specific about the task, location, pay, and number of people needed."
          />

          {errors.general ? (
            <div className="alert alert-danger mb-5">{errors.general}</div>
          ) : null}

          <form id="gig-form" onSubmit={handleSubmit} className="form-grid">
            <div className="form-group">
              <label className="label" htmlFor="title">
                Gig title *
              </label>
              <input
                id="title"
                className={fieldClass("title")}
                placeholder="e.g. Car wash needed in Soweto"
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
              />
              <p className="input-note">
                Lead with the task and suburb so people can decide fast.
              </p>
              {errors.title ? <span className="error-text">{errors.title}</span> : null}
            </div>

            <div className="form-group">
              <label className="label" htmlFor="category">
                Category *
              </label>
              <select
                id="category"
                className={fieldClass("category")}
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
              >
                <option value="">Select a category…</option>
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
              {errors.category ? <span className="error-text">{errors.category}</span> : null}
            </div>

            <div className="form-group">
              <label className="label" htmlFor="description">
                Description *
              </label>
              <textarea
                id="description"
                className={fieldClass("description")}
                rows={5}
                placeholder="What needs to be done? Any specific tools, timing, or requirements?"
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
              />
              <p className="input-note">
                Mention timing, what success looks like, and anything that would
                affect travel or preparation.
              </p>
              {errors.description ? (
                <span className="error-text">{errors.description}</span>
              ) : null}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="form-group">
                <label className="label" htmlFor="suburb">
                  Suburb / township *
                </label>
                <select
                  id="suburb"
                  className={fieldClass("suburb")}
                  value={form.suburb}
                  onChange={(e) => set("suburb", e.target.value)}
                >
                  <option value="">Select suburb…</option>
                  {SUBURBS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                {errors.suburb ? <span className="error-text">{errors.suburb}</span> : null}
              </div>

              <div className="form-group">
                <label className="label" htmlFor="payDisplay">
                  Pay *
                </label>
                <input
                  id="payDisplay"
                  className={fieldClass("payDisplay")}
                  placeholder="e.g. R150/day, R80/car, Negotiable"
                  value={form.payDisplay}
                  onChange={(e) => set("payDisplay", e.target.value)}
                />
                {errors.payDisplay ? (
                  <span className="error-text">{errors.payDisplay}</span>
                ) : null}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="form-group">
                <label className="label" htmlFor="slots">
                  Number of people needed
                </label>
                <input
                  id="slots"
                  type="number"
                  min={1}
                  max={20}
                  className="kasi-input"
                  value={form.slots}
                  onChange={(e) => set("slots", e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="label" htmlFor="requirements">
                  Requirements
                </label>
                <input
                  id="requirements"
                  className="kasi-input"
                  placeholder="e.g. own transport, experience preferred"
                  value={form.requirements}
                  onChange={(e) => set("requirements", e.target.value)}
                />
                <p className="input-note">
                  Optional. Separate items with commas.
                </p>
              </div>
            </div>

            {form.suburb && (
              <UtilityRescheduler suburb={form.suburb} />
            )}

            <div className="grid gap-3 md:grid-cols-2">
              <label className="surface-band flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={form.isUrgent}
                  onChange={(e) => set("isUrgent", e.target.checked)}
                />
                <span className="text-sm text-on-surface-variant">
                  Mark as urgent when the job is needed as soon as possible.
                </span>
              </label>
              <label className="surface-band flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={form.isFlexible}
                  onChange={(e) => set("isFlexible", e.target.checked)}
                />
                <span className="text-sm text-on-surface-variant">
                  Keep timing flexible when you can accommodate different schedules.
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mt-2 btn btn-primary btn-lg"
            >
              {submitting ? "Posting…" : "Post gig"}
            </button>
          </form>
        </div>

        <aside className="form-sidebar">
          <div className="surface-band">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-outline">
              Posting checklist
            </p>
            <div className="mt-3 space-y-3 text-sm text-on-surface-variant">
              <p>State the suburb clearly so transport expectations are obvious.</p>
              <p>Write the pay in a familiar format like per day, per job, or negotiable.</p>
              <p>Only use urgent when the timing truly affects the outcome.</p>
            </div>
          </div>

          <div className="surface-band">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-outline">
              After posting
            </p>
            <div className="mt-3 space-y-3 text-sm text-on-surface-variant">
              <p>Reply quickly in chat once someone reaches out.</p>
              <p>Use profile and verified pages to assess trust before meeting.</p>
              <p>Keep the gig description updated if the scope changes.</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
