"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search,
  CheckSquare,
  List,
  ArrowRight,
  TrendingUp,
  Zap,
  BarChart2,
  Globe,
  Database,
} from "lucide-react";

// ─── Animation Variants ───────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

// ─── Mock Signal Card ─────────────────────────────────────────────────
function MockSignalCard() {
  const mockSignals = [
    { category: "Hiring", label: "Scaling engineering team", confidence: 92 },
    { category: "Product", label: "New API launched Q4", confidence: 87 },
    { category: "Growth", label: "Series B indicators detected", confidence: 74 },
  ];

  const categoryColors: Record<string, string> = {
    Hiring: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20",
    Product: "bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/20",
    Growth: "bg-violet-50 dark:bg-violet-500/10 text-violet-700 dark:text-violet-400 border-violet-200 dark:border-violet-500/20",
  };

  const dotColors: Record<string, string> = {
    Hiring: "bg-emerald-500",
    Product: "bg-blue-500",
    Growth: "bg-violet-500",
  };

  return (
    <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
        <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
          Signals Intelligence
        </span>
      </div>
      <div className="space-y-3">
        {mockSignals.map((signal) => (
          <div key={signal.label} className="flex items-start gap-3">
            <div className={`mt-1 h-2.5 w-2.5 flex-shrink-0 rounded-full ${dotColors[signal.category]}`} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate">
                  {signal.label}
                </p>
                <span className={`flex-shrink-0 inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${categoryColors[signal.category]}`}>
                  {signal.category}
                </span>
              </div>
              <div className="mt-1.5 flex items-center gap-2">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
                  <div
                    className={`h-full rounded-full ${dotColors[signal.category]}`}
                    style={{ width: `${signal.confidence}%` }}
                  />
                </div>
                <span className="flex-shrink-0 text-xs text-neutral-500 dark:text-neutral-400">
                  {signal.confidence}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Feature Card ─────────────────────────────────────────────────────
function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <motion.div
      variants={fadeUp}
      className="group rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
    >
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition-colors group-hover:bg-neutral-900 group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-neutral-900">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mb-2 font-semibold text-neutral-900 dark:text-neutral-100">{title}</h3>
      <p className="text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">{description}</p>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <div className="min-h-full overflow-y-auto bg-neutral-50 dark:bg-neutral-950">

      {/* ── HERO ── */}
      <section className="border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-4 sm:px-6 py-16 sm:py-24">
        <motion.div
          className="mx-auto max-w-3xl text-center"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={fadeUp} transition={{ duration: 0.4 }}>
            <span className="inline-flex items-center rounded-full border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-xs font-medium text-neutral-600 dark:text-neutral-400">
              Internal VC Intelligence Platform
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="mt-6 text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100"
          >
            Structured Intelligence for{" "}
            <span className="text-neutral-500 dark:text-neutral-400">Modern Venture Capital</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mt-5 text-base sm:text-lg leading-relaxed text-neutral-500 dark:text-neutral-400"
          >
            Source, analyze, and organize high-signal startup intelligence powered by
            AI enrichment and structured insights.
          </motion.p>

          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <Link
              href="/companies"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-black dark:bg-white px-5 py-2.5 text-sm font-medium text-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors shadow-sm"
            >
              Explore Companies
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/lists"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-5 py-2.5 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
            >
              View Watchlists
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* ── PRODUCT PREVIEW ── */}
      <section className="px-4 sm:px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-5xl">
          <motion.div
            className="grid gap-12 lg:grid-cols-2 lg:items-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerContainer}
          >
            {/* Left */}
            <motion.div variants={fadeUp} transition={{ duration: 0.4 }}>
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                AI-Powered Enrichment
              </span>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
                Live Intelligence, Structurally Delivered
              </h2>
              <p className="mt-4 leading-relaxed text-neutral-500 dark:text-neutral-400">
                Submit any company and the platform scrapes its web presence, runs it through
                Gemini AI, and returns structured VC-grade signal data in seconds.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  { icon: Globe, text: "Real-time website scraping and parsing" },
                  { icon: Zap, text: "Structured signals — Hiring, Growth, Product" },
                  { icon: BarChart2, text: "Confidence-weighted insight scoring" },
                ].map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-center gap-3 text-sm text-neutral-600 dark:text-neutral-400">
                    <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md bg-neutral-100 dark:bg-neutral-800">
                      <Icon className="h-3.5 w-3.5 text-neutral-600 dark:text-neutral-400" />
                    </div>
                    {text}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Right — Mock Preview */}
            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="lg:pl-8"
            >
              <MockSignalCard />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── WORKFLOW ── */}
      <section className="border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-4 sm:px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-5xl">
          <motion.div
            className="mb-12 text-center"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
              Designed for Real Deal Flow
            </h2>
            <p className="mt-3 text-neutral-500 dark:text-neutral-400">
              Every feature maps to a real workflow step in the venture process.
            </p>
          </motion.div>

          <motion.div
            className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={staggerContainer}
          >
            <FeatureCard
              icon={Search}
              title="Search & Filter"
              description="Find companies by name, industry, or location. Dynamic sorting and pagination keeps large datasets navigable."
            />
            <FeatureCard
              icon={CheckSquare}
              title="Bulk Triage"
              description="Checkbox multi-select lets you batch-save companies across any of your named watchlists in a single action."
            />
            <FeatureCard
              icon={List}
              title="Watchlists & Export"
              description="Organize deals into named lists. Export filtered subsets as CSV or JSON for diligence pipelines."
            />
            <FeatureCard
              icon={Zap}
              title="AI Enrichment"
              description="One click enriches any profile with executive summaries, keyword extraction, and directional signaling."
            />
            <FeatureCard
              icon={TrendingUp}
              title="Signals Timeline"
              description="Structured, time-aware VC signals displayed in a scannable vertical timeline with category and confidence score."
            />
            <FeatureCard
              icon={Database}
              title="Persistent Workspace"
              description="Notes, saved searches, watchlists, and enrichment cache all persist locally — no backend required."
            />
          </motion.div>
        </div>
      </section>

      {/* ── TECH STACK ── */}
      <section className="px-4 sm:px-6 py-12 sm:py-16">
        <div className="mx-auto max-w-5xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <p className="mb-6 text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
              Built for Performance
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {[
                "Next.js 16",
                "Gemini AI",
                "TypeScript",
                "Framer Motion",
                "Tailwind CSS",
                "Server-side Scraping",
                "Local Persistence",
                "Structured JSON Output",
              ].map((chip) => (
                <span
                  key={chip}
                  className="rounded-full border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-1 text-xs font-medium text-neutral-600 dark:text-neutral-400"
                >
                  {chip}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-4 sm:px-6 py-16 sm:py-24">
        <motion.div
          className="mx-auto max-w-xl text-center"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
            Start exploring high-signal startups.
          </h2>
          <p className="mt-4 text-neutral-500 dark:text-neutral-400">
            The full company directory is a click away.
          </p>
          <div className="mt-8">
            <Link
              href="/companies"
              className="inline-flex items-center gap-2 rounded-lg bg-black dark:bg-white px-6 py-3 text-sm font-medium text-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors shadow-sm"
            >
              Open Companies Directory
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>
      </section>

    </div>
  );
}
