"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser, SignInButton, UserButton } from "@clerk/nextjs";
import { useCallback, useEffect, useRef, useState } from "react";
import { ThemeToggle } from "@/components/ThemeProvider";
import { formatRelativeTime } from "@/lib/format";

// Icons as inline SVG to avoid extra deps
const BriefcaseIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="7" width="20" height="14" rx="2" />
    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
  </svg>
);

const HomeIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const UsersIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const MessageIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const PlusIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const MenuIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const XIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const ZapIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="none"
  >
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const BellIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

interface AppNotification {
  _id: string;
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

const navLinks = [
  { href: "/", label: "Home", icon: HomeIcon },
  { href: "/marketplace", label: "Find Gigs", icon: BriefcaseIcon },
  { href: "/forum", label: "Community", icon: UsersIcon },
  { href: "/verified", label: "Verified", icon: UsersIcon },
  { href: "/chat", label: "Messages", icon: MessageIcon },
];

export default function Navbar() {
  const pathname = usePathname();
  const { isSignedIn, isLoaded } = useUser();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationsLoading, setNotificationsLoading] = useState(true);
  const [notificationsError, setNotificationsError] = useState("");
  const notificationsRef = useRef<HTMLDivElement>(null);
  const mobilePrimaryLinks = [
    { href: "/", label: "Home", icon: HomeIcon },
    { href: "/marketplace", label: "Gigs", icon: BriefcaseIcon },
    { href: "/forum", label: "Forum", icon: UsersIcon },
    { href: "/chat", label: "Chat", icon: MessageIcon },
    {
      href: isLoaded && isSignedIn ? "/profile" : "/sign-in",
      label: isLoaded && isSignedIn ? "Profile" : "Join",
      icon: UsersIcon,
    },
  ];

  const refreshNotifications = useCallback(async () => {
    if (!isLoaded || !isSignedIn) return;
    setNotificationsLoading(true);
    setNotificationsError("");
    try {
      const res = await fetch("/api/notifications");
      if (!res.ok) {
        throw new Error("Failed to load notifications.");
      }
      const data = await res.json();
      const nextNotifications = data.notifications ?? [];
      setNotifications(nextNotifications);
      setUnreadCount(
        nextNotifications.filter((n: AppNotification) => !n.isRead).length,
      );
    } catch {
      setNotificationsError("Failed to load notifications.");
    } finally {
      setNotificationsLoading(false);
    }
  }, [isLoaded, isSignedIn]);

  // Scroll shadow effect
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Fetch notifications
  useEffect(() => {
    void refreshNotifications();
  }, [refreshNotifications]);

