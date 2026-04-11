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

const heroStats = [
  {
    label: "SA unemployment",
    value: "31.4%",
    helper: "National recovery is still uneven on the ground",
  },
  {
    label: "Youth without work",
    value: "57%",
    helper: "Township-first access is still necessary",
  },
  {
    label: "CV required",
    value: "0",
    helper: "Speed, proximity, and trust lead first",
  },
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
  {
    href: "/marketplace",
    label: "Browse live gigs",
    helper: "See work near you right now",
  },
  {
    href: "/gigs/new",
    label: "Post urgent work",
    helper: "Reach nearby people faster",
  },
  {
    href: "/chat",
    label: "Continue chats",
    helper: "Follow up with providers and applicants",
  },
  {
    href: "/utility-schedule",
    label: "Check schedules",
    helper: "Plan work around outages",
  },
];

const localSystemNotes = [
  {
    title: "Township-first by design",
    body: "KasiLink is not a generic jobs board. It is a proximity and coordination layer built for township work and services.",
  },
  {
    title: "Proximity lowers failure cost",
    body: "Distance is a real economic variable. Nearby matching reduces transport spend, travel uncertainty, and failed work attempts.",
  },
  {
    title: "Trust is part of the product",
    body: "Verified providers, forum context, and utility awareness work together as one trust system instead of disconnected features.",
  },
];

const journeySteps = [
  {
    step: "01",
    title: "Create a simple local profile",
    description:
      "Start with a phone number and become visible for nearby work without heavy setup.",
  },
  {
    step: "02",
    title: "Find or post work nearby",
    description:
      "Match by distance, category, urgency, and the trust signals that matter on the ground.",
  },
  {
    step: "03",
    title: "Coordinate directly",
    description:
      "Use in-app chat and community signals to confirm timing, safety, and availability quickly.",
  },
  {
    step: "04",
    title: "Build a stronger local reputation",
    description:
      "Completed gigs, reviews, and provider verification reinforce the trust loop over time.",
  },
];

export default async function HomePage() {
  const gigs = await getRecentGigs();

  return (
    <div className="pb-12">
      <section className="container page-shell">
        <div className="page-hero animate-fade-in">
          <div className="page-hero-grid">
            <div className="page-hero-copy">
              <Eyebrow>South Africa&apos;s Township Platform</Eyebrow>
              <h1 className="page-hero-title mt-4 font-headline font-black text-on-background">
                Local gigs. <span className="text-primary">Near you.</span> Right
                now.
              </h1>
              <p className="page-hero-description">
                KasiLink is a township-first work and services network built
                around proximity, trust, and real-time local conditions. Find
                work, post urgent jobs, and coordinate without losing momentum
                to distance, paperwork, or local disruption.
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
                  South Africa may be in recovery, but township-level work
                  access still depends on local speed, local trust, and lower
                  travel risk. No CV. Less commute. Faster local work.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="container pb-10">
        <div className="bento-grid md:grid-cols-12">
          <div className="feature-panel-contrast md:col-span-7 text-on-background">
            <div className="flex items-center gap-3">
              <span className="badge badge-primary">Live local board</span>
              <span className="text-xs uppercase tracking-[0.16em] text-outline">
                Township-first infrastructure
              </span>
            </div>
            <h2 className="mt-4 text-3xl font-black">
              Local work discovery should absorb reality instead of ignoring it.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-on-surface-variant">
              Recovery indicators at national level do not remove the township
              need for hyperlocal work discovery. KasiLink keeps jobs, trust,
              and community coordination in the same decision space.
            </p>
            <div className="mt-5 signal-strip">
              {signalCards.map((signal) => (
                <Link
                  key={signal.title}
                  href={signal.href}
                  className="signal-tile no-underline"
                >
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-outline">
                    Core signal
                  </p>
                  <h3 className="signal-tile-title">{signal.title}</h3>
                  <p className="signal-tile-copy">{signal.description}</p>
                  <span className="text-sm font-semibold text-primary">
                    {signal.cta} →
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <div className="feature-panel md:col-span-5">
            <p className="mini-stat-label">What the product leads with</p>
            <div className="impact-list mt-4">
              {localSystemNotes.map((item) => (
                <div key={item.title} className="impact-row">
                  <div>
                    <p className="text-sm font-semibold">{item.title}</p>
                    <p className="text-sm text-on-surface-variant">
                      {item.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container pb-10">
        <SectionHeading
          eyebrow={<Eyebrow tone="neutral">Working surface</Eyebrow>}
          title="Operational signals before the marketplace decision"
          description="Utility status and support intelligence should help users decide faster, not compete with the marketplace for attention."
        />
        <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
          <LoadSheddingWidget />
          <div className="space-y-3">
            <div className="feature-panel">
              <p className="mini-stat-label">Support intelligence</p>
              <h3 className="mt-2 text-xl font-black">
                Orch is supporting infrastructure.
              </h3>
              <p className="mt-2 text-sm leading-7 text-on-surface-variant">
                The product remains township work and services first. Orch
                should appear as a supporting decision layer for routing,
                insight, and fallback context.
              </p>
            </div>
            <OrchDashboard />
          </div>
        </div>
      </section>

      <section className="container pb-12">
        <SectionHeading
          eyebrow={<Eyebrow tone="neutral">Core actions</Eyebrow>}
          title="Fast actions for the most common local decisions"
          description="The homepage should behave like a board, not a brochure. The next step should be visible immediately on mobile and desktop."
        />
        <div className="signal-strip">
          {quickActions.map((action, index) => (
            <Link
              key={action.href}
              href={action.href}
              className="signal-tile animate-slide-up no-underline"
              style={{ animationDelay: `${index * 70}ms` }}
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-outline">
                Action {index + 1}
              </p>
              <p className="signal-tile-title">{action.label}</p>
              <p className="signal-tile-copy">{action.helper}</p>
            </Link>
          ))}
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
                  <article className="directory-card directory-card-soft">
                    <div className="directory-card-header">
                      <div className="directory-card-meta">
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
                      <span className="mini-stat-value text-primary">
                        {gig.payDisplay}
                      </span>
                    </div>

                    <div className="directory-card-body">
                      <h3 className="text-xl font-bold">{gig.title}</h3>
                      <p className="directory-card-detail line-clamp-3">
                        {gig.description}
                      </p>
                    </div>

                    <div className="directory-card-footer">
                      <span className="text-xs uppercase tracking-[0.16em] text-outline">
                        {gig.location?.suburb || "Local"}
                      </span>
                      <span className="text-sm font-semibold text-on-surface-variant">
                        {gig.providerName || "Community provider"}
                      </span>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </>
        )}
      </section>

      <section className="container pb-12">
        <div className="surface-band">
          <SectionHeading
            eyebrow={<Eyebrow tone="neutral">Why this framing</Eyebrow>}
            title="The homepage has one job: make the local work loop obvious."
            description="It should explain the system quickly, show which signals matter, and push users into the right route without over-explaining Orch."
            align="center"
          />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {journeySteps.map((step) => (
              <article key={step.step} className="signal-tile">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-outline">
                  Step {step.step}
                </p>
                <h3 className="signal-tile-title">{step.title}</h3>
                <p className="signal-tile-copy">{step.description}</p>
              </article>
            ))}
          </div>
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
