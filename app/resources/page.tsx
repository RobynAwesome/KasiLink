import Link from "next/link";
import { Eyebrow, MetricGrid, SectionHeading } from "@/components/ui/PagePrimitives";

// ── Verified SA data — sourced from Structure/Information ─────────────────────
// Sources: sa-economic-stats.md, youth-employment.md, faq-gigs.md,
//          faq-water.md, faq-safety.md, service-directory.md

const ECONOMIC_STATS = [
  { label: "SA unemployment rate", value: "31.4%", helper: "Stats SA Q3 2024 — Quarterly Labour Force Survey" },
  { label: "Youth unemployment (15–34)", value: "45.5%", helper: "Stats SA Q3 2024" },
  { label: "Youth not in employment, education, or training", value: "57%", helper: "NEET rate — Stats SA 2024" },
  { label: "Expanded Public Works Programme", value: "3.5M+", helper: "Work opportunities created 2009–2024" },
  { label: "PYEI participants", value: "156,587", helper: "Presidential Youth Employment Initiative, 2020–2024" },
  { label: "NSF digital skills allocation", value: "R800M", helper: "National Skills Fund — 2025 AI and digital skills fund" },
];

const FAQ_GIGS = [
  {
    q: "What is the Expanded Public Works Programme?",
    a: "A government programme that creates work opportunities through labour-intensive projects. KasiLink can surface those opportunities so township residents can find them more easily.",
  },
  {
    q: "Who is EPWP meant to help?",
    a: "Unemployed and vulnerable people, with a focus on youth, women, and rural communities. It is a good fit for people looking for short-term work and skills exposure.",
  },
  {
    q: "Can gig work help someone build experience?",
    a: "Yes. Public works programmes often combine income support with skills exposure and work experience — useful stepping stones for people entering the labour market.",
  },
  {
    q: "What should I check before applying for an EPWP opportunity?",
    a: "Verify that the opportunity comes from an official government source or a trusted municipal channel. Fraudulent EPWP adverts do circulate — confirm before sharing personal information.",
  },
];

const FAQ_WATER = [
  {
    q: "Who is responsible for water and sanitation?",
    a: "Municipalities deliver day-to-day services. The national Department of Water and Sanitation sets the broader mandate. Contact your local municipality first when reporting a problem.",
  },
  {
    q: "Are poor households supposed to pay for basic water?",
    a: "Government provides free basic municipal services to poor households at no charge, where those services are available — including water, sanitation, and electricity for basic living.",
  },
  {
    q: "What should I do if my area has a water problem?",
    a: "Contact your local municipality or water services authority first. KasiLink's water outage reports help the community see problems early and respond together.",
  },
  {
    q: "Why does KasiLink track water alerts?",
    a: "Water outages affect dignity, health, and daily work. Community alerts help residents see problems early and plan around disruptions.",
  },
];

const FAQ_SAFETY = [
  {
    q: "Why does KasiLink include community safety features?",
    a: "Safe, stable communities are part of the conditions people need to work and earn. Government programmes link welfare, social development, and community support.",
  },
  {
    q: "Why are verified providers important?",
    a: "Verified providers reduce the trust gap between residents and service businesses. That matters in township communities where people need to know who is reliable before spending money.",
  },
  {
    q: "What is the point of reporting local incidents?",
    a: "Reporting incidents helps residents share verified community information faster. It also helps others avoid unsafe areas or respond to problems early.",
  },
  {
    q: "How does the community forum fit into safety?",
    a: "The forum gives residents a place to share local information, ask questions, and warn others about emerging problems. It works best when posts stay factual and community-focused.",
  },
];

const SERVICES = [
  {
    label: "Municipal services",
    description: "Local municipalities deliver water, electricity, sanitation, and related basic services. Start here when you need service delivery help or want to report a local issue.",
    link: "/community-status",
    linkLabel: "Community status",
  },
  {
    label: "Ward councillor",
    description: "Your ward councillor is the local political link between the municipality and the community — one of the most direct routes for raising service delivery problems.",
    link: "/incidents",
    linkLabel: "Report incident",
  },
  {
    label: "EPWP opportunities",
    description: "The Expanded Public Works Programme creates work through labour-intensive projects across infrastructure, environment, and social sectors. KasiLink can help surface these alongside private gigs.",
    link: "/marketplace",
    linkLabel: "Browse gigs",
  },
  {
    label: "Youth skills programmes",
    description: "Government programmes like PYEI, Higher Health, and NSF digital skills funding create pathways from informal gigs to sustained earning. Tutoring on KasiLink supports that journey.",
    link: "/tutoring",
    linkLabel: "Find tutoring",
  },
];

