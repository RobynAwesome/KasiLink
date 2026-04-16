import Link from "next/link";
import Image from "next/image";
import { MapPin, Shield, MessageSquare, TrendingUp, Zap, Users, Clock } from "lucide-react";
import LoadSheddingWidget from "@/components/LoadSheddingWidget";
import GrokChatModal from "@/components/GrokChatModal";
import {
  EmptyStateCard,
  Eyebrow,
  MetricGrid,
  SectionHeading,
} from "@/components/ui/PagePrimitives";
import { getRecentGigs } from "@/features/home/recent-gigs";

export const dynamic = "force-dynamic";

const heroStats = [
  { label: "SA unemployment", value: "31.4%", helper: "National recovery is still uneven on the ground" },
  { label: "Youth without work", value: "57%", helper: "Township-first access is still necessary" },
  { label: "CV required", value: "0", helper: "Speed, proximity, and trust lead first" },
];

const signalCards = [
  {
    title: "Utility-aware job search",
    description: "Check load-shedding and water disruption before accepting a booking or dispatching work.",
    href: "/water-outages",
    cta: "Track utility alerts",
    Icon: Zap,
  },
  {
    title: "Trusted local providers",
    description: "Verified profiles and community reviews reduce risk before money, transport, or time is spent.",
    href: "/verified",
    cta: "Browse verified providers",
    Icon: Shield,
  },
  {
    title: "Neighbourhood coordination",
    description: "Forum updates help communities share availability, safety notes, and local demand in real time.",
    href: "/forum",
    cta: "Open the forum",
    Icon: Users,
  },
];

