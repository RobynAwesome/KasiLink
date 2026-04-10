import Link from "next/link";
import { SignIn } from "@clerk/nextjs";
import { Eyebrow, MetricGrid } from "@/components/ui/PagePrimitives";

export default function SignInPage() {
  return (
    <div className="container page-shell">
      <section className="page-hero animate-fade-in">
        <div className="page-hero-grid">
          <div className="page-hero-copy">
            <Eyebrow>Sign in</Eyebrow>
            <h1 className="page-hero-title mt-4 font-headline font-black text-on-background">
              Stay close to gigs, people, and local updates.
            </h1>
            <p className="page-hero-description">
              KasiLink is designed for quick mobile access. Sign in to apply for
              work, post gigs, chat with providers, and keep your neighbourhood
              activity in one place.
            </p>

            <div className="mt-6">
              <MetricGrid
                items={[
                  { label: "Auth style", value: "Phone-first", helper: "Built for low-friction access" },
                  { label: "Primary use", value: "Nearby work", helper: "Search, apply, and coordinate faster" },
                  { label: "Community layer", value: "Included", helper: "Forum, utilities, and trust signals" },
                ]}
              />
            </div>

            <div className="mt-6 rounded-xl border border-outline-variant/30 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-outline mb-2">Phone number format</p>
              <p className="text-sm text-on-surface-variant">Enter your SA mobile number with the <span className="font-mono text-primary">+27</span> country code, or start with a <span className="font-mono text-primary">0</span> — both work.</p>
              <p className="mt-2 text-xs text-outline">Example: <span className="font-mono">+27 82 123 4567</span> or <span className="font-mono">082 123 4567</span></p>
            </div>

            <div className="page-hero-actions">
              <Link href="/marketplace" className="btn btn-outline btn-lg">
                Explore first
              </Link>
            </div>
          </div>

          <aside className="page-hero-aside">
            <div className="kasi-card">
              <SignIn
                appearance={{
                  elements: {
                    rootBox: "w-full",
                    card: "shadow-none border-0 bg-transparent",
                    headerTitle: "hidden",
                    headerSubtitle: "hidden",
                    socialButtonsBlockButton: "btn btn-outline w-full justify-center",
                    formButtonPrimary: "btn btn-primary w-full justify-center",
                    formFieldInput: "kasi-input",
                    footerActionLink: "text-primary font-semibold",
                    formFieldLabel: "label",
                  },
                }}
              />
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