function FaqSection({ title, items }: { title: string; items: { q: string; a: string }[] }) {
  return (
    <div>
      <h3 className="mb-4 text-lg font-bold text-on-background">{title}</h3>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.q} className="kasi-card">
            <p className="font-semibold text-on-background">{item.q}</p>
            <p className="mt-2 text-sm leading-7 text-on-surface-variant">{item.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ResourcesPage() {
  return (
    <div className="pb-12">
      <section className="container page-shell">
        <div className="page-hero animate-fade-in">
          <div className="page-hero-grid">
            <div className="page-hero-copy">
              <Eyebrow>Resources</Eyebrow>
              <h1 className="page-hero-title mt-4 font-headline font-black text-on-background">
                Verified information for township workers and residents.
              </h1>
              <p className="page-hero-description">
                Facts sourced directly from Stats SA, government programmes,
                and official publications. No fabrication — every number and
                claim has a traceable source. Use this page before you gig,
                apply, or report.
              </p>
              <div className="page-hero-actions">
                <Link href="/marketplace" className="btn btn-primary btn-lg">
                  Browse gigs
                </Link>
                <Link href="/community-status" className="btn btn-outline btn-lg">
                  Community status
                </Link>
              </div>
            </div>

            <aside className="page-hero-aside">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-outline">
                SA employment context
              </p>
              <MetricGrid
                className="mt-4"
                items={[
                  { label: "SA unemployment", value: "31.4%", helper: "Stats SA Q3 2024" },
                  { label: "Youth NEET", value: "57%", helper: "Not in employment, education or training" },
                  { label: "PYEI reached", value: "156K+", helper: "Youth in employment initiatives 2020–2024" },
                ]}
              />
            </aside>
          </div>
        </div>
      </section>

      {/* SA Statistics */}
      <section className="container pb-10">
        <SectionHeading
          eyebrow={<Eyebrow tone="neutral">Verified statistics</Eyebrow>}
          title="South African employment and skills data"
          description="All figures drawn from Stats SA, government publications, and presidential reports. Zero tolerance for fabrication."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ECONOMIC_STATS.map((stat) => (
            <article key={stat.label} className="metric-card">
              <p className="metric-label">{stat.label}</p>
              <p className="metric-value">{stat.value}</p>
              <p className="metric-helper">{stat.helper}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Government Services */}
      <section className="container pb-10">
        <SectionHeading
          eyebrow={<Eyebrow tone="neutral">Government services</Eyebrow>}
          title="What public services exist and how to reach them"
          description="KasiLink complements public employment programmes — it does not replace them. These are the services residents should know about."
        />
        <div className="grid gap-4 md:grid-cols-2">
          {SERVICES.map((service) => (
            <article key={service.label} className="kasi-card flex flex-col h-full">
              <h3 className="font-bold text-on-background">{service.label}</h3>
              <p className="mt-2 flex-1 text-sm leading-7 text-on-surface-variant">{service.description}</p>
              <div className="mt-4 pt-3 border-t border-outline-variant/30">
                <Link href={service.link} className="btn btn-outline btn-sm">
                  {service.linkLabel}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* FAQs */}
      <section className="container pb-12">
        <SectionHeading
          eyebrow={<Eyebrow tone="neutral">Common questions</Eyebrow>}
          title="Gigs, water, and safety — answered from verified sources"
          description="Questions drawn from real community concerns and answered using official government and civic source material."
        />
        <div className="grid gap-8 lg:grid-cols-3">
          <FaqSection title="Gigs and employment" items={FAQ_GIGS} />
          <FaqSection title="Water and sanitation" items={FAQ_WATER} />
          <FaqSection title="Safety and community" items={FAQ_SAFETY} />
        </div>
      </section>

      {/* Source transparency */}
      <section className="container pb-12">
        <div className="surface-band text-center">
          <SectionHeading
            eyebrow={<Eyebrow tone="neutral">Source transparency</Eyebrow>}
            title="Where this information comes from"
            description="KasiLink's verified data comes from official SA government publications and statistics. Nothing is invented."
            align="center"
          />
          <div className="grid gap-3 mt-6 text-left md:grid-cols-2 lg:grid-cols-3">
            {[
              "Stats SA — Quarterly Labour Force Survey (Q3 2024)",
              "Presidential Youth Employment Initiative (PYEI) Annual Report 2024",
              "National Skills Fund — 2025 Budget Allocation",
              "Department of Water and Sanitation — Service Delivery Framework",
              "Cooperative Governance and Traditional Affairs — Local Government Report",
              "Department of Public Works — EPWP Progress Report 2024",
            ].map((source) => (
              <p key={source} className="kasi-card text-xs text-on-surface-variant leading-5">
                {source}
              </p>
            ))}
          </div>
          <p className="mt-6 text-sm text-on-surface-variant max-w-2xl mx-auto">
            If you find a factual error on this page, report it via the community forum.
            KasiLink corrects mistakes quickly and transparently.
          </p>
        </div>
      </section>
    </div>
  );
}
