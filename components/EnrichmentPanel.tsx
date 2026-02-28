"use client";

import { useState, useEffect } from "react";
import { Sparkles, Loader2, CheckCircle2, Clock, Globe, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { EnrichedData, Signal } from "@/types/company";
import SignalsTimeline from "./SignalsTimeline";

interface EnrichmentPanelProps {
  companyId: string;
  website: string;
  companyName: string;
  overview: string;
}

export default function EnrichmentPanel({ companyId, website, companyName, overview }: EnrichmentPanelProps): React.JSX.Element {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<EnrichedData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Provide backward compatibility for legacy string-based signals
  const migrateSignals = (parsed: any): EnrichedData => {
    if (parsed.derivedSignals && (!parsed.signals || parsed.signals.length === 0)) {
      parsed.signals = parsed.derivedSignals.map((sig: string, i: number) => ({
        id: `legacy-${i}-${Math.random()}`,
        title: "Disclosed Signal",
        category: "Other",
        confidence: "Medium",
        description: sig,
        detectedFrom: "Website Content"
      } as Signal));
    }
    return parsed;
  };

  // Load cached enrichment data
  useEffect(() => {
    const cached = localStorage.getItem(`enrichment-${companyId}`);
    if (cached) {
      try {
        setData(migrateSignals(JSON.parse(cached)));
      } catch {
        console.error("Failed to parse cached enrichment data");
      }
    }
  }, [companyId]);

  const handleEnrich = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/enrich", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: website, companyName, overview }),
      });

      if (!response.ok) {
        throw new Error("Failed to enrich company data.");
      }

      const rawResult = await response.json();
      const result: EnrichedData = migrateSignals(rawResult);
      setData(result);
      localStorage.setItem(`enrichment-${companyId}`, JSON.stringify(result));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const panelVariants: Variants = {
    initial: { opacity: 0, y: 10, scale: 0.98 },
    animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3, ease: "easeOut" } },
    exit: { opacity: 0, scale: 0.98, transition: { duration: 0.2 } },
  };

  return (
    <AnimatePresence mode="wait">
      {(!data && !loading && !error) && (
        <motion.div
          key="empty"
          variants={panelVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="flex flex-col items-center justify-center rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 px-6 py-12 text-center"
        >
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
            <Sparkles className="h-6 w-6" />
          </div>
          <h3 className="mb-2 text-lg font-medium text-neutral-900 dark:text-neutral-100">Live AI Enrichment</h3>
          <p className="mb-6 max-w-sm text-sm text-neutral-500 dark:text-neutral-400">
            Extract deep intelligence directly from the company&apos;s website using Gemini AI.
          </p>
          <button
            onClick={handleEnrich}
            className="flex items-center gap-2 rounded-md bg-blue-600 dark:bg-blue-700 px-4 py-2 font-medium text-white transition-all duration-200 hover:bg-blue-700 dark:hover:bg-blue-600 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-900"
          >
            <Sparkles className="h-4 w-4" />
            Enrich Now
          </button>
        </motion.div>
      )}

      {loading && (
        <motion.div
          key="loading"
          variants={panelVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="flex flex-col items-center justify-center rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 px-6 py-16 text-center"
        >
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 dark:text-blue-500" />
          <h3 className="mt-4 text-sm font-medium text-neutral-900 dark:text-neutral-100">Scanning website & extracting intelligence...</h3>
          <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">This usually takes 5-10 seconds.</p>
        </motion.div>
      )}

      {(!loading && (data || error)) && (
        <motion.div
          key="result"
          variants={panelVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900"
        >
          <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 px-6 py-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <h3 className="font-medium text-neutral-900 dark:text-neutral-100">AI Intelligence Report</h3>
            </div>
            <div className="flex items-center gap-3">
              {data?.timestamp && (
                <div className="flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-500">
                  <Clock className="h-3 w-3" />
                  {new Date(data.timestamp).toLocaleDateString()}
                </div>
              )}
              <button
                onClick={handleEnrich}
                className="flex items-center gap-1 rounded-md text-xs font-medium text-blue-600 dark:text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 transition-colors"
              >
                Re-run Analysis
              </button>
            </div>
          </div>

          {error ? (
            <div className="p-6 text-center text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          ) : data ? (
            <div className="p-6">
              <div className="mb-8">
                <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Executive Summary</h4>
                <p className="text-sm leading-relaxed text-neutral-800 dark:text-neutral-200">{data.summary}</p>
              </div>

              <div className="mb-8">
                <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">What They Do</h4>
                <ul className="space-y-2">
                  {data.whatTheyDo?.map((item, idx) => (
                    <li key={idx} className="flex gap-2 text-sm text-neutral-700 dark:text-neutral-300">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500 dark:text-green-400" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-8">
                <SignalsTimeline signals={data.signals || []} />
              </div>

              <div className="mb-8">
                <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Keywords</h4>
                <div className="flex flex-wrap gap-2">
                  {data.keywords?.map((kw, idx) => (
                    <span key={idx} className="rounded-md bg-neutral-100 dark:bg-neutral-800 px-2 py-1 text-xs font-medium text-neutral-700 dark:text-neutral-300 transition-transform hover:scale-105">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>

              {data.sources && data.sources.length > 0 && (
                <div className="border-t border-neutral-100 dark:border-neutral-800 pt-6">
                  <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Information Sources</h4>
                  <div className="flex flex-col gap-2">
                    {data.sources.map((src, idx) => (
                      <a key={idx} href={src} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 transition-all hover:text-blue-700 dark:hover:text-blue-300 hover:translate-x-1">
                        <Globe className="h-3 w-3" />
                        <span className="truncate max-w-sm hover:underline">{src}</span>
                        <ArrowUpRight className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
