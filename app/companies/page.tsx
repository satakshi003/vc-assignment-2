"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Bookmark, Search as SearchIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CompanyTable from "@/components/CompanyTable";
import companiesData from "@/data/companies.json";
import { SortConfig, Company } from "@/types/company";
import { useToast } from "@/lib/useToast";
import ListModal from "@/components/ListModal";


function CompaniesContent() {
  const searchParams = useSearchParams();
  const { addToast } = useToast();

  const [search, setSearch] = useState(searchParams?.get("q") || "");
  const [industryFilter, setIndustryFilter] = useState(searchParams?.get("industry") || "All");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: "name", direction: "asc" });
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const itemsPerPage = 5;

  // Hydrate states if search params change
  useEffect(() => {
    if (searchParams) {
      const q = searchParams.get("q");
      const ind = searchParams.get("industry");
      if (q !== null) setSearch(q);
      if (ind !== null) setIndustryFilter(ind);
    }
  }, [searchParams]);

  // Clear selections when paginated list content visually changes
  useEffect(() => {
    setSelectedIds([]);
  }, [search, industryFilter, currentPage]);

  const industries = ["All", ...Array.from(new Set(companiesData.map((c) => c.industry as string)))];

  // Filter
  const filtered = companiesData.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchesIndustry = industryFilter === "All" || c.industry === industryFilter;
    return matchesSearch && matchesIndustry;
  });

  // Sort based on sortConfig
  const sorted = [...filtered].sort((a, b) => {
    // We explicitly cast here because we know our sort keys map perfectly to Company string properties
    const aValue = String(a[sortConfig.key as keyof typeof a]).toLowerCase();
    const bValue = String(b[sortConfig.key as keyof typeof b]).toLowerCase();

    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  // Paginate
  const totalPages = Math.ceil(sorted.length / itemsPerPage);
  const paginated = sorted.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex h-full flex-col"
    >
      <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 px-4 sm:px-8 py-4 sm:py-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">Companies</h1>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">Discover and enrich startup data.</p>
        </div>
      </div>

      <div className="p-4 sm:p-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center justify-between">
          <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative w-full max-w-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <SearchIcon className="h-4 w-4 text-neutral-400" />
              </div>
              <input
                type="text"
                placeholder="Search companies by name..."
                className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 py-2 pl-10 pr-3 text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:border-black dark:focus:border-white focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            <select
              className="w-full max-w-[200px] rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 text-sm text-neutral-900 dark:text-neutral-100 focus:border-black dark:focus:border-white focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
              value={industryFilter}
              onChange={(e) => {
                setIndustryFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              {industries.map((ind: string) => (
                <option key={ind} value={ind}>{ind}</option>
              ))}
            </select>
          </div>
          <button
            onClick={() => {
              if (search || industryFilter !== "All") {
                const saved = JSON.parse(localStorage.getItem("saved-searches") || "[]");
                saved.push({
                  id: Math.random().toString(36).substring(7),
                  query: search,
                  industry: industryFilter,
                  timestamp: new Date().toISOString()
                });
                localStorage.setItem("saved-searches", JSON.stringify(saved));
                addToast({
                  title: "Search Saved",
                  description: "View it in Saved Queries.",
                  type: "success"
                });
              } else {
                addToast({
                  title: "Cannot Save Search",
                  description: "Add a search term or filter first.",
                  type: "error"
                });
              }
            }}
            className="flex items-center gap-2 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 shadow-sm transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800"
          >
            <Bookmark className="h-4 w-4" />
            Save Search
          </button>
        </div>

        <CompanyTable
          companies={paginated}
          sortConfig={sortConfig}
          onSort={(key) => {
            setSortConfig((prev) => ({
              key,
              direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
            }));
            setCurrentPage(1); // Reset to page 1 on sort change
          }}
          selectedIds={selectedIds}
          onSelect={(id, checked) => {
            setSelectedIds(prev =>
              checked ? [...prev, id] : prev.filter(x => x !== id)
            );
          }}
          onSelectAll={(checked) => {
            if (checked) {
              const visibleIds = paginated.map(c => c.id);
              setSelectedIds(prev => Array.from(new Set([...prev, ...visibleIds])));
            } else {
              const visibleIds = new Set(paginated.map(c => c.id));
              setSelectedIds(prev => prev.filter(id => !visibleIds.has(id)));
            }
          }}
        />

        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Showing <span className="font-medium text-neutral-900 dark:text-neutral-100">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium text-neutral-900 dark:text-neutral-100">{Math.min(currentPage * itemsPerPage, sorted.length)}</span> of <span className="font-medium text-neutral-900 dark:text-neutral-100">{sorted.length}</span> results
            </p>
            <div className="flex gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => p - 1)}
                className="rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-1 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 disabled:opacity-50 dark:disabled:opacity-50"
              >
                Previous
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => p + 1)}
                className="rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-1 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 disabled:opacity-50 dark:disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}

        <AnimatePresence>
          {selectedIds.length > 0 && (
            <div className="fixed bottom-8 left-0 right-0 z-40 flex justify-center pointer-events-none">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="pointer-events-auto rounded-xl sm:rounded-full border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-4 sm:px-6 py-3 sm:py-4 shadow-xl flex flex-col sm:flex-row items-center gap-3 sm:gap-6 w-[calc(100%-2rem)] sm:w-auto"
              >
                <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                  {selectedIds.length} {selectedIds.length === 1 ? 'company' : 'companies'} selected
                </span>
                <div className="h-4 w-px bg-neutral-200 dark:bg-neutral-800" />
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedIds([])}
                    className="rounded-full px-4 py-2 text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                  >
                    Clear
                  </button>
                  <button
                    onClick={() => setShowBulkModal(true)}
                    className="rounded-full bg-black dark:bg-white px-4 py-2 text-sm font-medium text-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors shadow-sm"
                  >
                    Add to List
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <ListModal
          isOpen={showBulkModal}
          onClose={() => {
            setShowBulkModal(false);
            setSelectedIds([]); // Clear selection when modal closes successfully 
          }}
          companies={(companiesData as Company[]).filter(c => selectedIds.includes(c.id))}
        />
      </div>
    </motion.div>
  );
}

export default function CompaniesPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading companies...</div>}>
      <CompaniesContent />
    </Suspense>
  );
}
