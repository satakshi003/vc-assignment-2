"use client";

import { useState, useEffect } from "react";
import { Company, VCList } from "@/types/company";
import { getLists, createList, addCompaniesToList, removeCompanyFromList, addCompanyToList } from "@/lib/listManager";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { X, Plus, Check, ListFilter } from "lucide-react";
import { useToast } from "@/lib/useToast";

interface ListModalProps {
  isOpen: boolean;
  onClose: () => void;
  companies: Company[];
}

export default function ListModal({ isOpen, onClose, companies }: ListModalProps) {
  const [lists, setLists] = useState<VCList[]>([]);
  const [activeListIds, setActiveListIds] = useState<Set<string>>(new Set());
  const [isCreating, setIsCreating] = useState(false);
  const [newListName, setNewListName] = useState("");
  const { addToast } = useToast();

  useEffect(() => {
    if (isOpen && companies.length > 0) {
      setLists(getLists());

      // A list is considered "active" (checked) in bulk mode only if ALL passed companies are in it.
      // If a single company is passed, it functions identically to before.
      const initialActive = getLists().filter(list => {
        return companies.every(c => list.companies.some(lc => lc.id === c.id));
      }).map(l => l.id);

      setActiveListIds(new Set(initialActive));
      setIsCreating(false);
      setNewListName("");
    }
  }, [isOpen, companies]);

  const handleToggleList = (list: VCList) => {
    const isCurrentlyActive = activeListIds.has(list.id);

    if (isCurrentlyActive) {
      // Uncheck behavior: remove all passed companies from this list
      companies.forEach(company => removeCompanyFromList(list.id, company.id));

      setActiveListIds(prev => {
        const next = new Set(prev);
        next.delete(list.id);
        return next;
      });
      const rmCount = companies.length;
      const rmLabel = rmCount === 1 ? "company" : "companies";
      addToast({
        title: "Removed from List",
        description: `${rmCount} ${rmLabel} removed from ${list.name}.`,
        type: "info"
      });
    } else {
      // Check behavior: add all passed companies to this list
      addCompaniesToList(list.id, companies);

      setActiveListIds(prev => {
        const next = new Set(prev);
        next.add(list.id);
        return next;
      });
      const addCount = companies.length;
      const addLabel = addCount === 1 ? "company" : "companies";
      addToast({
        title: "Added to List",
        description: `${addCount} ${addLabel} added to ${list.name}.`,
        type: "success"
      });
    }

    // Refresh to get updated counts
    setLists(getLists());
  };

  const handleCreateList = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListName.trim()) return;

    const newList = createList(newListName);
    addCompaniesToList(newList.id, companies);

    setLists(getLists());
    setActiveListIds(prev => {
      const next = new Set(prev);
      next.add(newList.id);
      return next;
    });

    setNewListName("");
    setIsCreating(false);

    addToast({
      title: "List Created",
      description: `${newList.name} created and populated.`,
      type: "success"
    });
  };

  const modalVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95, y: 10 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 25 } },
    exit: { opacity: 0, scale: 0.95, y: 10, transition: { duration: 0.15 } }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />

        <motion.div
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xl"
        >
          <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 px-6 py-4">
            <div className="flex items-center gap-2">
              <ListFilter className="h-4 w-4 text-neutral-500" />
              <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">Save to List</h2>
            </div>
            <button
              onClick={onClose}
              className="rounded-md p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 dark:hover:bg-neutral-800 dark:hover:text-neutral-300 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="max-h-80 overflow-y-auto px-6 py-4 space-y-2">
            {lists.length === 0 && !isCreating ? (
              <div className="text-center py-6">
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">You haven't created any lists yet.</p>
                <button
                  onClick={() => setIsCreating(true)}
                  className="inline-flex items-center gap-1.5 rounded-md bg-blue-50 dark:bg-blue-500/10 px-3 py-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Create your first list
                </button>
              </div>
            ) : (
              lists.map((list) => {
                const isActive = activeListIds.has(list.id);
                return (
                  <button
                    key={list.id}
                    onClick={() => handleToggleList(list)}
                    className="flex w-full items-center justify-between rounded-lg border border-neutral-200 dark:border-neutral-800 p-3 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors focus:outline-none"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`flex h-5 w-5 items-center justify-center rounded border ${isActive ? 'bg-blue-600 border-blue-600 dark:bg-blue-500 dark:border-blue-500' : 'bg-transparent border-neutral-300 dark:border-neutral-600'}`}>
                        {isActive && <Check className="h-3.5 w-3.5 text-white" />}
                      </div>
                      <div className="flex flex-col items-start">
                        <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{list.name}</span>
                        <span className="text-xs text-neutral-500 dark:text-neutral-400">{list.companies.length} companies</span>
                      </div>
                    </div>
                  </button>
                );
              })
            )}

            {isCreating ? (
              <form onSubmit={handleCreateList} className="mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    autoFocus
                    placeholder="List name..."
                    value={newListName}
                    onChange={(e) => setNewListName(e.target.value)}
                    className="flex-1 rounded-md border-0 py-1.5 px-3 text-sm ring-1 ring-inset ring-neutral-300 dark:ring-neutral-700 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-inset focus:ring-blue-600 dark:focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    disabled={!newListName.trim()}
                    className="rounded-md bg-neutral-900 dark:bg-neutral-100 px-3 py-1.5 text-sm font-medium text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-white disabled:opacity-50 transition-colors"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreating(false);
                      setNewListName("");
                    }}
                    className="rounded-md p-1.5 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </form>
            ) : (
              lists.length > 0 && (
                <button
                  onClick={() => setIsCreating(true)}
                  className="flex w-full items-center gap-2 rounded-lg border border-dashed border-neutral-300 dark:border-neutral-700 p-3 text-sm font-medium text-neutral-500 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 hover:text-neutral-900 dark:hover:text-neutral-300 transition-colors mt-4"
                >
                  <Plus className="h-4 w-4" />
                  Create new list
                </button>
              )
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
