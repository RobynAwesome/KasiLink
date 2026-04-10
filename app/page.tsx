import Link from "next/link";
import LoadSheddingWidget from "@/components/LoadSheddingWidget";
import GrokChatModal from "@/components/GrokChatModal";
import OrchDashboard from "@/components/ai/OrchDashboard";
import {
  EmptyStateCard,
  Eyebrow,
  MetricGrid,
  SectionHeading,
} from "@/components/ui/PagePrimitives";
import { getRecentGigs } from "@/features/home/recent-gigs";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const gigs = await getRecentGigs();

  const heroStats = [
    { label: "SA unemployment", value: "31.4%", helper: "Proximity and speed reduce the gap" },
    { label: "Youth without work", value: "57%", helper: "The core reality this app is built around" },
    { label: "CV required", value: "0", helper: "Local ability and speed come first" },
  ];

  const signalCards = [
    {
      title: "Utility-aware job search",
      description:
        "Check load-shedding and water disruption context before you accept a booking or dispatch work.",
      href: "/water-outages",
      cta: "Track utility alerts",
    },
    {
      title: "Trusted local providers",
      description:
        "Verified profiles and community reviews reduce risk before money, transport, or time is spent.",
      href: "/verified",
      cta: "Browse verified providers",
    },
    {
      title: "Neighbourhood coordination",
      description:
        "Forum updates help communities share availability, safety notes, and local demand in real time.",
      href: "/forum",
      cta: "Open the forum",
    },
  ];

  const quickActions = [
    { href: "/marketplace", label: "Browse live gigs", helper: "See work near you right now" },
    { href: "/gigs/new", label: "Post urgent work", helper: "Reach nearby people faster" },
    { href: "/chat", label: "Continue chats", helper: "Follow up with providers and applicants" },
    { href: "/utility-schedule", label: "Check schedules", helper: "Plan work around outages" },
  ];

  const journeySteps = [
    {
      step: "01",
      title: "Create a simple local profile",
      description: "Start with a phone number and become visible for nearby work without heavy setup.",
    },
    {
      step: "02",
      title: "Find or post work nearby",
      description: "Match by distance, category, urgency, and the trust signals that matter on the ground.",
    },
    {
      step: "03",
      title: "Coordinate directly",
      description: "Use in-app chat and community signals to confirm timing, safety, and availability quickly.",
    },
    {
      step: "04",
      title: "Build a stronger local reputation",
      description: "Completed gigs, reviews, and provider verification reinforce the trust loop over time.",
    },
  ];

  return (
    <div className="pb-12">
      <section className="container page-shell">
        <div className="page-hero animate-fade-in">
          <div className="page-hero-grid">
            <div className="page-hero-copy">
              <Eyebrow>South Africa&apos;s Township Platform</Eyebrow>
              <h1 className="page-hero-title mt-4 font-headline font-black text-on-background">
                Local gigs.{" "}
                <span className="text-primary">Near you.</span>{" "}
                Right now.
              </h1>
              <p className="page-hero-description">
                KasiLink is a township-first work network built around proximity,
                trust, and real-time local conditions. Find work, post urgent
                jobs, and coordinate without the usual distance and admin overhead.
              </p>
              <div className="page-hero-actions">
                <Link href="/marketplace" className="btn btn-primary btn-lg">
                  Find gigs near me
                </Link>
                <Link href="/gigs/new" className="btn btn-outline btn-lg">
                  Post a gig
                </Link>
              </div>
            </div>

            <aside className="page-hero-aside">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-outline">
                Why it feels different
              </p>
              <MetricGrid items={heroStats} className="mt-4" />
              <div className="mt-4 rounded-2xl border border-outline-variant/35 bg-surface-container-low p-4">
                <p className="text-sm font-semibold text-on-background">
                  Work should start closer to home.
                </p>
                <p className="mt-2 text-sm leading-7 text-on-surface-variant">
                  SA is in recovery — but township residents need tools that
                  meet them where they are now. No CV. No commute. Just nearby work.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="container pb-10">
        <MetricGrid
          items={[
            { label: "SA unemployment", value: "31.4%", helper: "Proof that proximity matters" },
            { label: "Youth without work", value: "57%", helper: "A core reality the app is built around" },
            { label: "Average gig distance", value: "5 km", helper: "Keep transport costs and time low" },
            { label: "CV required", value: "0", helper: "Local ability and speed come first" },
          ]}
        />
      </section>

      <section className="container pb-10">
        <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
          <LoadSheddingWidget />
          <OrchDashboard />
        </div>
      </section>

      <section className="container pb-12">
        <SectionHeading
          eyebrow={<Eyebrow tone="neutral">Core signals</Eyebrow>}
          title="A calmer interface for urgent local decisions"
          description="The first layer of the product should help people decide quickly: what is available, who can be trusted, and what local conditions might block the work."
        />
        <div className="grid gap-4 md:grid-cols-3">
          {signalCards.map((signal) => (
            <article key={signal.title} className="kasi-card flex h-full flex-col">
              <h3 className="text-xl font-bold">{signal.title}</h3>
              <p className="mt-3 text-sm leading-7 text-on-surface-variant">
                {signal.description}
              </p>
              <Link href={signal.href} className="mt-auto pt-5 text-sm font-semibold text-primary">
                {signal.cta} →
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="container pb-12">
        <div className="surface-band">
          <SectionHeading
            eyebrow={<Eyebrow tone="neutral">Quick actions</Eyebrow>}
            title="Move through the product without hunting for the next step"
            description="These are the highest-frequency actions in the current flow, surfaced with stronger hierarchy and faster mobile access."
          />
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {quickActions.map((action, index) => (
              <Link
                key={action.href}
                href={action.href}
                className="kasi-card animate-slide-up no-underline"
                style={{ animationDelay: `${index * 70}ms` }}
              >
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-outline">
                  Action {index + 1}
                </p>
                <p className="mt-3 text-lg font-bold text-on-background">
                  {action.label}
                </p>
                <p className="mt-2 text-sm leading-7 text-on-surface-variant">
                  {action.helper}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="container pb-12">
        <SectionHeading
          eyebrow={<Eyebrow tone="success">Marketplace pulse</Eyebrow>}
          title="Latest gigs"
          description="Fresh opportunities appear here first. The layout prioritizes category, urgency, location, and pay in one clean scan."
          action={
            <Link href="/marketplace" className="btn btn-outline btn-sm">
              See all gigs
            </Link>
          }
        />

        {gigs.length === 0 ? (
          <EmptyStateCard
            title="No gigs yet"
            description="Be the first to post a nearby opportunity and give the marketplace a local starting point."
            action={
              <Link href="/gigs/new" className="btn btn-primary">
                Post a gig
              </Link>
            }
          />
        ) : (
          <>
            <div className="sr-only" role="status" aria-live="polite">
              {gigs.length} recent gigs loaded
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {gigs.map((gig: any) => (
                <Link
                  key={gig._id}
                  href={`/gigs/${gig._id}`}
                  className="no-underline"
                >
                  <article className="kasi-card flex h-full flex-col">
                    <div className="flex flex-wrap gap-2">
                      {gig.isUrgent ? (
                        <span className="badge badge-danger">Urgent</span>
                      ) : null}
                      <span className="badge badge-primary">
                        {gig.category.replace("_", " ")}
                      </span>
                      {gig.isProviderVerified ? (
                        <span className="badge badge-success">Verified</span>
                      ) : null}
                    </div>

                    <h3 className="mt-4 text-xl font-bold">{gig.title}</h3>
                    <p className="mt-3 line-clamp-3 text-sm leading-7 text-on-surface-variant">
                      {gig.description}
                    </p>

                    <div className="mt-auto pt-5">
                      <div className="flex items-center justify-between gap-3 border-t border-outline-variant/30 pt-4">
                        <span className="text-lg font-bold text-primary">
                          {gig.payDisplay}
                        </span>
                        <span className="text-xs uppercase tracking-[0.16em] text-outline">
                          {gig.location?.suburb || "Local"}
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </>
        )}
      </section>

      <section className="container pb-12">
        <SectionHeading
          eyebrow={<Eyebrow tone="neutral">Core flow</Eyebrow>}
          title="How the product should feel"
          description="Each step is designed to reduce uncertainty: identify local demand, confirm trust, coordinate clearly, and close the work loop."
          align="center"
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {journeySteps.map((step) => (
            <article key={step.step} className="kasi-card h-full">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-outline">
                Step {step.step}
              </p>
              <h3 className="mt-3 text-lg font-bold">{step.title}</h3>
              <p className="mt-3 text-sm leading-7 text-on-surface-variant">
                {step.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="container pb-6">
        <div className="page-hero">
          <div className="page-hero-grid">
            <div className="page-hero-copy">
              <Eyebrow tone="success">Ready to start</Eyebrow>
              <h2 className="page-hero-title mt-4 font-headline font-black text-on-background">
                Join the neighbourhood work loop.
              </h2>
              <p className="page-hero-description">
                Start with the marketplace if you need work now, or create a gig
                if you need trusted local help fast.
              </p>
              <div className="page-hero-actions">
                <Link href="/sign-in" className="btn btn-primary btn-lg">
                  Get started
                </Link>
                <Link href="/verified" className="btn btn-outline btn-lg">
                  Explore trusted providers
                </Link>
              </div>
            </div>
            <div className="page-hero-aside">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-outline">
                Community pulse
              </p>
              <div className="mt-4 space-y-3">
                <div className="rounded-2xl border border-outline-variant/30 bg-surface-container-low px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-outline">
                    Browse
                  </p>
                  <p className="mt-2 text-sm text-on-surface-variant">
                    Open the marketplace to see what is available close to home.
                  </p>
                </div>
                <div className="rounded-2xl border border-outline-variant/30 bg-surface-container-low px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-outline">
                    Verify
                  </p>
                  <p className="mt-2 text-sm text-on-surface-variant">
                    Use verified profiles and reviews before you commit to travel.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <GrokChatModal />
    </div>
  );
}
