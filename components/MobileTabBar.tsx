"use client";

import Link from "next/link";

interface MobileLink {
  href: string;
  label: string;
  icon: React.ComponentType;
}

interface MobileTabBarProps {
  links: MobileLink[];
  pathname: string;
}

export default function MobileTabBar({ links, pathname }: MobileTabBarProps) {
  return (
    <div className="safe-bottom fixed inset-x-0 bottom-0 z-[205] border-t border-outline-variant/30 bg-background/92 backdrop-blur-xl md:hidden">
      <div className="container flex h-[4.9rem] items-center justify-between gap-2">
        {links.map(({ href, label, icon: Icon }) => {
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
  );
}
