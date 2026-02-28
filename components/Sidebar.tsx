"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, List, Search, LayoutDashboard, Settings, X } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Companies", href: "/companies", icon: Building2 },
  { name: "Saved Queries", href: "/saved", icon: Search },
  { name: "My Lists", href: "/lists", icon: List },
];

interface SidebarProps {
  onNavigate?: () => void;
}

export default function Sidebar({ onNavigate }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col border-r border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/50">
      {/* Logo row */}
      <div className="flex h-14 items-center justify-between border-b border-neutral-200 dark:border-neutral-800 px-4">
        <Link
          href="/"
          onClick={onNavigate}
          className="flex items-center gap-2 font-semibold text-neutral-900 dark:text-neutral-100"
        >
          <div className="flex h-6 w-6 items-center justify-center rounded bg-black dark:bg-white text-white dark:text-black flex-shrink-0">
            <LayoutDashboard className="h-4 w-4" />
          </div>
          <span>Ventura</span>
        </Link>
        {/* Close button — only visible on mobile */}
        <button
          onClick={onNavigate}
          className="rounded-md p-1 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors lg:hidden"
          aria-label="Close sidebar"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Nav links */}
      <div className="flex flex-1 flex-col gap-1 px-3 py-4">
        <div className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-neutral-500">
          Workspace
        </div>
        {navigation.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-neutral-200/50 dark:bg-neutral-800/50 text-neutral-900 dark:text-neutral-100"
                  : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800/50 hover:text-neutral-900 dark:hover:text-neutral-100"
              )}
            >
              <item.icon className={cn("h-4 w-4 flex-shrink-0", isActive ? "text-neutral-900 dark:text-neutral-100" : "text-neutral-500 dark:text-neutral-500")} />
              {item.name}
            </Link>
          );
        })}
      </div>

      {/* Bottom settings */}
      <div className="mt-auto border-t border-neutral-200 dark:border-neutral-800 p-4">
        <Link
          href="#"
          className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-neutral-600 dark:text-neutral-400 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800/50 hover:text-neutral-900 dark:hover:text-neutral-100"
        >
          <Settings className="h-4 w-4 flex-shrink-0 text-neutral-500 dark:text-neutral-500" />
          Settings
        </Link>
      </div>
    </div>
  );
}
