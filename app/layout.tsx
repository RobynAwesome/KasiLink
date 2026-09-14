import type { Metadata, Viewport } from "next";
import { Public_Sans, Source_Serif_4, Lexend } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/ThemeProvider";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const publicSans = Public_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-public-sans",
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
  variable: "--font-source-serif",
  display: "swap",
});

const lexend = Lexend({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-lexend",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "KasiLink — Township Gigs & Opportunities",
    template: "%s | KasiLink",
  },
  description:
    "Connecting unemployed youth and job seekers in South African townships (especially Cape Town) with nearby gigs — car washes, tutoring, cleaning, repairs, deliveries, handyman work.",
  keywords: [
    "kasilink",
    "township jobs",
    "gauteng gigs",
    "south africa jobs",
    "informal economy",
    "kasi",
  ],
  authors: [{ name: "KasiLink" }],
  creator: "KasiLink",
  metadataBase: new URL("https://kasilink.com"),
  openGraph: {
    type: "website",
    locale: "en_ZA",
    url: "https://kasilink.com",
    siteName: "KasiLink",
    title: "KasiLink — Township Gigs & Opportunities",
    description:
      "Find nearby gigs and connect with job seekers in your township. South Africa's community-first job platform.",
  },
  twitter: {
    card: "summary_large_image",
    title: "KasiLink",
    description: "Township gigs and opportunities in South Africa.",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "KasiLink",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0d1117" },
    { media: "(prefers-color-scheme: light)", color: "#fafaf8" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
        </head>
        <body className={`bg-background font-body text-on-background antialiased ${publicSans.variable} ${sourceSerif.variable} ${lexend.variable}`}>
          <a href="#main-content" className="skip-link">
            Skip to content
          </a>
          <GoogleAnalytics />
          <ThemeProvider>
            <ServiceWorkerRegistration />
            <TopBar />
            <main id="main-content" className="page-content min-h-screen">
              {children}
            </main>
            <BottomNav />
          </ThemeProvider>
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}
