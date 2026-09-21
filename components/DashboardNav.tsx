"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/dashboard/overview", label: "My Overview" },
  { href: "/dashboard/matches", label: "Matches" },
  { href: "/dashboard/seasons", label: "Seasons" },
  { href: "/dashboard/settings", label: "Settings" },
];

export function DashboardNav({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname();
  const tabs = isAdmin
    ? [...TABS, { href: "/dashboard/admin", label: "Admin" }]
    : TABS;

  return (
    <nav className="flex gap-1 overflow-x-auto">
      {tabs.map((tab) => {
        const active = pathname === tab.href || pathname.startsWith(`${tab.href}/`);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition ${
              active
                ? "bg-pitch-900 text-white"
                : "text-ink/60 hover:bg-cream-300"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
