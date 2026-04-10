"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { Eyebrow, SectionHeading } from "@/components/ui/PagePrimitives";

const BUSINESS_CATEGORIES = [
  { value: "retail", label: "Retail" },
  { value: "food", label: "Food" },
  { value: "services", label: "Services" },
  { value: "construction", label: "Construction" },
  { value: "healthcare", label: "Healthcare" },
  { value: "education", label: "Education" },
  { value: "other", label: "Other" },
];

const SUBURBS = [
  "Khayelitsha", "Mitchells Plain", "Gugulethu", "Langa", "Nyanga",
  "Philippi", "Delft", "Mfuleni", "Crossroads", "Soweto", "Alexandra",
  "Tembisa", "Cape Town CBD", "Bellville", "Johannesburg CBD",
];

export default function NewSpotlightBusinessPage() {
  const router = useRouter();
  const { isLoaded, isSignedIn, user } = useUser();
  const [form, setForm] = useState({
    businessName: "", category: "other", description: "", suburb: "", phone: "", ownerName: "",
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
    if (!form.businessName.trim()) nextErrors.businessName = "Business name is required";
    if (form.description.trim().length < 10) nextErrors.description = "At least 10 characters";
    if (!form.suburb) nextErrors.suburb = "Select your suburb";
    if (!form.phone.trim()) nextErrors.phone = "Phone number is required";

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/spotlight", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          ownerName: form.ownerName.trim() || user?.fullName || user?.firstName || "",
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setErrors(data.errors ?? { general: data.error ?? "Failed to create business listing" });
        return;
      }

      router.push("/spotlight");
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
              <Eyebrow>List your business</Eyebrow>
              <h1 className="page-hero-title mt-4 font-headline font-black text-on-background">
                Get discovered by people living right around you.
              </h1>
              <p className="page-hero-description">
                The Business Spotlight is a free, local directory for informal
                and small township businesses. No CV, no paperwork — just a
                name, description, and contact number so nearby customers can
                reach you.
              </p>
              <div className="page-hero-actions">
                <Link href="/spotlight" className="btn btn-outline btn-lg">
                  Browse listings
                </Link>
              </div>
            </div>

            <aside className="page-hero-aside">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-outline">
                Listing guide
              </p>
              <div className="mt-4 space-y-3">
                <div className="kasi-card">
                  <p className="text-xs font-semibold uppercase tracking-wide text-outline mb-1">
                    Describe what you actually do
                  </p>
                  <p className="text-sm text-on-surface-variant">
                    Specific descriptions convert better than generic ones.
                    State the service and who it is for.
                  </p>
                </div>
                <div className="kasi-card">
                  <p className="text-xs font-semibold uppercase tracking-wide text-outline mb-1">
                    Use a reachable number
                  </p>
                  <p className="text-sm text-on-surface-variant">
                    Customers contact you directly. Make sure the number
                    accepts calls and WhatsApp.
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
              eyebrow={<Eyebrow tone="neutral">Business details</Eyebrow>}
              title="Tell the neighbourhood what you offer"
              description="A clear name, honest description, and direct contact number are all you need to get started."
            />

            {errors.general && (
              <div className="alert alert-danger mb-5">{errors.general}</div>
            )}

            <form onSubmit={handleSubmit} className="form-grid">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="form-group">
                  <label className="label" htmlFor="businessName">Business name *</label>
                  <input
                    id="businessName"
                    className={fieldClass("businessName")}
                    placeholder="e.g. Sisonke Mobile Repairs"
                    value={form.businessName}
                    onChange={(e) => set("businessName", e.target.value)}
                  />
                  {errors.businessName && <span className="error-text">{errors.businessName}</span>}
                </div>

                <div className="form-group">
                  <label className="label" htmlFor="category">Category *</label>
                  <select
                    id="category"
                    className="kasi-input"
                    value={form.category}
                    onChange={(e) => set("category", e.target.value)}
                  >
                    {BUSINESS_CATEGORIES.map((cat) => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="label" htmlFor="description">Description *</label>
                <textarea
                  id="description"
                  rows={4}
                  className={fieldClass("description")}
                  placeholder="What do you offer, who do you serve, and what makes your business useful locally?"
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                />
                {errors.description && <span className="error-text">{errors.description}</span>}
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

              <div className="grid gap-4 md:grid-cols-2">
                <div className="form-group">
                  <label className="label" htmlFor="phone">Contact number *</label>
                  <input
                    id="phone"
                    className={fieldClass("phone")}
                    placeholder="e.g. 071 234 5678"
                    value={form.phone}
                    onChange={(e) => set("phone", e.target.value)}
                  />
                  {errors.phone && <span className="error-text">{errors.phone}</span>}
                </div>

                <div className="form-group">
                  <label className="label" htmlFor="ownerName">Owner name</label>
                  <input
                    id="ownerName"
                    className="kasi-input"
                    placeholder="Defaults to your profile name"
                    value={form.ownerName}
                    onChange={(e) => set("ownerName", e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="mt-2 btn btn-primary btn-lg"
              >
                {submitting ? "Publishing…" : "Publish listing"}
              </button>
            </form>
          </div>

          <aside className="form-sidebar">
            <div className="surface-band">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-outline">
                What happens next
              </p>
              <div className="mt-3 space-y-3 text-sm text-on-surface-variant">
                <p>Your listing appears on the Business Spotlight immediately.</p>
                <p>Customers in your suburb will see your business when they filter by area.</p>
                <p>Verified listings get a trust badge — visit your profile to request verification.</p>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
