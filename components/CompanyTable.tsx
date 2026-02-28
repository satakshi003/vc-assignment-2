import { Company, SortConfig } from "@/types/company";
import { ChevronRight, Globe, MapPin, ChevronUp, ChevronDown } from "lucide-react";
import { motion, Variants } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import React, { useRef, useEffect } from "react";

interface CompanyTableProps {
  companies: Company[];
  sortConfig?: SortConfig;
  onSort?: (key: string) => void;
  selectedIds?: string[];
  onSelect?: (id: string, checked: boolean) => void;
  onSelectAll?: (checked: boolean) => void;
}

export default function CompanyTable({
  companies,
  sortConfig,
  onSort,
  selectedIds = [],
  onSelect,
  onSelectAll
}: CompanyTableProps) {
  const router = useRouter();
  const selectAllRef = useRef<HTMLInputElement>(null);

  // Handle indeterminate state for "Select All" checkbox
  useEffect(() => {
    if (selectAllRef.current) {
      const allSelected = companies.length > 0 && companies.every(c => selectedIds.includes(c.id));
      const someSelected = companies.some(c => selectedIds.includes(c.id));

      selectAllRef.current.checked = allSelected;
      selectAllRef.current.indeterminate = someSelected && !allSelected;
    }
  }, [companies, selectedIds]);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  if (companies.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center rounded-lg border border-neutral-200 dark:border-neutral-800 border-dashed bg-white dark:bg-neutral-900">
        <p className="text-sm text-neutral-500 dark:text-neutral-400">No companies found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
      <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-800">
        <thead className="bg-neutral-50 dark:bg-neutral-950">
          <tr>
            <th scope="col" className="px-6 py-3 w-12 text-center text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              <input
                type="checkbox"
                ref={selectAllRef}
                onChange={(e) => onSelectAll?.(e.target.checked)}
                className="h-4 w-4 rounded border-neutral-300 dark:border-neutral-700 text-blue-600 focus:ring-blue-600 dark:bg-neutral-900 dark:checked:bg-blue-600 outline-none transition-colors cursor-pointer"
                aria-label="Select all on page"
              />
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              <button
                onClick={() => onSort && onSort("name")}
                className="group flex items-center gap-1 hover:text-neutral-900 dark:hover:text-neutral-100 focus:outline-none"
              >
                Company
                <span className="flex flex-col">
                  <ChevronUp className={cn("h-3 w-3 -mb-1", sortConfig?.key === "name" && sortConfig.direction === "asc" ? "text-blue-600 dark:text-blue-400" : "text-neutral-300 dark:text-neutral-600 group-hover:text-neutral-400")} />
                  <ChevronDown className={cn("h-3 w-3", sortConfig?.key === "name" && sortConfig.direction === "desc" ? "text-blue-600 dark:text-blue-400" : "text-neutral-300 dark:text-neutral-600 group-hover:text-neutral-400")} />
                </span>
              </button>
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              <button
                onClick={() => onSort && onSort("industry")}
                className="group flex items-center gap-1 hover:text-neutral-900 dark:hover:text-neutral-100 focus:outline-none"
              >
                Industry
                <span className="flex flex-col">
                  <ChevronUp className={cn("h-3 w-3 -mb-1", sortConfig?.key === "industry" && sortConfig.direction === "asc" ? "text-blue-600 dark:text-blue-400" : "text-neutral-300 dark:text-neutral-600 group-hover:text-neutral-400")} />
                  <ChevronDown className={cn("h-3 w-3", sortConfig?.key === "industry" && sortConfig.direction === "desc" ? "text-blue-600 dark:text-blue-400" : "text-neutral-300 dark:text-neutral-600 group-hover:text-neutral-400")} />
                </span>
              </button>
            </th>
            <th scope="col" className="hidden px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400 md:table-cell">
              <button
                onClick={() => onSort && onSort("location")}
                className="group flex items-center gap-1 hover:text-neutral-900 dark:hover:text-neutral-100 focus:outline-none"
              >
                Location
                <span className="flex flex-col">
                  <ChevronUp className={cn("h-3 w-3 -mb-1", sortConfig?.key === "location" && sortConfig.direction === "asc" ? "text-blue-600 dark:text-blue-400" : "text-neutral-300 dark:text-neutral-600 group-hover:text-neutral-400")} />
                  <ChevronDown className={cn("h-3 w-3", sortConfig?.key === "location" && sortConfig.direction === "desc" ? "text-blue-600 dark:text-blue-400" : "text-neutral-300 dark:text-neutral-600 group-hover:text-neutral-400")} />
                </span>
              </button>
            </th>
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">View</span>
            </th>
          </tr>
        </thead>
        <motion.tbody
          key={companies[0]?.id || 'empty'}
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="divide-y divide-neutral-200 dark:divide-neutral-800 bg-white dark:bg-neutral-900"
        >
          {companies.map((company) => {
            const isSelected = selectedIds.includes(company.id);

            return (
              <motion.tr
                variants={itemVariants}
                key={company.id}
                onClick={() => router.push(`/companies/${company.id}`)}
                className={cn(
                  "group cursor-pointer transition-colors",
                  isSelected
                    ? "bg-blue-50/50 dark:bg-blue-500/5 hover:bg-blue-50 dark:hover:bg-blue-500/10"
                    : "hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
                )}
              >
                <td className="whitespace-nowrap px-6 py-4 w-12 text-center">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={(e) => {
                      e.stopPropagation();
                      onSelect?.(company.id, e.target.checked);
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className="h-4 w-4 rounded border-neutral-300 dark:border-neutral-700 text-blue-600 focus:ring-blue-600 dark:bg-neutral-900 dark:checked:bg-blue-600 outline-none transition-colors cursor-pointer"
                    aria-label={`Select ${company.name}`}
                  />
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex items-center">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-md border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
                      <img
                        src={company.logo}
                        alt={`${company.name} logo`}
                        className="h-full w-full object-contain p-1"
                        loading="lazy"
                      />
                    </div>
                    <div className="ml-4">
                      <div className="font-medium text-neutral-900 dark:text-neutral-100 group-hover:text-black dark:group-hover:text-white transition-colors">
                        {company.name}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-neutral-500 dark:text-neutral-400">
                        <Globe className="h-3 w-3" />
                        <a href={company.website} target="_blank" rel="noopener noreferrer" className="hover:underline flex-1 truncate max-w-[150px] relative z-10" onClick={(e) => e.stopPropagation()}>
                          {company.website.replace(/^https?:\/\/(www\.)?/, '')}
                        </a>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <span className={cn(
                    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                    "bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 ring-1 ring-inset ring-blue-700/10 dark:ring-blue-400/20"
                  )}>
                    {company.industry}
                  </span>
                </td>
                <td className="hidden whitespace-nowrap px-6 py-4 text-sm text-neutral-500 dark:text-neutral-400 md:table-cell">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {company.location}
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                  <ChevronRight className={cn(
                    "ml-auto h-5 w-5 transition-transform group-hover:translate-x-1",
                    isSelected ? "text-blue-500 dark:text-blue-400" : "text-neutral-400 dark:text-neutral-500 group-hover:text-neutral-900 dark:group-hover:text-neutral-300"
                  )} />
                </td>
              </motion.tr>
            );
          })}
        </motion.tbody>
      </table>
    </div>
  );
}
