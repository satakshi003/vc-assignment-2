"use client";

import { useState, useEffect } from "react";
import { Trash2, Building2, Plus, Edit2, ChevronRight } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { VCList } from "@/types/company";
import { getLists, deleteList, renameList, createList } from "@/lib/listManager";
import { useToast } from "@/lib/useToast";

export default function ListsPage() {
  const [lists, setLists] = useState<VCList[]>([]);
  const [mounted, setMounted] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    setLists(getLists());
    setMounted(true);
  }, []);

  const handleRemoveList = (e: React.MouseEvent, id: string, name: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm(`Are you sure you want to delete the list "${name}"?`)) {
      deleteList(id);
      setLists(getLists());
      addToast({
        title: "List Deleted",
        description: `"${name}" has been removed.`,
        type: "info"
      });
    }
  };

  const handleRenameList = (e: React.MouseEvent, id: string, oldName: string) => {
    e.preventDefault();
    e.stopPropagation();
    const newName = prompt("Enter new list name:", oldName);
    if (newName && newName.trim() !== "" && newName !== oldName) {
      renameList(id, newName);
      setLists(getLists());
      addToast({
        title: "List Renamed",
        description: `Successfully renamed to "${newName}".`,
        type: "success"
      });
    }
  };

  const handleCreateNew = () => {
    const name = prompt("Enter a name for your new list:");
    if (name && name.trim() !== "") {
      createList(name);
      setLists(getLists());
      addToast({
        title: "List Created",
        description: `"${name}" is ready for companies.`,
        type: "success"
      });
    }
  };

  if (!mounted) return <div className="p-8">Loading lists...</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex h-full flex-col p-8"
    >
      <div className="mb-8 flex items-end justify-between border-b border-neutral-200 dark:border-neutral-800 pb-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">My Watchlists</h1>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">Manage your saved company collections.</p>
        </div>
        <button
          onClick={handleCreateNew}
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
            Create a list here, or go to the Companies directory and save some profiles to build your lists.
          </p>
          <button
            onClick={handleCreateNew}
            className="mt-6 rounded-md bg-black dark:bg-white px-4 py-2 text-sm font-medium text-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors"
          >
            Create your first list
          </button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
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
                <Link href={`/lists/${list.id}`} className="group relative flex h-full flex-col justify-between rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-black/20 dark:hover:border-white/20 hover:shadow-md">
                  <div>
                    <div className="mb-4 flex items-start justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400">
                        <ListIcon count={list.companies.length} />
                      </div>

                      <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                        <button
                          onClick={(e) => handleRenameList(e, list.id, list.name)}
                          className="rounded-md p-1.5 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
                          aria-label="Rename list"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => handleRemoveList(e, list.id, list.name)}
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
                      {list.companies.length} {list.companies.length === 1 ? 'company' : 'companies'} saved
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
  );
}

// Custom simple icon component
function ListIcon({ count }: { count: number }) {
  if (count === 0) return <Building2 className="h-5 w-5 opacity-50" />;
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6"></line>
      <line x1="8" y1="12" x2="21" y2="12"></line>
      <line x1="8" y1="18" x2="21" y2="18"></line>
      <line x1="3" y1="6" x2="3.01" y2="6"></line>
      <line x1="3" y1="12" x2="3.01" y2="12"></line>
      <line x1="3" y1="18" x2="3.01" y2="18"></line>
    </svg>
  );
}
