"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

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

export default function NewSpotlightBusinessPage() {
  const router = useRouter();
  const { isLoaded, isSignedIn, user } = useUser();
  const [form, setForm] = useState({
    businessName: "",
    category: "other",
    description: "",
    suburb: "",
    phone: "",
    ownerName: "",
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
    if (!form.businessName.trim()) {
      nextErrors.businessName = "Business name is required";
    }
    if (form.description.trim().length < 10) {
      nextErrors.description = "At least 10 characters";
    }
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
        setErrors(
          data.errors ?? { general: data.error ?? "Failed to create business listing" },
        );
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
    <div className="container max-w-screen-sm pt-8 pb-12">
      <h1 className="mb-2 font-headline text-3xl font-bold">List Your Business</h1>
      <p className="mb-8 text-sm text-on-surface-variant">
        Add your business to the local spotlight so people nearby can discover it.
      </p>

      {errors.general && <div className="alert alert-danger mb-5">{errors.general}</div>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="form-group">
          <label className="label" htmlFor="businessName">
            Business Name *
          </label>
          <input
            id="businessName"
            className={`kasi-input ${errors.businessName ? "border-error" : ""}`}
            placeholder="e.g. Sisonke Mobile Repairs"
            value={form.businessName}
            onChange={(e) => set("businessName", e.target.value)}
          />
          {errors.businessName && (
            <span className="error-text">{errors.businessName}</span>
          )}
        </div>

        <div className="form-group">
          <label className="label" htmlFor="category">
            Category *
          </label>
          <select
            id="category"
            className="kasi-input"
            value={form.category}
            onChange={(e) => set("category", e.target.value)}
          >
            {BUSINESS_CATEGORIES.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="label" htmlFor="description">
            Description *
          </label>
          <textarea
            id="description"
            rows={4}
            className={`kasi-input ${errors.description ? "border-error" : ""}`}
            placeholder="What do you offer, who do you serve, and what makes your business useful locally?"
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
            <label className="label" htmlFor="phone">
              Contact Number *
            </label>
            <input
              id="phone"
              className={`kasi-input ${errors.phone ? "border-error" : ""}`}
              placeholder="e.g. 071 234 5678"
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
            />
            {errors.phone && <span className="error-text">{errors.phone}</span>}
          </div>

          <div className="form-group">
            <label className="label" htmlFor="ownerName">
              Owner Name
            </label>
            <input
              id="ownerName"
              className="kasi-input"
              placeholder="Defaults to your profile name"
              value={form.ownerName}
              onChange={(e) => set("ownerName", e.target.value)}
            />
          </div>
        </div>

        <button type="submit" disabled={submitting} className="btn btn-primary btn-lg mt-2">
          {submitting ? "Publishing..." : "Publish Listing"}
        </button>
      </form>
    </div>
  );
}
