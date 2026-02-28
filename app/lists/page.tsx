"use client";

import { useState, useEffect } from "react";
import { Download, Trash2, Globe, Building2 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Company } from "@/types/company";

export default function ListsPage() {
  const [savedCompanies, setSavedCompanies] = useState<Company[]>([]);

  useEffect(() => {
    const list = JSON.parse(localStorage.getItem("saved-companies") || "[]");
    setSavedCompanies(list);
  }, []);

  const handleRemove = (id: string) => {
    const updated = savedCompanies.filter((c) => c.id !== id);
    setSavedCompanies(updated);
    localStorage.setItem("saved-companies", JSON.stringify(updated));
  };

  const handleExportCSV = () => {
    if (savedCompanies.length === 0) return;
    const header = "Name,Industry,Location,Website,Description\n";
    const rows = savedCompanies.map(c =>
      `"${c.name}","${c.industry}","${c.location}","${c.website}","${c.description.replace(/"/g, '""')}"`
    ).join("\n");

    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "ventura_saved_companies.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportJSON = () => {
    if (savedCompanies.length === 0) return;
    const blob = new Blob([JSON.stringify(savedCompanies, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "ventura_saved_companies.json");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex h-full flex-col p-8"
    >
      <div className="mb-8 flex items-end justify-between border-b border-neutral-200 dark:border-neutral-800 pb-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">My Lists</h1>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">Manage and export your saved companies.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleExportCSV}
            disabled={savedCompanies.length === 0}
            className="flex items-center gap-2 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 disabled:opacity-50 dark:disabled:opacity-50 transition-colors"
          >
            <Download className="h-4 w-4" />
            CSV
          </button>
          <button
            onClick={handleExportJSON}
            disabled={savedCompanies.length === 0}
            className="flex items-center gap-2 rounded-md bg-black dark:bg-white px-4 py-2 text-sm font-medium text-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200 disabled:opacity-50 dark:disabled:opacity-50 transition-colors"
          >
            <Download className="h-4 w-4" />
            JSON
          </button>
        </div>
      </div>

      {savedCompanies.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-dashed border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900/50 text-center">
          <Building2 className="mb-4 h-8 w-8 text-neutral-400 dark:text-neutral-500" />
          <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">No companies saved yet</h3>
          <p className="mt-1 max-w-sm text-sm text-neutral-500 dark:text-neutral-400">
            Go to the Companies directory and save some profiles to build your lists.
          </p>
          <Link href="/companies" className="mt-6 rounded-md bg-black dark:bg-white px-4 py-2 text-sm font-medium text-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors">
            Browse Companies
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {savedCompanies.map((company) => (
            <div key={company.id} className="group flex flex-col justify-between rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 shadow-sm transition-all hover:border-black/20 dark:hover:border-white/20 hover:shadow-md">
              <div>
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-md border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
                    <img
                      src={company.logo}
                      alt={`${company.name} logo`}
                      className="h-full w-full object-contain p-1"
                      loading="lazy"
                    />
                  </div>
                  <button
                    onClick={() => handleRemove(company.id)}
                    className="text-neutral-400 transition-colors hover:text-red-500"
                    aria-label="Remove from list"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
                  <Link href={`/companies/${company.id}`} className="hover:underline">
                    {company.name}
                  </Link>
                </h3>
                <p className="mt-1 line-clamp-2 text-sm text-neutral-600 dark:text-neutral-400">{company.description}</p>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-neutral-100 dark:border-neutral-800 pt-4 text-xs text-neutral-500 dark:text-neutral-400">
                <span className="rounded-full bg-blue-50 dark:bg-blue-500/10 px-2 py-0.5 font-medium text-blue-700 dark:text-blue-400">
                  {company.industry}
                </span>
                <a href={company.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-black dark:hover:text-white transition-colors">
                  <Globe className="h-3 w-3" />
                  Website
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
