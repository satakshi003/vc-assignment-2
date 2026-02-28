import MinimalNavbar from "@/components/MinimalNavbar";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-neutral-950">
      <MinimalNavbar />
      <main className="flex-1">
        {children}
      </main>

      <footer className="border-t border-neutral-100 dark:border-neutral-900 py-12 bg-neutral-50 dark:bg-neutral-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-black dark:bg-white flex items-center justify-center">
              <div className="h-3 w-3 rounded-sm bg-white dark:bg-black" />
            </div>
            <span className="font-semibold text-neutral-900 dark:text-white">Ventura</span>
          </div>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            © {new Date().getFullYear()} Ventura Intelligence. Built for high-signal sourcing.
          </p>
          <div className="flex items-center gap-6 text-sm text-neutral-500 dark:text-neutral-400">
            <a href="#" className="hover:text-black dark:hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-black dark:hover:text-white transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
