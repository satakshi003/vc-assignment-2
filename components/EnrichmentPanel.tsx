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
    const startTime = Date.now();
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

      // Minimum loading time for perceived quality (per plan)
      const MIN_LOADING_TIME = 600;
      const elapsed = Date.now() - startTime;
      if (elapsed < MIN_LOADING_TIME) {
        await new Promise(r => setTimeout(r, MIN_LOADING_TIME - elapsed));
      }

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

  const staggerContainer: Variants = {
    animate: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const fadeUp: Variants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } }
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
          className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900"
        >
          <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="h-4 w-4 rounded-full border-2 border-blue-600 dark:border-blue-500 border-t-transparent animate-spin" />
              <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                Analyzing website content
                <span className="inline-flex w-4 text-left ml-0.5">
                  <motion.span
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5, times: [0, 0.5, 1] }}
                  >.</motion.span>
                  <motion.span
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5, delay: 0.3, times: [0, 0.5, 1] }}
                  >.</motion.span>
                  <motion.span
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5, delay: 0.6, times: [0, 0.5, 1] }}
                  >.</motion.span>
                </span>
              </span>
            </div>
          </div>

          <div className="p-6 space-y-8">
            {/* Summary skeleton */}
            <div>
              <div className="mb-2 h-3 w-24 rounded bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
              <div className="space-y-2">
                <div className="h-4 w-full rounded bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
                <div className="h-4 w-4/5 rounded bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
              </div>
            </div>

            {/* What they do skeleton */}
            <div>
              <div className="mb-3 h-3 w-20 rounded bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="h-4 w-4 rounded-full bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
                    <div className={`h-4 rounded bg-neutral-200 dark:bg-neutral-800 animate-pulse ${i === 2 ? 'w-2/3' : 'w-1/2'}`} />
                  </div>
                ))}
              </div>
            </div>

            {/* Signals timeline skeleton */}
            <div>
              <div className="mb-4 h-3 w-32 rounded bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
              <div className="space-y-6">
                {[1, 2].map(i => (
                  <div key={i} className="flex gap-4">
                    <div className="h-8 w-px bg-neutral-200 dark:bg-neutral-800" />
                    <div className="flex-1 rounded-xl border border-neutral-100 dark:border-neutral-800 p-4">
                      <div className="mb-2 h-4 w-1/3 rounded bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
                      <div className="h-3 w-full rounded bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
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
            <motion.div
              className="p-6"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              <motion.div className="mb-8" variants={fadeUp}>
                <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Executive Summary</h4>
                <p className="text-sm leading-relaxed text-neutral-800 dark:text-neutral-200">{data.summary}</p>
              </motion.div>

              <motion.div className="mb-8" variants={fadeUp}>
                <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">What They Do</h4>
                <ul className="space-y-2">
                  {data.whatTheyDo?.map((item, idx) => (
                    <li key={idx} className="flex gap-2 text-sm text-neutral-700 dark:text-neutral-300">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500 dark:text-green-400" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div className="mb-8" variants={fadeUp}>
                <SignalsTimeline signals={data.signals || []} />
              </motion.div>

              <motion.div className="mb-8" variants={fadeUp}>
                <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Keywords</h4>
                <div className="flex flex-wrap gap-2">
                  {data.keywords?.map((kw, idx) => (
                    <span key={idx} className="rounded-md bg-neutral-100 dark:bg-neutral-800 px-2 py-1 text-xs font-medium text-neutral-700 dark:text-neutral-300 transition-transform hover:scale-105">
                      {kw}
                    </span>
                  ))}
                </div>
              </motion.div>

              {data.sources && data.sources.length > 0 && (
                <motion.div className="border-t border-neutral-100 dark:border-neutral-800 pt-6" variants={fadeUp}>
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
                </motion.div>
              )}
            </motion.div>
          ) : null}
        </motion.div>
      )}
    </AnimatePresence>

  );
}