  const handleToggleNotifs = async () => {
    const newState = !showNotifs;
    setShowNotifs(newState);
    if (newState && unreadCount > 0) {
      setUnreadCount(0);
      try {
        await fetch("/api/notifications", { method: "PATCH" });
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      } catch (err) {
        console.error("Failed to mark notifications as read", err);
      }
    }
  };

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target as Node)
      ) {
        setShowNotifs(false);
      }
    };

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowNotifs(false);
        setMobileOpen(false);
      }
    };

    window.addEventListener("mousedown", onPointerDown);
    window.addEventListener("keydown", onEscape);
    return () => {
      window.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("keydown", onEscape);
    };
  }, []);

  return (
    <>
      <nav
        aria-label="Primary navigation"
        className={`fixed top-0 left-0 right-0 z-[200] border-b bg-background/86 backdrop-blur-xl transition-all duration-250 ${
          scrolled
            ? "border-outline-variant/40 shadow-[0_20px_45px_rgba(0,0,0,0.16)]"
            : "border-transparent"
        }`}
      >
        <div className="container flex h-[4.1rem] items-center gap-6">
          {/* Logo */}
          <Link
            href="/"
            className="flex shrink-0 items-center gap-3 no-underline"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-primary text-on-primary shadow-[0_10px_24px_rgba(69,149,192,0.35)]">
              <ZapIcon />
            </span>
            <span className="min-w-0">
              <span className="block text-lg font-black tracking-tight text-on-background">
                Kasi<span className="text-primary">Link</span>
              </span>
              <span className="hide-mobile block text-[10px] uppercase tracking-[0.22em] text-outline">
                Township-first work network
              </span>
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden flex-1 items-center gap-1 md:flex">
            {navLinks.map(({ href, label }) => {
              const active =
                pathname === href ||
                (href !== "/" && pathname.startsWith(href));
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => {
                    setMobileOpen(false);
                    setShowNotifs(false);
                  }}
                  className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm transition-all ${
                    active
                      ? "bg-primary-container font-semibold text-primary"
                      : "font-medium text-on-surface-variant hover:bg-surface-container-high/60 hover:text-on-surface"
                  }`}
                  aria-current={active ? "page" : undefined}
                >
                  {label}
                </Link>
              );
            })}
          </div>

          {/* Right side actions */}
          <div className="ml-auto flex items-center gap-3">
            <div className="hide-mobile rounded-full border border-outline-variant/35 bg-surface-container-low px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-outline md:block">
              Utility-aware hiring
            </div>
            <ThemeToggle />

            {/* Post gig CTA (signed in only) */}
            {isLoaded && isSignedIn && (
              <Link
                href="/gigs/new"
                className="hidden gap-1 md:inline-flex btn btn-primary btn-sm"
              >
                <PlusIcon />
                Post Gig
              </Link>
            )}

            {/* Auth */}
            {isLoaded &&
              (isSignedIn ? (
                <div className="flex items-center gap-3">
                  <div className="relative" ref={notificationsRef}>
                    <button
                      onClick={handleToggleNotifs}
                      className="btn btn-ghost btn-sm relative p-2 text-on-surface-variant hover:text-on-surface"
                      aria-label="Notifications"
                      aria-expanded={showNotifs}
                      aria-controls="notifications-menu"
                    >
                      <BellIcon />
                      {unreadCount > 0 && (
                        <span className="absolute top-1 right-1.5 w-2 h-2 bg-danger rounded-full border border-background"></span>
                      )}
                    </button>

                    {/* Notifications Dropdown */}
                    {showNotifs && (
                      <div
                        id="notifications-menu"
                        role="menu"
                        aria-label="Notifications"
                        className="absolute right-0 z-50 mt-2 flex max-h-[400px] w-72 flex-col overflow-y-auto rounded-2xl border border-outline-variant/30 bg-surface-container-lowest py-2 shadow-lg animate-fade-in slide-in-from-top-2"
                      >
                        <div className="px-4 py-2 border-b border-outline-variant/30 mb-1">
                          <div className="flex items-center justify-between gap-2">
                            <h3 className="font-bold text-sm">Notifications</h3>
                            <button
                              type="button"
                              onClick={() => void refreshNotifications()}
                              className="text-[11px] text-primary hover:underline"
                            >
                              Refresh
                            </button>
                          </div>
                        </div>
                        {notificationsLoading ? (
                          <div className="px-4 py-6 text-center text-sm text-on-surface-variant">
                            Loading notifications...
                          </div>
                        ) : notificationsError ? (
                          <div className="px-4 py-6 text-center text-sm text-danger">
                            <p>{notificationsError}</p>
                            <button
                              type="button"
                              onClick={() => void refreshNotifications()}
                              className="mt-3 btn btn-outline btn-sm"
                            >
                              Retry
                            </button>
                          </div>
                        ) : notifications.length === 0 ? (
                          <div className="px-4 py-6 text-center text-sm text-on-surface-variant">
                            No new notifications.
                          </div>
                        ) : (
                          notifications.map((n) => (
                            <Link
                              key={n._id}
                              href={n.link || "#"}
                              onClick={() => setShowNotifs(false)}
                              role="menuitem"
                              className="flex flex-col gap-1 border-b border-outline-variant/10 px-4 py-3 transition-colors last:border-0 hover:bg-surface-variant/50"
                            >
                              <span className="text-sm font-bold text-on-background leading-tight flex items-center gap-2">
                                {n.title}
                                {!n.isRead && (
                                  <span className="inline-block h-2 w-2 rounded-full bg-primary" />
                                )}
                              </span>
                              <span className="text-xs text-on-surface-variant leading-snug">
                                {n.message}
                              </span>
                              <span className="text-[10px] text-outline mt-1">
                                {formatRelativeTime(n.createdAt)}
                              </span>
                            </Link>
                          ))
                        )}
                        <div className="px-3 pt-2 border-t border-outline-variant/20">
                          <Link
                            href="/profile"
                            className="text-xs text-primary hover:underline"
                          >
                            Open activity dashboard
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                  <UserButton
                    appearance={{
                      elements: {
                        avatarBox: { width: 34, height: 34 },
                      },
                    }}
                  />
                </div>
              ) : (
                <SignInButton mode="modal">
                  <button className="btn btn-primary btn-sm">Sign In</button>
                </SignInButton>
              ))}

            {/* Mobile menu toggle */}
            <button
              className="btn btn-ghost btn-sm p-2 md:hidden"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <XIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="flex flex-col gap-2 border-t border-outline-variant/30 bg-surface-container-low p-4 md:hidden">
            <div className="mb-2 rounded-2xl border border-outline-variant/30 bg-surface-container px-4 py-3">
              <p className="text-[10px] uppercase tracking-[0.18em] text-outline">
                Quick move
              </p>
              <p className="mt-1 text-sm text-on-surface-variant">
                Stay close to gigs, messages, and community updates.
              </p>
            </div>
            {navLinks.map(({ href, label, icon: Icon }) => {
              const active =
                pathname === href ||
                (href !== "/" && pathname.startsWith(href));
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-base transition-colors ${
                    active
                      ? "bg-primary-container font-semibold text-primary"
                      : "font-medium text-on-background hover:bg-primary-subtle"
                  }`}
                  aria-current={active ? "page" : undefined}
                >
                  <Icon />
                  {label}
                </Link>
              );
            })}

            {isLoaded && isSignedIn && (
              <Link
                href="/gigs/new"
                onClick={() => setMobileOpen(false)}
                className="mt-2 justify-center btn btn-primary"
              >
                <PlusIcon />
                Post a Gig
              </Link>
            )}

            {isLoaded && !isSignedIn && (
              <SignInButton mode="modal">
                <button className="mt-2 w-full btn btn-primary">
                  Sign In to KasiLink
                </button>
              </SignInButton>
            )}
          </div>
        )}
      </nav>

      <div className="safe-bottom fixed inset-x-0 bottom-0 z-[205] border-t border-outline-variant/30 bg-background/92 backdrop-blur-xl md:hidden">
        <div className="container flex h-[4.9rem] items-center justify-between gap-2">
          {mobilePrimaryLinks.map(({ href, label, icon: Icon }) => {
            const active =
              pathname === href || (href !== "/" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={`flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-semibold transition-colors ${
                  active
                    ? "bg-primary-container text-primary"
                    : "text-on-surface-variant"
                }`}
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-2xl">
                  <Icon />
                </span>
                <span className="truncate">{label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
