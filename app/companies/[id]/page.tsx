"use client";

import { useEffect, useState, use } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Globe, Building2, BookmarkPlus } from "lucide-react";
import companiesData from "@/data/companies.json";
import { Company } from "@/types/company";
import NotesSection from "@/components/NotesSection";
import EnrichmentPanel from "@/components/EnrichmentPanel";
import { useToast } from "@/lib/useToast";

export default function CompanyProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const { addToast } = useToast();
  const [company, setCompany] = useState<Company | null>(null);

  useEffect(() => {
    // We explicitly cast the local json parse to Company[] to satisfy TS typing
    const found = (companiesData as Company[]).find((c) => c.id === unwrappedParams.id);
    if (found) {
      setCompany(found);
    }
  }, [unwrappedParams.id]);

  if (!company) {
    if (companiesData.some((c) => c.id === unwrappedParams.id)) {
      return <div>Loading...</div>; // Client side resolving
    }
    return notFound();
  }

  const handleSaveToList = () => {
    // Basic implementation to push to a default list for now
    const saved = JSON.parse(localStorage.getItem("saved-companies") || "[]");
    if (!saved.some((c: Company) => c.id === company.id)) {
      saved.push(company);
      localStorage.setItem("saved-companies", JSON.stringify(saved));
      addToast({
        title: "Company Saved",
        description: "Added to My Lists.",
        type: "success"
      });
    } else {
      addToast({
        title: "Already Saved",
        description: "This company is already in your list.",
        type: "info"
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex h-full flex-col"
    >
      {/* Header section */}
      <div className="border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-8 py-6">
        <Link href="/companies" className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100">
          <ArrowLeft className="h-4 w-4" />
          Back to Companies
        </Link>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 shadow-sm">
              <img
                src={company.logo}
                alt={`${company.name} logo`}
                className="h-full w-full object-contain p-1.5"
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">{company.name}</h1>
              <div className="mt-2 flex items-center gap-4 text-sm text-neutral-500 dark:text-neutral-400">
                <div className="flex items-center gap-1">
                  <Building2 className="h-4 w-4" />
                  {company.industry}
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {company.location}
                </div>
                <div className="flex items-center gap-1">
                  <Globe className="h-4 w-4" />
                  <a href={company.website} target="_blank" rel="noopener noreferrer" className="hover:text-neutral-900 dark:hover:text-neutral-100 hover:underline">
                    {company.website.replace(/^https?:\/\/(www\.)?/, '')}
                  </a>
                </div>
              </div>
            </div>
          </div>
          <button onClick={handleSaveToList} className="flex items-center gap-2 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 py-2 font-medium text-neutral-700 dark:text-neutral-300 shadow-sm hover:bg-neutral-50 dark:hover:bg-neutral-800">
            <BookmarkPlus className="h-4 w-4" />
            Save to List
          </button>
        </div>
      </div>

      {/* Main Content Pane */}
      <div className="grid flex-1 grid-cols-1 gap-8 overflow-y-auto p-8 lg:grid-cols-3">
        {/* Left Column: Overview + Notes */}
        <div className="flex flex-col gap-8 lg:col-span-1">
          <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6">
            <h3 className="mb-4 font-semibold text-neutral-900 dark:text-neutral-100">Overview</h3>
            <p className="text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">{company.description}</p>
          </div>

          <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6">
            <NotesSection companyId={company.id} />
          </div>
        </div>

        {/* Right Column: AI Enrichment */}
        <div className="lg:col-span-2">
          <EnrichmentPanel
            companyId={company.id}
            website={company.website}
            companyName={company.name}
            overview={company.description}
          />
        </div>
      </div>
    </motion.div>
  );
}
