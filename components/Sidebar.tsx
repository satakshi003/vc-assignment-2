"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, List, Search, LayoutDashboard, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Companies", href: "/companies", icon: Building2 },
  { name: "Saved Queries", href: "/saved", icon: Search },
  { name: "My Lists", href: "/lists", icon: List },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col border-r border-neutral-200 bg-neutral-50/50">
      <div className="flex h-14 items-center border-b border-neutral-200 px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold text-neutral-900">
          <div className="flex h-6 w-6 items-center justify-center rounded bg-black text-white">
            <LayoutDashboard className="h-4 w-4" />
          </div>
          <span>Ventura</span>
        </Link>
      </div>

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
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-neutral-200/50 text-neutral-900"
                  : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
              )}
            >
              <item.icon className={cn("h-4 w-4", isActive ? "text-neutral-900" : "text-neutral-500")} />
              {item.name}
            </Link>
          );
        })}
      </div>

      <div className="mt-auto border-t border-neutral-200 p-4">
        <Link
          href="#"
          className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
        >
          <Settings className="h-4 w-4 text-neutral-500" />
          Settings
        </Link>
      </div>
    </div>
  );
}
