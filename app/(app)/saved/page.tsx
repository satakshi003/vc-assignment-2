"use client";

import { useState, useEffect } from "react";
import { Search, Trash2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface SavedSearch {
  id: string;
  query: string;
  industry: string;
  timestamp: string;
}

export default function SavedSearchesPage() {
  const [searches, setSearches] = useState<SavedSearch[]>([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("saved-searches") || "[]");
    setSearches(saved);
  }, []);

  const handleRemove = (id: string) => {
    const updated = searches.filter((s) => s.id !== id);
    setSearches(updated);
    localStorage.setItem("saved-searches", JSON.stringify(updated));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex h-full flex-col p-8"
    >
      <div className="mb-8 border-b border-neutral-200 dark:border-neutral-800 pb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">Saved Queries</h1>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">Quickly re-run your frequent company searches.</p>
      </div>

      {searches.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900/50 py-16 text-center">
          <Search className="mb-4 h-8 w-8 text-neutral-400 dark:text-neutral-500" />
          <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">No saved searches</h3>
          <p className="mt-1 max-w-sm text-sm text-neutral-500 dark:text-neutral-400">
            You can save search queries and filters directly from the Companies page.
          </p>
          <Link href="/companies" className="mt-6 rounded-md bg-black dark:bg-white px-4 py-2 text-sm font-medium text-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors">
            Go to Companies
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {searches.map((search) => (
            <div key={search.id} className="group rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 shadow-sm transition-all hover:border-black/20 dark:hover:border-white/20 hover:shadow-md">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
                    {search.query
                      ? `"${search.query}"`
                      : search.industry !== "All"
                        ? "Empty Query"
                        : "All Companies"}
                  </h3>
                  <div className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                    Saved on {new Date(search.timestamp).toLocaleDateString()}
                  </div>
                </div>
                <button
                  onClick={() => handleRemove(search.id)}
                  className="text-neutral-400 opacity-0 transition-opacity group-hover:opacity-100 hover:text-red-500"
                  aria-label="Remove saved search"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="mb-6 flex gap-2">
                {search.query && (
                  <span className="rounded-md bg-neutral-100 dark:bg-neutral-800 px-2 py-1 text-xs font-medium text-neutral-700 dark:text-neutral-300">
                    Name: {search.query}
                  </span>
                )}
                {search.industry !== "All" && (
                  <span className="rounded-md bg-blue-50 dark:bg-blue-500/10 px-2 py-1 text-xs font-medium text-blue-700 dark:text-blue-400">
                    Industry: {search.industry}
                  </span>
                )}
              </div>

              <Link
                href={`/companies?q=${encodeURIComponent(search.query)}&industry=${encodeURIComponent(search.industry)}`}
                className="flex items-center justify-between rounded-lg border border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800/80"
              >
                Run Search
                <ArrowRight className="h-4 w-4 text-neutral-400 dark:text-neutral-500" />
              </Link>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
