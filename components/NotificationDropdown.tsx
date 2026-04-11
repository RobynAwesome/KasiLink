"use client";

import Link from "next/link";
import { BellIcon } from "./icons/NavIcons";
import { formatRelativeTime } from "@/lib/format";
import { AppNotification } from "./Navbar";

interface NotificationDropdownProps {
  notifications: AppNotification[];
  unreadCount: number;
  loading: boolean;
  error: string;
  show: boolean;
  onToggle: () => void;
  onRefresh: () => void;
  onClose: () => void;
  dropdownRef: React.RefObject<HTMLDivElement | null>;
}

export default function NotificationDropdown({
  notifications,
  unreadCount,
  loading,
  error,
  show,
  onToggle,
  onRefresh,
  onClose,
  dropdownRef,
}: NotificationDropdownProps) {
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={onToggle}
        className="btn btn-ghost btn-sm relative p-2 text-on-surface-variant hover:text-on-surface"
        aria-label="Notifications"
        aria-expanded={show}
        aria-controls="notifications-menu"
      >
        <BellIcon />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1.5 w-2 h-2 bg-danger rounded-full border border-background"></span>
        )}
      </button>

      {/* Notifications Dropdown */}
      {show && (
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
                onClick={onRefresh}
                className="text-[11px] text-primary hover:underline"
              >
                Refresh
              </button>
            </div>
          </div>
          {loading ? (
            <div className="px-4 py-6 text-center text-sm text-on-surface-variant">
              Loading notifications...
            </div>
          ) : error ? (
            <div className="px-4 py-6 text-center text-sm text-danger">
              <p>{error}</p>
              <button
                type="button"
                onClick={onRefresh}
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
                onClick={onClose}
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
              onClick={onClose}
              className="text-xs text-primary hover:underline"
            >
              Open activity dashboard
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
