"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { formatRelativeTime } from "@/lib/format";
import {
  EmptyStateCard,
  Eyebrow,
  SectionHeading,
} from "@/components/ui/PagePrimitives";

const discussionTopics = [
  {
    title: "Local hustle tips",
    description:
      "Share what is working in your area, from pricing to finding repeat clients.",
  },
  {
    title: "Safety and scam alerts",
    description:
      "Post community warnings and practical checks before taking a gig.",
  },
  {
    title: "Tools, training, and referrals",
    description:
      "Exchange referrals, short courses, and resources that help people earn.",
  },
];

const featuredSignals = [
  {
    title: "Stage and utility coordination",
    body: "Use the forum when local conditions affect whether a gig or service can actually happen today.",
  },
  {
    title: "Safety and scam notes",
    body: "The strongest value of the forum is practical warnings attached to real places and real work contexts.",
  },
];

interface ForumPostData {
  _id: string;
  title: string;
  content: string;
  category: string;
  authorName: string;
  createdAt: string;
}

function ForumInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isSignedIn } = useUser();

  const [posts, setPosts] = useState<ForumPostData[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const limit = 10;

  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [category, setCategory] = useState(
    searchParams.get("category") ?? "all",
  );
  const [sortBy, setSortBy] = useState(searchParams.get("sort") ?? "newest");

  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newCategory, setNewCategory] = useState("general");
  const [postError, setPostError] = useState("");
  const [postSuccess, setPostSuccess] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const activeFilterCount = [query, category !== "all" ? category : ""].filter(Boolean).length;

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query) params.set("q", query);
      if (category && category !== "all") params.set("category", category);
      params.set("page", String(page));
      params.set("limit", String(limit));

      const res = await fetch(`/api/forum?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setPosts(data.posts ?? []);
      setTotal(data.total ?? 0);
    } catch {
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [query, category, page]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (category && category !== "all") params.set("category", category);
    if (sortBy && sortBy !== "newest") params.set("sort", sortBy);
    params.set("page", "1");
    router.replace(`/forum?${params.toString()}`, { scroll: false });
  };

  const clearFilters = () => {
    setQuery("");
    setCategory("all");
    setSortBy("newest");
    router.replace("/forum", { scroll: false });
  };

  const sortedPosts = [...posts].sort((a, b) => {
    const aTime = new Date(a.createdAt).getTime();
    const bTime = new Date(b.createdAt).getTime();
    return sortBy === "oldest" ? aTime - bTime : bTime - aTime;
  });

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setPostError("");
    setPostSuccess(false);

    if (!isSignedIn) {
      setPostError("You must be signed in to post.");
      return;
    }
    if (newTitle.trim().length < 5) {
      setPostError("Title must be at least 5 characters.");
      return;
    }
    if (newContent.trim().length < 20) {
      setPostError("Message must be at least 20 characters.");
      return;
    }

    setIsPosting(true);
    try {
      const res = await fetch("/api/forum", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle, content: newContent, category: newCategory }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create post");
      }

      setNewTitle("");
      setNewContent("");
      setNewCategory("general");
      setPostSuccess(true);
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", "1");
      router.replace(`/forum?${params.toString()}`, { scroll: false });
      fetchPosts();
    } catch (err: unknown) {
      setPostError(err instanceof Error ? err.message : "Failed to create post");
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="container page-shell max-w-6xl">
      <section className="page-hero animate-fade-in">
        <div className="page-hero-grid">
          <div className="page-hero-copy">
            <Eyebrow>Community forum</Eyebrow>
            <h1 className="page-hero-title mt-4 font-headline font-black text-on-background">
              Local advice, alerts, and work context in one shared space.
            </h1>
            <p className="page-hero-description">
              This is where the product gains neighbourhood memory: scam
              warnings, practical hustle tips, referrals, and the small details
              people need before they take a gig.
            </p>
          </div>
          <aside className="page-hero-aside">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-outline">
              Best use
            </p>
            <div className="mt-4 space-y-3">
              <div className="surface-band">
                <p className="text-sm text-on-surface-variant">
                  Use the board to surface safety checks, local demand, and
                  lessons that make work easier for the next person.
                </p>
              </div>
              <div className="surface-band">
                <p className="text-sm text-on-surface-variant">
                  Keep posts direct, useful, and tied to real places or real
                  work situations.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="py-8">
        <div className="bento-grid md:grid-cols-12">
          <div className="feature-panel-contrast md:col-span-7 text-on-background">
            <p className="mini-stat-label">Community heartbeat</p>
            <h2 className="mt-2 text-2xl font-black">
              The forum should feel like a local signal board, not a generic comment wall.
            </h2>
            <p className="mt-2 text-sm leading-7 text-on-surface-variant">
              The best posts carry place-specific context, practical warnings,
              and small pieces of operating knowledge that reduce wasted time.
            </p>
          </div>
          <div className="feature-panel md:col-span-5">
            <p className="mini-stat-label">Trust system link</p>
            <div className="impact-list mt-4">
              {featuredSignals.map((item) => (
                <div key={item.title} className="impact-row">
                  <div>
                    <p className="text-sm font-semibold">{item.title}</p>
                    <p className="text-sm text-on-surface-variant">{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 py-2 md:grid-cols-3">
        {discussionTopics.map((topic) => (
          <article key={topic.title} className="signal-tile">
            <h2 className="signal-tile-title">{topic.title}</h2>
            <p className="signal-tile-copy">{topic.description}</p>
          </article>
        ))}
      </section>

      <section className="kasi-card mb-8 border-primary/20 text-center">
        <h2 className="mb-3 font-headline text-2xl font-bold">
          Trusted Community Space
        </h2>
        <p className="mx-auto mb-6 max-w-2xl text-on-surface-variant">
          Review safety notes and find trusted individuals before taking on a
          gig.
        </p>
        <div className="flex justify-center gap-3 flex-wrap">
          <Link href="/marketplace" className="btn btn-primary">
            Browse Gigs
          </Link>
          <Link href="/verified" className="btn btn-outline">
            View Verified Providers
          </Link>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
        <div>
          <div className="filter-shell mb-6">
            <SectionHeading
              eyebrow={<Eyebrow tone="neutral">Search threads</Eyebrow>}
              title="Scan the board by topic or message"
              description="Search the conversation without losing the forum's quick, practical feel."
            />
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                type="search"
                placeholder="Search threads..."
                className="kasi-input flex-1"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && applyFilters()}
              />
              <select
                className="kasi-input"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="all">All Topics</option>
                <option value="general">General</option>
                <option value="safety">Safety Alerts</option>
                <option value="load-shedding">Load-Shedding</option>
                <option value="success_stories">Success Stories</option>
              </select>
              <button className="btn btn-primary" onClick={applyFilters}>
                Search
              </button>
              <button className="btn btn-outline" onClick={clearFilters}>
                Clear
              </button>
            </div>
            <div className="grid gap-4 md:grid-cols-[220px_1fr]">
              <div className="form-group">
                <label htmlFor="forum-sort" className="label">Sort threads</label>
                <select
                  id="forum-sort"
                  className="kasi-input"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="newest">Newest first</option>
                  <option value="oldest">Oldest first</option>
                </select>
              </div>
              <div className="flex flex-wrap items-end gap-2">
                {activeFilterCount > 0 ? (
                  <span className="badge badge-info">{activeFilterCount} active filters</span>
                ) : null}
                {sortBy !== "newest" ? (
                  <span className="badge badge-info">Sort: {sortBy}</span>
                ) : null}
                {query ? <span className="badge badge-secondary">Search: {query}</span> : null}
                {category !== "all" ? (
                  <span className="badge badge-secondary">
                    Topic: {category.replace("-", " ")}
                  </span>
                ) : null}
              </div>
            </div>
          </div>

          <p className="sr-only" role="status" aria-live="polite">
            {loading ? "Loading threads" : `${posts.length} threads loaded`}
          </p>
          <p className="sr-only" role="status" aria-live="polite">
            {postSuccess ? "Thread posted successfully." : postError ? `Posting failed: ${postError}` : ""}
          </p>

          {loading ? (
            <div className="flex flex-col gap-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="kasi-card skeleton h-32" />
              ))}
            </div>
          ) : posts.length === 0 ? (
            <EmptyStateCard
              title="No threads found"
              description="Start the conversation with a practical update, a safety note, or a useful local tip."
            />
          ) : (
            <div className="editorial-feed mb-8">
              {sortedPosts.map((post) => (
                <article
                  key={post._id}
                  className="editorial-entry editorial-entry-accent"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="badge badge-secondary capitalize">
                      {post.category.replace("-", " ")}
                    </span>
                    <span className="text-xs text-outline">
                      {formatRelativeTime(post.createdAt)}
                    </span>
                  </div>
                  <h3 className="font-bold text-xl mb-2">{post.title}</h3>
                  <p className="text-on-surface-variant text-sm mb-4 whitespace-pre-wrap break-words">
                    {post.content}
                  </p>
                  <div className="text-xs text-outline font-semibold">
                    Posted by {post.authorName}
                  </div>
                </article>
              ))}
            </div>
          )}

          {total > limit && (
            <div className="flex justify-between items-center bg-surface-container-low p-4 rounded-xl">
              <button
                className="btn btn-outline btn-sm"
                disabled={page <= 1}
                onClick={() => {
                  const params = new URLSearchParams(searchParams.toString());
                  params.set("page", String(page - 1));
                  router.replace(`/forum?${params.toString()}`, {
                    scroll: false,
                  });
                  window.scrollTo(0, 0);
                }}
              >
                ← Previous
              </button>
              <span className="text-sm text-on-surface-variant">
                Page {page} of {Math.ceil(total / limit)}
              </span>
              <button
                className="btn btn-outline btn-sm"
                disabled={page >= Math.ceil(total / limit)}
                onClick={() => {
                  const params = new URLSearchParams(searchParams.toString());
                  params.set("page", String(page + 1));
                  router.replace(`/forum?${params.toString()}`, {
                    scroll: false,
                  });
                  window.scrollTo(0, 0);
                }}
              >
                Next →
              </button>
            </div>
          )}
        </div>

        <aside>
          <div className="feature-panel sticky top-24">
            <h3 className="font-bold font-headline text-lg mb-4">
              Start a Thread
            </h3>
            <form onSubmit={handlePost} className="flex flex-col gap-4">
              {postError && (
                <div className="text-danger text-sm font-semibold" role="alert">
                  {postError}
                </div>
              )}
              {postSuccess && (
                <div className="text-success text-sm font-semibold" role="status">
                  Thread posted successfully.
                </div>
              )}
              <div>
                <label htmlFor="forum-category" className="label">Category</label>
                <select
                  id="forum-category"
                  className="kasi-input"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                >
                  <option value="general">General</option>
                  <option value="safety">Safety Alerts</option>
                  <option value="load-shedding">Load-Shedding</option>
                  <option value="success_stories">Success Stories</option>
                </select>
              </div>
              <div>
                <label htmlFor="forum-title" className="label">Title</label>
                <input
                  id="forum-title"
                  type="text"
                  className="kasi-input"
                  required
                  maxLength={150}
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
                <p className="mt-1 text-[11px] text-outline">
                  {newTitle.trim().length}/150 characters
                </p>
              </div>
              <div>
                <label htmlFor="forum-message" className="label">Message</label>
                <textarea
                  id="forum-message"
                  className="kasi-input"
                  rows={5}
                  required
                  maxLength={2000}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                ></textarea>
                <p className="mt-1 text-[11px] text-outline">
                  {newContent.trim().length}/2000 characters (minimum 20)
                </p>
              </div>
              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={
                  isPosting ||
                  !isSignedIn ||
                  newTitle.trim().length < 5 ||
                  newContent.trim().length < 20
                }
              >
                {isPosting
                  ? "Posting..."
                  : isSignedIn
                    ? "Post Thread"
                    : "Sign In to Post"}
              </button>
            </form>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default function ForumPage() {
  return (
    <Suspense
      fallback={
        <div className="container pt-8 text-center">Loading community...</div>
      }
    >
      <ForumInner />
    </Suspense>
  );
}
