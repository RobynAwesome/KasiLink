"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { Eyebrow, SectionHeading } from "@/components/ui/PagePrimitives";

const SUBJECTS = [
  "Mathematics", "Physical Science", "English", "Accounting",
  "Life Sciences", "Geography", "History", "Business Studies",
  "IsiXhosa", "IsiZulu", "Afrikaans",
];

const GRADES = [
  "Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12", "University",
];

const SUBURBS = [
  "Khayelitsha", "Mitchells Plain", "Gugulethu", "Langa", "Nyanga",
  "Philippi", "Delft", "Mfuleni", "Crossroads", "Soweto", "Alexandra",
  "Tembisa", "Soshanguve", "Mamelodi", "Diepsloot",
];

export default function NewTutoringPage() {
  const router = useRouter();
  const { isLoaded, isSignedIn, user } = useUser();
  const [form, setForm] = useState({
    subject: "", grade: "", date: "", duration: "120",
    location: "online", meetingLink: "", suburb: "", notes: "",
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
    if (!form.subject) errs.subject = "Select a subject";
    if (!form.grade) errs.grade = "Select a grade";
    if (!form.date) errs.date = "Select a date and time";
    if (!form.suburb) errs.suburb = "Select your suburb";
    const dur = parseInt(form.duration, 10);
    if (isNaN(dur) || dur < 30 || dur > 480) errs.duration = "30–480 minutes";

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/tutoring", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          duration: dur,
          tutorName: user?.fullName ?? user?.firstName ?? "Tutor",
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setErrors(data.errors ?? { general: data.error ?? "Failed to create session" });
        return;
      }
      router.push("/tutoring");
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
              <Eyebrow>Offer tutoring</Eyebrow>
              <h1 className="page-hero-title mt-4 font-headline font-black text-on-background">
                Share your skills with learners who live close by.
              </h1>
              <p className="page-hero-description">
                Township learners need local access to subject support.
                List a session — online or in person — and connect with
                students in your area who are working toward Grade 12 or
                further study.
              </p>
              <div className="page-hero-actions">
                <Link href="/tutoring" className="btn btn-outline btn-lg">
                  Browse sessions
                </Link>
              </div>
            </div>

            <aside className="page-hero-aside">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-outline">
                Session tips
              </p>
              <div className="mt-4 space-y-3">
                <div className="kasi-card">
                  <p className="text-xs font-semibold uppercase tracking-wide text-outline mb-1">
                    Online removes distance
                  </p>
                  <p className="text-sm text-on-surface-variant">
                    A Google Meet link means any learner in the area can
                    join without travel costs.
                  </p>
                </div>
                <div className="kasi-card">
                  <p className="text-xs font-semibold uppercase tracking-wide text-outline mb-1">
                    State the grade clearly
                  </p>
                  <p className="text-sm text-on-surface-variant">
                    Grade 12 sessions fill fastest. Be specific so the
                    right students find you.
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
              eyebrow={<Eyebrow tone="neutral">Session details</Eyebrow>}
              title="Set the subject, grade, time, and location"
              description="A clear listing takes less than two minutes and immediately appears in the tutoring directory."
            />

            {errors.general && (
              <div className="alert alert-danger mb-5">{errors.general}</div>
            )}

            <form onSubmit={handleSubmit} className="form-grid">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="form-group">
                  <label className="label" htmlFor="subject">Subject *</label>
                  <select
                    id="subject"
                    className={fieldClass("subject")}
                    value={form.subject}
                    onChange={(e) => set("subject", e.target.value)}
                  >
                    <option value="">Select subject…</option>
                    {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  {errors.subject && <span className="error-text">{errors.subject}</span>}
                </div>

                <div className="form-group">
                  <label className="label" htmlFor="grade">Grade *</label>
                  <select
                    id="grade"
                    className={fieldClass("grade")}
                    value={form.grade}
                    onChange={(e) => set("grade", e.target.value)}
                  >
                    <option value="">Select grade…</option>
                    {GRADES.map((g) => <option key={g} value={g}>{g}</option>)}
                  </select>
                  {errors.grade && <span className="error-text">{errors.grade}</span>}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="form-group">
                  <label className="label" htmlFor="date">Date &amp; time *</label>
                  <input
                    id="date"
                    type="datetime-local"
                    className={fieldClass("date")}
                    value={form.date}
                    onChange={(e) => set("date", e.target.value)}
                  />
                  {errors.date && <span className="error-text">{errors.date}</span>}
                </div>

                <div className="form-group">
                  <label className="label" htmlFor="duration">Duration</label>
                  <select
                    id="duration"
                    className="kasi-input"
                    value={form.duration}
                    onChange={(e) => set("duration", e.target.value)}
                  >
                    <option value="30">30 min</option>
                    <option value="60">1 hour</option>
                    <option value="90">1.5 hours</option>
                    <option value="120">2 hours</option>
                    <option value="180">3 hours</option>
                  </select>
                  {errors.duration && <span className="error-text">{errors.duration}</span>}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="form-group">
                  <label className="label" htmlFor="location">Location type *</label>
                  <select
                    id="location"
                    className="kasi-input"
                    value={form.location}
                    onChange={(e) => set("location", e.target.value)}
                  >
                    <option value="online">Online (Google Meet / Zoom)</option>
                    <option value="physical">In person</option>
                  </select>
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

              {form.location === "online" && (
                <div className="form-group">
                  <label className="label" htmlFor="meetingLink">Meeting link</label>
                  <input
                    id="meetingLink"
                    className="kasi-input"
                    placeholder="e.g. meet.google.com/abc-defg-hij"
                    value={form.meetingLink}
                    onChange={(e) => set("meetingLink", e.target.value)}
                  />
                </div>
              )}

              <div className="form-group">
                <label className="label" htmlFor="notes">Learning goals / notes</label>
                <textarea
                  id="notes"
                  rows={3}
                  className="kasi-input"
                  placeholder="e.g. Focus on trigonometry past papers. Bring a calculator."
                  value={form.notes}
                  onChange={(e) => set("notes", e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="mt-2 btn btn-primary btn-lg"
              >
                {submitting ? "Creating…" : "Create session"}
              </button>
            </form>
          </div>

          <aside className="form-sidebar">
            <div className="surface-band">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-outline">
                Why it matters
              </p>
              <div className="mt-3 space-y-3 text-sm text-on-surface-variant">
                <p>SA has 156,587 youth in employment programmes that require skills development alongside income.</p>
                <p>Local tutoring reduces the cost and distance barrier for learners without transport.</p>
                <p>One session can change a Grade 12 result — and that changes a life trajectory.</p>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
