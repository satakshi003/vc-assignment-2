"use client";

import { Search, Bell, UserCircle } from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "./ThemeToggle";

export default function Header() {
  const [search, setSearch] = useState("");

  return (
    <header className="flex h-14 items-center justify-between border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-6">
      <div className="flex flex-1 items-center">
        <div className="relative w-full max-w-md">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-neutral-400" />
          </div>
          <input
            type="text"
            className="block w-full rounded-md border-0 py-1.5 pl-10 pr-3 text-neutral-900 dark:text-neutral-100 dark:bg-neutral-900 ring-1 ring-inset ring-neutral-300 dark:ring-neutral-800 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-black dark:focus:ring-white sm:text-sm sm:leading-6"
            placeholder="Search universally..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <button className="text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 relative">
          <Bell className="h-5 w-5" />
        </button>
        <button className="flex items-center gap-2 rounded-full p-1 text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100">
          <UserCircle className="h-6 w-6" />
        </button>
      </div>
    </header>
  );
}
