import { Note, CreateNoteInput, UpdateNoteInput } from '@/types/note';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'sticky_notes';

export class NotesStorage {
  static getAllNotes(): Note[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];
      
      const notes: Note[] = JSON.parse(stored);
      return notes.sort((a, b) => 
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
    } catch (error) {
      console.error('Error loading notes:', error);
      return [];
    }
  }

  static saveNote(input: CreateNoteInput): Note {
    const now = new Date().toISOString();
    const note: Note = {
      id: uuidv4(),
      title: input.title,
      content: input.content,
      color: input.color || 'yellow',
      createdAt: now,
      updatedAt: now,
    };

    const notes = this.getAllNotes();
    notes.unshift(note);
    this.saveNotes(notes);
    
    return note;
  }

  static updateNote(input: UpdateNoteInput): Note | null {
    const notes = this.getAllNotes();
    const index = notes.findIndex(note => note.id === input.id);
    
    if (index === -1) return null;

    const updatedNote: Note = {
      ...notes[index],
      ...input,
      updatedAt: new Date().toISOString(),
    };

    notes[index] = updatedNote;
    this.saveNotes(notes);
    
    return updatedNote;
  }

  static deleteNote(id: string): boolean {
    const notes = this.getAllNotes();
    const filteredNotes = notes.filter(note => note.id !== id);
    
    if (filteredNotes.length === notes.length) return false;
    
    this.saveNotes(filteredNotes);
    return true;
  }

  static getNote(id: string): Note | null {
    const notes = this.getAllNotes();
    return notes.find(note => note.id === id) || null;
  }

  static searchNotes(query: string): Note[] {
    const notes = this.getAllNotes();
    const lowercaseQuery = query.toLowerCase();
    
    return notes.filter(note =>
      note.title.toLowerCase().includes(lowercaseQuery) ||
      note.content.toLowerCase().includes(lowercaseQuery) ||
      (note.summary && note.summary.toLowerCase().includes(lowercaseQuery))
    );
  }

  private static saveNotes(notes: Note[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    } catch (error) {
      console.error('Error saving notes:', error);
    }
  }
}