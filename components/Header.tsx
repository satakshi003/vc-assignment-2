"use client";

import { Search, Bell, UserCircle } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";
import { useToast } from "@/lib/useToast";

export default function Header() {
  const [search, setSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
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
        router.push(`/companies?q=${encodeURIComponent(query)}`);
      } else {
        router.push(`/companies`);
      }
      setSearch("");
      inputRef.current?.blur();
    }
  };

  return (
    <header className="flex h-14 items-center justify-between border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-6">
      <div className="flex flex-1 items-center">
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
