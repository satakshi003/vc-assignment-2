"use client";

import { useEffect, useState } from "react";
import { Save } from "lucide-react";

interface NotesSectionProps {
  companyId: string;
}

export default function NotesSection({ companyId }: NotesSectionProps) {
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const savedNotes = localStorage.getItem(`notes-${companyId}`);
    if (savedNotes) {
      setNotes(savedNotes);
    }
  }, [companyId]);

  const handleSave = () => {
    setSaving(true);
    localStorage.setItem(`notes-${companyId}`, notes);

    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 500); // simulate network delay for better UX
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">Your Notes</h3>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 rounded-md bg-black dark:bg-white px-3 py-1.5 text-sm font-medium text-white dark:text-black transition-colors hover:bg-neutral-800 dark:hover:bg-neutral-200 disabled:opacity-50 dark:disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {saving ? "Saving..." : saved ? "Saved!" : "Save Notes"}
        </button>
      </div>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Add context, meeting notes, action items..."
        className="min-h-[200px] w-full resize-y rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 p-4 text-sm leading-relaxed text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:border-black dark:focus:border-white focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
      />
    </div>
  );
}
