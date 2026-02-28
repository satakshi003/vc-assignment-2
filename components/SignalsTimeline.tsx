import { motion, Variants } from "framer-motion";
import { Signal } from "@/types/company";
import { cn } from "@/lib/utils";

interface SignalsTimelineProps {
  signals?: Signal[];
}

export default function SignalsTimeline({ signals = [] }: SignalsTimelineProps) {
  // Sort: High -> Medium -> Low
  const confidenceWeight = { High: 3, Medium: 2, Low: 1 };

  const sortedSignals = [...signals].sort(
    (a, b) => confidenceWeight[b.confidence] - confidenceWeight[a.confidence]
  );

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  const categoryStyles: Record<Signal["category"], { dot: string; badge: string }> = {
    Hiring: { dot: "bg-green-500", badge: "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400 border-green-200 dark:border-green-500/20" },
    Product: { dot: "bg-blue-500", badge: "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border-blue-200 dark:border-blue-500/20" },
    Growth: { dot: "bg-purple-500", badge: "bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400 border-purple-200 dark:border-purple-500/20" },
    Funding: { dot: "bg-yellow-500", badge: "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400 border-yellow-200 dark:border-yellow-500/20" },
    Content: { dot: "bg-orange-500", badge: "bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400 border-orange-200 dark:border-orange-500/20" },
    Other: { dot: "bg-neutral-500", badge: "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700" },
  };

  const confidenceStyles: Record<Signal["confidence"], string> = {
    High: "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-black border-transparent",
    Medium: "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 border-neutral-300 dark:border-neutral-700",
    Low: "bg-transparent text-neutral-500 border-neutral-200 dark:border-neutral-800",
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Intelligence Signals</h3>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">AI-detected investment-relevant signals from public data.</p>
      </div>

      {sortedSignals.length === 0 ? (
        <div className="rounded-lg border border-dashed border-neutral-200 dark:border-neutral-800 p-8 text-center text-sm text-neutral-500 dark:text-neutral-400">
          No meaningful signals detected.
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="relative before:absolute before:inset-y-0 before:left-3 before:w-px before:bg-neutral-200 dark:before:bg-neutral-800 flex flex-col gap-8 sm:gap-6"
        >
          {sortedSignals.map((signal, idx) => (
            <motion.div
              key={signal.id || idx}
              variants={itemVariants}
              className="relative pl-10"
            >
              {/* Timeline Dot */}
              <div
                className={cn(
                  "absolute left-2 top-2 h-2.5 w-2.5 rounded-full ring-4 ring-white dark:ring-neutral-900",
                  categoryStyles[signal.category]?.dot || categoryStyles.Other.dot
                )}
              />

              {/* Card */}
              <motion.div
                whileHover={{ scale: 1.01 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className={cn(
                  "group rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 sm:p-6 transition-all duration-200 shadow-sm hover:shadow-md",
                  signal.confidence === "High" ? "hover:border-neutral-400 dark:hover:border-neutral-600" : ""
                )}
              >
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className={cn("inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium", categoryStyles[signal.category]?.badge || categoryStyles.Other.badge)}>
                      {signal.category}
                    </span>
                    <h4 className="font-semibold text-neutral-900 dark:text-neutral-100">{signal.title}</h4>
                  </div>
                  <span className={cn("inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold", confidenceStyles[signal.confidence])}>
                    {signal.confidence}
                  </span>
                </div>

                <p className="mb-4 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
                  {signal.description}
                </p>

                <div className="rounded-md bg-neutral-50 dark:bg-neutral-950 p-3 text-xs italic text-neutral-600 dark:text-neutral-400 border border-neutral-100 dark:border-neutral-800/50 relative">
                  <span className="absolute -left-1.5 -top-1.5 bg-white dark:bg-neutral-900 px-1 text-[10px] uppercase font-bold text-neutral-400 dark:text-neutral-500">Source Excerpt</span>
                  "{signal.detectedFrom}"
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
