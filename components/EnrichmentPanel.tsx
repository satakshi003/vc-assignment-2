"use client";

import { useState, useEffect } from "react";
import { Sparkles, Loader2, CheckCircle2, Clock, Globe, ArrowUpRight } from "lucide-react";
import { EnrichedData } from "@/types/company";

interface EnrichmentPanelProps {
  companyId: string;
  website: string;
  companyName: string;
  overview: string;
}

export default function EnrichmentPanel({ companyId, website, companyName, overview }: EnrichmentPanelProps) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<EnrichedData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load cached enrichment data
  useEffect(() => {
    const cached = localStorage.getItem(`enrichment-${companyId}`);
    if (cached) {
      try {
        setData(JSON.parse(cached));
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

      const result: EnrichedData = await response.json();
      setData(result);
      localStorage.setItem(`enrichment-${companyId}`, JSON.stringify(result));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!data && !loading && !error) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-neutral-200 bg-neutral-50 px-6 py-12 text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
          <Sparkles className="h-6 w-6" />
        </div>
        <h3 className="mb-2 text-lg font-medium text-neutral-900">Live AI Enrichment</h3>
        <p className="mb-6 max-w-sm text-sm text-neutral-500">
          Extract deep intelligence directly from the company&apos;s website using Gemini AI.
        </p>
        <button
          onClick={handleEnrich}
          className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
        >
          <Sparkles className="h-4 w-4" />
          Enrich Now
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-neutral-200 bg-neutral-50 px-6 py-16 text-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <h3 className="mt-4 text-sm font-medium text-neutral-900">Scanning website & extracting intelligence...</h3>
        <p className="mt-1 text-xs text-neutral-500">This usually takes 5-10 seconds.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-neutral-200 bg-white">
      <div className="flex items-center justify-between border-b border-neutral-200 bg-neutral-50 px-6 py-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-blue-600" />
          <h3 className="font-medium text-neutral-900">AI Intelligence Report</h3>
        </div>
        <div className="flex items-center gap-3">
          {data?.timestamp && (
            <div className="flex items-center gap-1 text-xs text-neutral-500">
              <Clock className="h-3 w-3" />
              {new Date(data.timestamp).toLocaleDateString()}
            </div>
          )}
          <button
            onClick={handleEnrich}
            className="flex items-center gap-1 rounded-md text-xs font-medium text-blue-600 hover:text-blue-700"
          >
            Re-run Analysis
          </button>
        </div>
      </div>

      {error ? (
        <div className="p-6 text-center text-sm text-red-600">
          {error}
        </div>
      ) : data ? (
        <div className="p-6">
          <div className="mb-8">
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-500">Executive Summary</h4>
            <p className="text-sm leading-relaxed text-neutral-800">{data.summary}</p>
          </div>

          <div className="mb-8 grid gap-8 md:grid-cols-2">
            <div>
              <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-500">What They Do</h4>
              <ul className="space-y-2">
                {data.whatTheyDo?.map((item, idx) => (
                  <li key={idx} className="flex gap-2 text-sm text-neutral-700">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-500">Derived Signals</h4>
              <ul className="space-y-2">
                {data.derivedSignals?.map((signal, idx) => (
                  <li key={idx} className="flex gap-2 text-sm text-neutral-700">
                    <Sparkles className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-500" />
                    <span>{signal}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mb-8">
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-500">Keywords</h4>
            <div className="flex flex-wrap gap-2">
              {data.keywords?.map((kw, idx) => (
                <span key={idx} className="rounded-md bg-neutral-100 px-2 py-1 text-xs font-medium text-neutral-700">
                  {kw}
                </span>
              ))}
            </div>
          </div>

          {data.sources && data.sources.length > 0 && (
            <div className="border-t border-neutral-100 pt-6">
              <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-500">Information Sources</h4>
              <div className="flex flex-col gap-2">
                {data.sources.map((src, idx) => (
                  <a key={idx} href={src} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-blue-600 hover:underline">
                    <Globe className="h-3 w-3" />
                    <span className="truncate max-w-sm">{src}</span>
                    <ArrowUpRight className="h-3 w-3" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
