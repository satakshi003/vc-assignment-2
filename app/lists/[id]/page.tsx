"use client";

import { useState, useEffect, use } from "react";
import { Download, Trash2, Globe, ArrowLeft, Building2 } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { VCList } from "@/types/company";
import { getLists, removeCompanyFromList } from "@/lib/listManager";
import { useToast } from "@/lib/useToast";

export default function ListDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const [list, setList] = useState<VCList | null>(null);
  const [mounted, setMounted] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    const allLists = getLists();
    const found = allLists.find(l => l.id === unwrappedParams.id);
    if (found) {
      setList(found);
    }
    setMounted(true);
  }, [unwrappedParams.id]);

  const handleRemoveCompany = (companyId: string, companyName: string) => {
    if (!list) return;
    removeCompanyFromList(list.id, companyId);

    // Update local state smoothly
    setList(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        companies: prev.companies.filter(c => c.id !== companyId),
        updatedAt: new Date().toISOString()
      };
    });

    addToast({
      title: "Removed",
      description: `${companyName} removed from ${list.name}.`,
      type: "info"
    });
  };

  const handleExportCSV = () => {
    if (!list || list.companies.length === 0) return;
    const header = "Name,Industry,Location,Website,Description\n";
    const rows = list.companies.map(c =>
      `"${c.name}","${c.industry}","${c.location}","${c.website}","${c.description.replace(/"/g, '""')}"`
    ).join("\n");

    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `ventura_${list.name.replace(/\s+/g, '_').toLowerCase()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportJSON = () => {
    if (!list || list.companies.length === 0) return;
    const blob = new Blob([JSON.stringify(list.companies, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `ventura_${list.name.replace(/\s+/g, '_').toLowerCase()}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!mounted) return <div className="p-8">Loading...</div>;

  // If mounted but no list found, redirect to 404
  if (!list) return notFound();

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex h-full flex-col"
    >
      <div className="border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-8 py-6">
        <Link href="/lists" className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to Watchlists
        </Link>
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">{list.name}</h1>
            <p className="mt-1 flex items-center gap-3 text-sm text-neutral-500 dark:text-neutral-400">
              <span>{list.companies.length} {list.companies.length === 1 ? 'company' : 'companies'}</span>
              <span className="h-1 w-1 rounded-full bg-neutral-300 dark:bg-neutral-700"></span>
              <span>Updated {new Date(list.updatedAt).toLocaleDateString()}</span>
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleExportCSV}
              disabled={list.companies.length === 0}
              className="flex items-center gap-2 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 disabled:opacity-50 dark:disabled:opacity-50 transition-colors"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </button>
            <button
              onClick={handleExportJSON}
              disabled={list.companies.length === 0}
              className="flex items-center gap-2 rounded-md bg-black dark:bg-white px-4 py-2 text-sm font-medium text-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200 disabled:opacity-50 dark:disabled:opacity-50 transition-colors"
            >
              <Download className="h-4 w-4" />
              Export JSON
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8">
        {list.companies.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-dashed border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900/50 text-center">
            <Building2 className="mb-4 h-8 w-8 text-neutral-400 dark:text-neutral-500" />
            <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">This list is empty</h3>
            <p className="mt-1 max-w-sm text-sm text-neutral-500 dark:text-neutral-400">
              Go to the Companies directory and save some profiles to this list.
            </p>
            <Link href="/companies" className="mt-6 rounded-md bg-black dark:bg-white px-4 py-2 text-sm font-medium text-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors">
              Browse Companies
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <AnimatePresence>
              {list.companies.map((company) => (
                <motion.div
                  key={company.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="group flex flex-col justify-between rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 shadow-sm transition-all hover:border-black/20 dark:hover:border-white/20 hover:-translate-y-1 hover:shadow-md"
                >
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
                        onClick={() => handleRemoveCompany(company.id, company.name)}
                        className="rounded-md p-1.5 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                        aria-label="Remove from list"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
                      <Link href={`/companies/${company.id}`} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                        {company.name}
                      </Link>
                    </h3>
                    <p className="mt-1 line-clamp-2 text-sm text-neutral-600 dark:text-neutral-400">
                      {company.description}
                    </p>
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
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.div>
  );
}
