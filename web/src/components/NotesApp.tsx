'use client';

import { useState, useEffect } from 'react';
import { Note, CreateNoteInput, UpdateNoteInput } from '@/types/note';
import { NotesStorage } from '@/lib/notes-storage';
import { NoteCard } from '@/components/NoteCard';
import { NoteEditor } from '@/components/NoteEditor';
import { Plus, Search, StickyNote } from 'lucide-react';

export function NotesApp() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNote, setSelectedNote] = useState<Note | undefined>();
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load notes on component mount
  useEffect(() => {
    const loadNotes = () => {
      const loadedNotes = NotesStorage.getAllNotes();
      setNotes(loadedNotes);
      setIsLoading(false);
    };

    loadNotes();
  }, []);

  // Filter notes based on search query
  const filteredNotes = searchQuery.trim() 
    ? NotesStorage.searchNotes(searchQuery)
    : notes;

  const handleCreateNote = () => {
    setSelectedNote(undefined);
    setIsEditorOpen(true);
  };

  const handleEditNote = (note: Note) => {
    setSelectedNote(note);
    setIsEditorOpen(true);
  };

  const handleSaveNote = (input: CreateNoteInput | UpdateNoteInput) => {
    if ('id' in input) {
      // Update existing note
      const updatedNote = NotesStorage.updateNote(input);
      if (updatedNote) {
        setNotes(prev => 
          prev.map(note => note.id === updatedNote.id ? updatedNote : note)
        );
      }
    } else {
      // Create new note
      const newNote = NotesStorage.saveNote(input);
      setNotes(prev => [newNote, ...prev]);
    }
  };

  const handleDeleteNote = (id: string) => {
    const success = NotesStorage.deleteNote(id);
    if (success) {
      setNotes(prev => prev.filter(note => note.id !== id));
    }
  };

  const handleCloseEditor = () => {
    setIsEditorOpen(false);
    setSelectedNote(undefined);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your notes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <StickyNote className="text-blue-600" size={32} />
              <h1 className="text-2xl font-bold text-gray-900">
                My Sticky Notes
              </h1>
            </div>
            <button
              onClick={handleCreateNote}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus size={20} />
              New Note
            </button>
          </div>
        </div>
      </header>

      {/* Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Notes Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {filteredNotes.length === 0 ? (
          <div className="text-center py-12">
            <StickyNote className="mx-auto text-gray-400 mb-4" size={64} />
            <h2 className="text-xl text-gray-600 mb-2">
              {searchQuery ? 'No notes found' : 'No notes yet'}
            </h2>
            <p className="text-gray-500 mb-6">
              {searchQuery 
                ? 'Try adjusting your search query' 
                : 'Create your first sticky note to get started'
              }
            </p>
            {!searchQuery && (
              <button
                onClick={handleCreateNote}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create First Note
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onEdit={handleEditNote}
                onDelete={handleDeleteNote}
              />
            ))}
          </div>
        )}
      </main>

      {/* Note Editor Modal */}
      <NoteEditor
        note={selectedNote}
        isOpen={isEditorOpen}
        onClose={handleCloseEditor}
        onSave={handleSaveNote}
      />
    </div>
  );
}