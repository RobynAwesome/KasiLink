"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { Eyebrow } from "@/components/ui/PagePrimitives";

interface Review {
  _id: string;
  seekerName: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

interface ProviderProfile {
  clerkId: string;
  displayName: string;
  category: string;
  rating: number;
  reviewCount: number;
  verified?: boolean;
  verifiedAt?: string | null;
  location: string;
  about: string;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="text-warning font-bold">
      {"★".repeat(Math.round(rating))}{"☆".repeat(5 - Math.round(rating))}
    </span>
  );
}

export default function VerifiedProviderProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [provider, setProvider] = useState<ProviderProfile | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    Promise.all([
      fetch(`/api/users/${id}`).then((res) => res.json()),
      fetch(`/api/reviews?providerId=${id}`).then((res) => res.json()),
    ])
      .then(([providerData, reviewData]) => {
        if (!active) return;
        setProvider(providerData.provider ?? null);
        setReviews(reviewData.reviews ?? []);
      })
      .catch((err) => console.error("Failed to fetch provider profile", err))
      .finally(() => { if (active) setLoading(false); });

    return () => { active = false; };
  }, [id]);

  if (loading) {
    return (
      <div className="pb-12">
        <section className="container page-shell">
          <div className="space-y-4">
            <div className="kasi-card skeleton h-10 w-32" />
            <div className="kasi-card skeleton h-48" />
          </div>
        </section>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="container pt-8 pb-12 text-center">
        <p className="text-on-surface-variant mb-4">Provider not found.</p>
        <Link href="/verified" className="btn btn-primary">Back to directory</Link>
      </div>
    );
  }

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : provider.rating.toFixed(1);

  return (
    <div className="pb-12">
      <section className="container page-shell">
        <div className="mb-6">
          <Link href="/verified" className="text-sm text-primary hover:underline">
            ← Back to directory
          </Link>
        </div>

        <div className="page-hero animate-fade-in">
          <div className="page-hero-grid">
            <div className="page-hero-copy">
              <Eyebrow tone={provider.verified !== false ? "success" : "neutral"}>
                {provider.verified !== false ? "Verified provider" : "Provider profile"}
              </Eyebrow>
              <h1 className="page-hero-title mt-4 font-headline font-black text-on-background">
                {provider.displayName}
              </h1>
              <p className="mt-2 text-base text-on-surface-variant">
                {provider.category} · {provider.location}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <StarRating rating={Number(avgRating)} />
                <span className="font-bold text-on-background">{avgRating}</span>
                <span className="text-sm text-outline">({reviews.length} review{reviews.length !== 1 ? "s" : ""})</span>
                {provider.verifiedAt && (
                  <span className="text-xs text-outline">
                    Verified {new Date(provider.verifiedAt).toLocaleDateString("en-ZA", { month: "short", year: "numeric" })}
                  </span>
                )}
              </div>
              <p className="page-hero-description mt-4">{provider.about}</p>
              <div className="page-hero-actions">
                <Link href="/chat" className="btn btn-primary btn-lg">
                  Message provider
                </Link>
                <Link href="/marketplace" className="btn btn-outline btn-lg">
                  Browse gigs
                </Link>
              </div>
            </div>

            <aside className="page-hero-aside">
              <div className="kasi-card">
                <div className="flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 text-primary font-black text-4xl mx-auto mb-4">
                  {provider.displayName.charAt(0)}
                </div>
                <div className="text-center">
                  {provider.verified !== false && (
                    <span className="badge badge-success mb-2 inline-block">Verified</span>
                  )}
                  <p className="font-bold text-lg text-on-background">{provider.displayName}</p>
                  <p className="text-sm text-outline mt-1">{provider.category}</p>
                  <p className="text-sm text-outline">{provider.location}</p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="container pb-12">
        <div className="mb-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-outline mb-1">
            Community reviews
          </p>
          <h2 className="text-2xl font-bold font-headline text-on-background">
            What people say
          </h2>
        </div>

        {reviews.length === 0 ? (
          <div className="kasi-card py-10 text-center text-on-surface-variant">
            No reviews yet. Reviews appear here after gig completions.
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {reviews.map((review, index) => (
              <article
                key={review._id}
                className="kasi-card animate-slide-up"
                style={{ animationDelay: `${index * 40}ms` }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-sm shrink-0">
                      {review.seekerName.charAt(0)}
                    </div>
                    <span className="font-semibold text-on-background">{review.seekerName}</span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="text-warning">★</span>
                    <span className="text-sm font-bold text-on-background">{review.rating}</span>
                  </div>
                </div>
                {review.comment && (
                  <p className="mt-3 text-sm text-on-surface-variant leading-7">{review.comment}</p>
                )}
                <p className="mt-3 text-[11px] uppercase tracking-[0.16em] text-outline">
                  {new Date(review.createdAt).toLocaleDateString("en-ZA", {
                    day: "numeric", month: "short", year: "numeric",
                  })}
                </p>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