const quickActions = [
  { href: "/marketplace", label: "Browse live gigs", helper: "See work near you right now", Icon: MapPin },
  { href: "/gigs/new", label: "Post urgent work", helper: "Reach nearby people faster", Icon: Zap },
  { href: "/chat", label: "Continue chats", helper: "Follow up with providers and applicants", Icon: MessageSquare },
  { href: "/utility-schedule", label: "Check schedules", helper: "Plan work around outages", Icon: Clock },
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

const communityLinks = [
  { href: "/incidents", label: "Report an incident", badge: "Safety" },
  { href: "/community-calendar", label: "Community calendar", badge: "Events" },
  { href: "/spotlight", label: "Business spotlight", badge: "Local" },
  { href: "/tutoring", label: "Find a tutor", badge: "Education" },
  { href: "/community-status", label: "Community status", badge: "Live" },
  { href: "/my-water-reports", label: "Water reports", badge: "Alerts" },
];

const journeySteps = [
  { step: "01", title: "Create a simple local profile", description: "Start with a phone number. Become visible for nearby work without heavy setup.", Icon: Users },
  { step: "02", title: "Find or post work nearby", description: "Match by distance, category, urgency, and the trust signals that matter on the ground.", Icon: MapPin },
  { step: "03", title: "Coordinate directly", description: "Use in-app chat and community signals to confirm timing, safety, and availability.", Icon: MessageSquare },
  { step: "04", title: "Build a stronger local reputation", description: "Completed gigs, reviews, and provider verification reinforce the trust loop over time.", Icon: TrendingUp },
];

export default async function HomePage() {
  const gigs = await getRecentGigs();

  return (
    <div className="pb-12">
      {/* ── HERO ──────────────────────────────────────────── */}
      <section className="container page-shell">
        <div className="page-hero animate-fade-in">
          <div className="page-hero-grid">
            <div className="page-hero-copy">
              {/* Logo + animation */}
              <div className="mb-5 flex items-center gap-4">
                <Image
                  src="/kasilink-logo.png"
                  alt="KasiLink"
                  width={56}
                  height={56}
                  className="rounded-2xl shadow-lg"
                  priority
                />
                <video
                  src="/kasiLink-Logo-animation.mp4"
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="h-14 w-auto rounded-xl"
                  aria-hidden="true"
                />
              </div>
              <Eyebrow>South Africa&apos;s Township Platform</Eyebrow>
              <h1 className="page-hero-title mt-4 font-headline font-black text-on-background">
                Local gigs.{" "}
                <span className="text-primary">Near you.</span>{" "}
                Right now.
              </h1>
              <p className="page-hero-description">
                KasiLink is a township-first work and services network built around proximity,
                trust, and real-time local conditions. Find work, post urgent jobs, and coordinate
                without losing momentum to distance, paperwork, or local disruption.
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
                  SA is in recovery — but township residents need tools that meet them where they
                  are now. No CV. Less commute. Faster local work.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* ── BENTO: SIGNAL PANEL + SYSTEM NOTES ──────────── */}
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
              Recovery indicators at national level do not remove the township need for hyperlocal
              work discovery. KasiLink keeps jobs, trust, and community coordination in the same
              decision space.
            </p>
            <div className="mt-5 signal-strip">
              {signalCards.map((signal) => (
                <Link key={signal.title} href={signal.href} className="signal-tile no-underline">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary mb-2">
                    <signal.Icon size={16} />
                  </div>
                  <h3 className="signal-tile-title">{signal.title}</h3>
                  <p className="signal-tile-copy">{signal.description}</p>
                  <span className="text-sm font-semibold text-primary">{signal.cta} →</span>
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
                    <p className="mt-1 text-sm text-on-surface-variant">{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── UTILITY WIDGET + COMMUNITY PULSE ────────────── */}
      <section className="container pb-10">
        <SectionHeading
          eyebrow={<Eyebrow tone="neutral">Working surface</Eyebrow>}
          title="Operational signals before the marketplace decision"
          description="Utility status and community context help you decide faster — not compete with the marketplace for attention."
        />
        <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <LoadSheddingWidget />
          <div className="feature-panel flex flex-col gap-4">
            <p className="mini-stat-label">Community channels</p>
            <div className="grid grid-cols-2 gap-2">
              {communityLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group flex flex-col gap-1 rounded-xl border border-outline-variant/30 bg-surface-container-low p-3 no-underline transition-colors hover:border-primary/40 hover:bg-primary/5"
                >
                  <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-outline">
                    {link.badge}
                  </span>
                  <span className="text-sm font-semibold text-on-background group-hover:text-primary">
                    {link.label}
                  </span>
                </Link>
              ))}
            </div>
            <Link href="/community-status" className="btn btn-outline btn-sm mt-auto w-full text-center">
              View full community status →
            </Link>
          </div>
        </div>
      </section>

      {/* ── QUICK ACTIONS ────────────────────────────────── */}
      <section className="container pb-12">
        <div className="surface-band">
          <SectionHeading
            eyebrow={<Eyebrow tone="neutral">Quick actions</Eyebrow>}
            title="Fast access for the most common local decisions"
            description="The homepage should behave like a board, not a brochure. Your next step should be visible immediately."
          />
          <div className="signal-strip">
            {quickActions.map((action, index) => (
              <Link
                key={action.href}
                href={action.href}
                className="signal-tile no-underline animate-slide-up"
                style={{ animationDelay: `${index * 70}ms` }}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary mb-2">
                  <action.Icon size={16} />
                </div>
                <p className="signal-tile-title">{action.label}</p>
                <p className="signal-tile-copy">{action.helper}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── LATEST GIGS ──────────────────────────────────── */}
      <section className="container pb-12">
        <SectionHeading
          eyebrow={<Eyebrow tone="success">Marketplace pulse</Eyebrow>}
          title="Latest gigs"
          description="Fresh opportunities appear here first. Category, urgency, location, and pay in one clean scan."
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
                <Link key={gig._id} href={`/gigs/${gig._id}`} className="no-underline">
                  <article className="kasi-card flex h-full flex-col">
                    <div className="flex flex-wrap gap-2">
                      {gig.isUrgent && <span className="badge badge-danger">Urgent</span>}
                      <span className="badge badge-primary">{gig.category.replace("_", " ")}</span>
                      {gig.isProviderVerified && <span className="badge badge-success">Verified</span>}
                    </div>
                    <h3 className="mt-4 text-xl font-bold">{gig.title}</h3>
                    <p className="mt-3 line-clamp-3 text-sm leading-7 text-on-surface-variant">
                      {gig.description}
                    </p>
                    <div className="mt-auto pt-5">
                      <div className="flex items-center justify-between gap-3 border-t border-outline-variant/30 pt-4">
                        <span className="text-lg font-bold text-primary">{gig.payDisplay}</span>
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

      {/* ── HOW IT WORKS ─────────────────────────────────── */}
      <section className="container pb-12">
        <SectionHeading
          eyebrow={<Eyebrow tone="neutral">Core flow</Eyebrow>}
          title="How the product should feel"
          description="Each step is designed to reduce uncertainty: identify local demand, confirm trust, coordinate clearly, close the work loop."
          align="center"
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {journeySteps.map((step) => (
            <article key={step.step} className="kasi-card h-full">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
                  <step.Icon size={18} />
                </div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-outline">
                  Step {step.step}
                </p>
              </div>
              <h3 className="text-lg font-bold">{step.title}</h3>
              <p className="mt-3 text-sm leading-7 text-on-surface-variant">{step.description}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ── CTA FOOTER BAND ──────────────────────────────── */}
      <section className="container pb-6">
        <div className="page-hero">
          <div className="page-hero-grid">
            <div className="page-hero-copy">
              <Eyebrow tone="success">Ready to start</Eyebrow>
              <h2 className="page-hero-title mt-4 font-headline font-black text-on-background">
                Join the neighbourhood work loop.
              </h2>
              <p className="page-hero-description">
                Start with the marketplace if you need work now, or create a gig if you need
                trusted local help fast.
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
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-outline">Browse</p>
                  <p className="mt-2 text-sm text-on-surface-variant">
                    Open the marketplace to see what is available close to home.
                  </p>
                </div>
                <div className="rounded-2xl border border-outline-variant/30 bg-surface-container-low px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-outline">Verify</p>
                  <p className="mt-2 text-sm text-on-surface-variant">
                    Use verified profiles and reviews before you commit to travel.
                  </p>
                </div>
                <div className="rounded-2xl border border-outline-variant/30 bg-surface-container-low px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-outline">Coordinate</p>
                  <p className="mt-2 text-sm text-on-surface-variant">
                    Use chat and community signals to confirm timing before you move.
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
