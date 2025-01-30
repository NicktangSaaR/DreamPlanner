import { useState, useEffect, useCallback } from "react";
import { useNotes } from "@/hooks/useNotes";
import NoteDialog from "./NoteDialog";
import NotesList from "./NotesList";

interface Note {
  id: string;
  title: string;
  content: string;
  date: string;
  author_name?: string;
  is_pinned?: boolean;
  stars?: number;
}

interface NotesSectionProps {
  onNotesChange?: (notes: Note[]) => void;
}

export default function NotesSection({ onNotesChange }: NotesSectionProps) {
  const [open, setOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const { notes = [], createNote, updateNote, handleTogglePin, handleToggleStar } = useNotes();

  // Memoize handlers to prevent unnecessary re-renders
  const handleCreateNote = useCallback(async (data: { title: string; content: string }) => {
    try {
      await createNote(data);
      setOpen(false);
    } catch (error) {
      console.error("Error creating note:", error);
    }
  }, [createNote]);

  const handleEditNote = useCallback((note: Note) => {
    if (note && note.id) {
      setEditingNote(note);
      setOpen(true);
    }
  }, []);

  const handleUpdateNote = useCallback(async (data: { title: string; content: string }) => {
    if (!editingNote?.id) return;

    try {
      await updateNote({
        ...editingNote,
        title: data.title,
        content: data.content,
      });
      setOpen(false);
      setEditingNote(null);
    } catch (error) {
      console.error("Error updating note:", error);
    }
  }, [editingNote, updateNote]);

  const canEditNote = useCallback((note: Note) => {
    return Boolean(note?.id);
  }, []);

  // Only call onNotesChange when notes actually change and is a valid array
  useEffect(() => {
    if (onNotesChange && Array.isArray(notes)) {
      console.log("Notes changed, notifying parent:", notes);
      onNotesChange(notes);
    }
  }, [notes, onNotesChange]);

  return (
    <div className="space-y-4">
      <NotesList
        notes={notes}
        onCreateNote={() => setOpen(true)}
        onTogglePin={handleTogglePin}
        onToggleStar={handleToggleStar}
        onEdit={handleEditNote}
        canEditNote={canEditNote}
      />

      <NoteDialog
        open={open}
        onOpenChange={setOpen}
        onSubmit={editingNote ? handleUpdateNote : handleCreateNote}
        editingNote={editingNote}
      />
    </div>
  );
}