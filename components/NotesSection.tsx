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
        <h3 className="font-semibold text-neutral-900">Your Notes</h3>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 rounded-md bg-black px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-neutral-800 disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {saving ? "Saving..." : saved ? "Saved!" : "Save Notes"}
        </button>
      </div>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Add context, meeting notes, action items..."
        className="min-h-[200px] w-full resize-y rounded-md border border-neutral-300 p-4 text-sm leading-relaxed text-neutral-900 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
      />
    </div>
  );
}
