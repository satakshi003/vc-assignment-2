"use client";

import { Search, Bell, UserCircle, Menu } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";
import { useToast } from "@/lib/useToast";

interface HeaderProps {
  onMenuToggle?: () => void;
}

export default function Header({ onMenuToggle }: HeaderProps) {
  const [search, setSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { addToast } = useToast();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const query = search.trim();

      if (query) {
        addToast({
          title: "Searching companies",
          description: `Results for "${query}"`,
          type: "info"
        });

        // If already on /companies, preserve existing params (e.g. industry filter)
        if (pathname?.startsWith("/companies")) {
          const params = new URLSearchParams(window.location.search);
          params.set("q", query);
          router.push(`/companies?${params.toString()}`);
        } else {
          router.push(`/companies?q=${encodeURIComponent(query)}`);
        }
      } else {
        router.push(`/companies`);
      }

      setSearch("");
      inputRef.current?.blur();
    }
  };

  return (
    <header className="flex h-14 items-center justify-between border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3 sm:px-6 gap-3">
      {/* Hamburger — only visible on mobile */}
      <button
        onClick={onMenuToggle}
        className="flex-shrink-0 rounded-md p-2 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors lg:hidden"
        aria-label="Open navigation"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Search */}
      <div className="flex flex-1 items-center min-w-0">
        <div className="relative w-full max-w-md">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-neutral-400" />
          </div>
          <input
            ref={inputRef}
            type="text"
            className="block w-full rounded-md border-0 py-1.5 pl-10 pr-12 text-neutral-900 dark:text-neutral-100 dark:bg-neutral-900 ring-1 ring-inset ring-neutral-300 dark:ring-neutral-800 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-black dark:focus:ring-white sm:text-sm sm:leading-6 transition-all"
            placeholder="Search universally..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleSearch}
          />
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <kbd className="hidden sm:inline-block rounded border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 px-1 font-sans text-[10px] font-medium text-neutral-400 dark:text-neutral-500">
              <span className="mr-0.5">⌘</span>K
            </kbd>
          </div>
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
        <ThemeToggle />
        {/* <button className="text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 relative hidden sm:block">
          <Bell className="h-5 w-5" />
        </button>
        <button className="flex items-center gap-2 rounded-full p-1 text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100">
          <UserCircle className="h-6 w-6" />
        </button> */}
      </div>
    </header>
  );
}
