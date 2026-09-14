"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { label: 'Home', icon: 'home', path: '/' },
  { label: 'Gigs', icon: 'work', path: '/gigs' },
  { label: 'Alerts', icon: 'warning', path: '/alerts' },
  { label: 'Chat', icon: 'chat', path: '/chat' },
  { label: 'Profile', icon: 'person', path: '/profile' },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 pb-6 pt-3 bg-white dark:bg-zinc-900 rounded-t-[32px] border-t border-zinc-100 dark:border-zinc-800 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] md:hidden">
      {navItems.map((item) => {
        const isActive = pathname === item.path;
        return (
          <Link
            key={item.path}
            href={item.path}
            className={cn(
              "flex flex-col items-center justify-center px-4 py-1 transition-all duration-200 active:scale-90",
              isActive 
                ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded-full" 
                : "text-zinc-500 dark:text-zinc-400 hover:text-yellow-600 dark:hover:text-yellow-400"
            )}
          >
            <span 
              className="material-symbols-outlined text-2xl"
              style={{ fontVariationSettings: `'FILL' ${isActive ? 1 : 0}` }}
            >
              {item.icon}
            </span>
            <span className="text-[11px] font-medium mt-0.5">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
