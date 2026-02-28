"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Bookmark, Search as SearchIcon } from "lucide-react";
import CompanyTable from "@/components/CompanyTable";
import companiesData from "@/data/companies.json";


function CompaniesContent() {
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams?.get("q") || "");
  const [industryFilter, setIndustryFilter] = useState(searchParams?.get("industry") || "All");
  const [currentPage, setCurrentPage] = useState(1);
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

  const industries = ["All", ...Array.from(new Set(companiesData.map((c) => c.industry as string)))];

  // Filter
  const filtered = companiesData.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchesIndustry = industryFilter === "All" || c.industry === industryFilter;
    return matchesSearch && matchesIndustry;
  });

  // Sort A-Z by name
  const sorted = [...filtered].sort((a, b) => a.name.localeCompare(b.name));

  // Paginate
  const totalPages = Math.ceil(sorted.length / itemsPerPage);
  const paginated = sorted.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-neutral-200 px-8 py-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">Companies</h1>
          <p className="mt-1 text-sm text-neutral-500">Discover and enrich startup data.</p>
        </div>
      </div>

      <div className="p-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center justify-between">
          <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative w-full max-w-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <SearchIcon className="h-4 w-4 text-neutral-400" />
              </div>
              <input
                type="text"
                placeholder="Search companies by name..."
                className="w-full rounded-md border border-neutral-300 py-2 pl-10 pr-3 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            <select
              className="w-full max-w-[200px] rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
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
                alert("Search saved! View in Saved Queries.");
              } else {
                alert("Please add a search term or filter to save.");
              }
            }}
            className="flex items-center gap-2 rounded-md border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 shadow-sm transition-colors hover:bg-neutral-50"
          >
            <Bookmark className="h-4 w-4" />
            Save Search
          </button>
        </div>

        <CompanyTable companies={paginated} />

        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <p className="text-sm text-neutral-500">
              Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium">{Math.min(currentPage * itemsPerPage, sorted.length)}</span> of <span className="font-medium">{sorted.length}</span> results
            </p>
            <div className="flex gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => p - 1)}
                className="rounded-md border border-neutral-300 px-3 py-1 text-sm font-medium text-neutral-700 hover:bg-neutral-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => p + 1)}
                className="rounded-md border border-neutral-300 px-3 py-1 text-sm font-medium text-neutral-700 hover:bg-neutral-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CompaniesPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading companies...</div>}>
      <CompaniesContent />
    </Suspense>
  );
}
