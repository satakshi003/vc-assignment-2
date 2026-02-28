"use client";

import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { LayoutDashboard } from "lucide-react";
import { motion } from "framer-motion";

export default function MinimalNavbar() {
  return (
    <nav className="h-16 border-b border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black dark:bg-white text-white dark:text-black transition-transform group-hover:scale-105 active:scale-95">
            <LayoutDashboard className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Ventura
          </span>
        </Link>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link href="/companies">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="hidden sm:flex items-center justify-center rounded-full bg-black dark:bg-white px-5 py-2 text-sm font-medium text-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors shadow-sm"
            >
              Enter App
            </motion.button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
