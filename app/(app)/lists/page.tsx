"use client";

import { useState, useEffect } from "react";
import { Trash2, Building2, Plus, Edit2, ChevronRight } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { VCList } from "@/types/company";
import { getLists, deleteList, renameList, createList } from "@/lib/listManager";
import { useToast } from "@/lib/useToast";
import ConfirmModal from "@/components/ConfirmModal";
import InputModal from "@/components/InputModal";

export default function ListsPage() {
  const [lists, setLists] = useState<VCList[]>([]);
  const [mounted, setMounted] = useState(false);
  const { addToast } = useToast();

  // ── Modal State ───────────────────────────────────────────────────────
  const [confirmDeleteTarget, setConfirmDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [renameTarget, setRenameTarget] = useState<{ id: string; name: string } | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  useEffect(() => {
    setLists(getLists());
    setMounted(true);
  }, []);

  // ── Delete ─────────────────────────────────────────────────────────
  const handleDeleteConfirmed = () => {
    if (!confirmDeleteTarget) return;
    deleteList(confirmDeleteTarget.id);
    setLists(getLists());
    addToast({
      title: "Watchlist Deleted",
      description: `"${confirmDeleteTarget.name}" was removed permanently.`,
      type: "info",
    });
    setConfirmDeleteTarget(null);
  };

  // ── Rename ─────────────────────────────────────────────────────────
  const handleRenameConfirmed = (newName: string) => {
    if (!renameTarget || newName === renameTarget.name) {
      setRenameTarget(null);
      return;
    }
    renameList(renameTarget.id, newName);
    setLists(getLists());
    addToast({
      title: "Watchlist Renamed",
      description: `Renamed to "${newName}".`,
      type: "success",
    });
    setRenameTarget(null);
  };

  // ── Create ─────────────────────────────────────────────────────────
  const handleCreateConfirmed = (name: string) => {
    createList(name);
    setLists(getLists());
    addToast({
      title: "Watchlist Created",
      description: `"${name}" is ready to use.`,
      type: "success",
    });
    setIsCreateOpen(false);
  };

  if (!mounted) return <div className="p-8 text-sm text-neutral-500">Loading lists...</div>;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex h-full flex-col p-4 sm:p-8"
      >
        <div className="mb-8 flex items-end justify-between border-b border-neutral-200 dark:border-neutral-800 pb-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">My Watchlists</h1>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">Manage your saved company collections.</p>
          </div>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-2 rounded-md bg-black dark:bg-white px-4 py-2 text-sm font-medium text-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Create List
          </button>
        </div>

        {lists.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-dashed border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900/50 text-center">
            <Building2 className="mb-4 h-8 w-8 text-neutral-400 dark:text-neutral-500" />
            <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">No watchlists found</h3>
            <p className="mt-1 max-w-sm text-sm text-neutral-500 dark:text-neutral-400">
              Create a list here, or go to the Companies directory and save some profiles.
            </p>
            <button
              onClick={() => setIsCreateOpen(true)}
              className="mt-6 rounded-md bg-black dark:bg-white px-4 py-2 text-sm font-medium text-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors"
            >
              Create your first list
            </button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            <AnimatePresence>
              {lists.map((list) => (
                <motion.div
                  key={list.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link
                    href={`/lists/${list.id}`}
                    className="group relative flex h-full flex-col justify-between rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-black/20 dark:hover:border-white/20 hover:shadow-md"
                  >
                    <div>
                      <div className="mb-4 flex items-start justify-between">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400">
                          <ListIcon count={list.companies.length} />
                        </div>

                        <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setRenameTarget({ id: list.id, name: list.name });
                            }}
                            className="rounded-md p-1.5 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
                            aria-label="Rename list"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setConfirmDeleteTarget({ id: list.id, name: list.name });
                            }}
                            className="rounded-md p-1.5 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                            aria-label="Delete list"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {list.name}
                      </h3>

                      <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                        {list.companies.length} {list.companies.length === 1 ? "company" : "companies"} saved
                      </p>
                    </div>

                    <div className="mt-6 flex items-center justify-between border-t border-neutral-100 dark:border-neutral-800 pt-4 text-xs font-medium text-neutral-500 dark:text-neutral-400">
                      <span>Updated {new Date(list.updatedAt).toLocaleDateString()}</span>
                      <span className="flex items-center gap-1 text-black dark:text-white opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-1">
                        View List
                        <ChevronRight className="h-3 w-3" />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.div>

      {/* ── Delete Confirmation Modal ── */}
      <ConfirmModal
        isOpen={!!confirmDeleteTarget}
        title="Delete Watchlist"
        description={`Are you sure you want to permanently delete "${confirmDeleteTarget?.name}"? This cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Keep it"
        variant="danger"
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setConfirmDeleteTarget(null)}
      />

      {/* ── Rename Modal ── */}
      <InputModal
        isOpen={!!renameTarget}
        title="Rename Watchlist"
        placeholder="Enter new name..."
        initialValue={renameTarget?.name ?? ""}
        confirmLabel="Rename"
        onConfirm={handleRenameConfirmed}
        onCancel={() => setRenameTarget(null)}
      />

      {/* ── Create Modal ── */}
      <InputModal
        isOpen={isCreateOpen}
        title="Create New Watchlist"
        placeholder="e.g. AI Infrastructure, Seed Portfolio..."
        confirmLabel="Create"
        onConfirm={handleCreateConfirmed}
        onCancel={() => setIsCreateOpen(false)}
      />
    </>
  );
}

// Inline icon helper
function ListIcon({ count }: { count: number }) {
  if (count === 0) return <Building2 className="h-5 w-5 opacity-50" />;
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" />
      <line x1="3" y1="12" x2="3.01" y2="12" />
      <line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  );
}
