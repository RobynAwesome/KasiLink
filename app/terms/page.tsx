import { SectionHeading, Eyebrow } from "@/components/ui/PagePrimitives";

export const metadata = {
  title: "Terms and Privacy (POPIA) | KasiLink",
  description: "Official terms of service and POPIA data protection policy for the KasiLink platform.",
};

export default function TermsPage() {
  return (
    <div className="container py-12 pb-24 max-w-4xl">
      <header className="mb-12">
        <Eyebrow tone="neutral">Legal & Compliance</Eyebrow>
        <h1 className="text-4xl md:text-5xl font-black mt-4 tracking-tight">Terms and Privacy</h1>
        <p className="mt-4 text-on-surface-variant font-medium text-lg leading-relaxed">
          KasiLink is committed to protecting your privacy and ensuring our 
          operations comply with the Protection of Personal Information Act (POPIA) 
          of South Africa.
        </p>
      </header>

      <div className="space-y-12 text-on-surface-variant leading-loose">
        {/* Section 1: POPIA */}
        <section className="kasi-card border-outline-variant/30 bg-surface-container-low p-8">
          <h2 className="text-2xl font-black text-on-background mb-6">1. POPIA Compliance</h2>
          <div className="space-y-4">
            <p>
              Under the Protection of Personal Information Act No. 4 of 2013 (POPIA), we 
              act as the "Responsible Party" for your personal data.
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>What we collect:</strong> Phone number (via Clerk Auth), location data (for gig proximity), and gig history.</li>
              <li><strong>Purpose:</strong> Connecting local talent with nearby opportunities and maintaining community trust.</li>
              <li><strong>Consent:</strong> By signing up, you explicitly consent to the collection and processing of your data for marketplace matching.</li>
              <li><strong>Your Rights:</strong> You have the right to access, correct, or request deletion of your information at any time via your profile settings.</li>
            </ul>
          </div>
        </section>

        {/* Section 2: Terms of Use */}
        <section>
          <h2 className="text-2xl font-black text-on-background mb-6">2. Terms of Service</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-on-background">2.1 Eligibility</h3>
              <p>
                KasiLink is built for residents of Gauteng townships. You must provide 
                accurate information to build a trusted neighbourhood network.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-on-background">2.2 User Conduct</h3>
              <p>
                Spam, harassment, or fraudulent gig postings will result in an immediate 
                and permanent ban. KasiLink relies on community reports and verified 
                honesty.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-on-background">2.3 Marketplace Disclaimer</h3>
              <p>
                KasiLink is a connector, not an employer. We provide the link between 
                providers and seekers. We do not take responsibility for the quality of 
                work or payment disputes, though we provide verification tools to 
                reduce risk.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: Data Security */}
        <section className="kasi-card border-primary/20 bg-primary/5 p-8">
          <h2 className="text-2xl font-black text-primary mb-6">3. Data Security</h2>
          <p>
            We use industry-standard encryption and secure authentication via 
            <strong> Clerk</strong> to ensure your account and phone number 
            remain private. We never sell your personal data to third parties.
          </p>
        </section>
      </div>

      <footer className="mt-16 pt-8 border-t border-outline-variant/30 text-sm text-outline">
        <p>Last Updated: April 11, 2026</p>
        <p className="mt-2">Questions? Contact the KasiLink team via the community forum.</p>
      </footer>
    </div>
  );
}
