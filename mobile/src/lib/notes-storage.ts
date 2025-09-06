import AsyncStorage from '@react-native-async-storage/async-storage';
import { Note, CreateNoteInput, UpdateNoteInput } from '../types/note';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'sticky_notes';

export class NotesStorage {
  static async getAllNotes(): Promise<Note[]> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
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

  static async saveNote(input: CreateNoteInput): Promise<Note> {
    const now = new Date().toISOString();
    const note: Note = {
      id: uuidv4(),
      title: input.title,
      content: input.content,
      color: input.color || 'yellow',
      createdAt: now,
      updatedAt: now,
    };

    const notes = await this.getAllNotes();
    notes.unshift(note);
    await this.saveNotes(notes);
    
    return note;
  }

  static async updateNote(input: UpdateNoteInput): Promise<Note | null> {
    const notes = await this.getAllNotes();
    const index = notes.findIndex(note => note.id === input.id);
    
    if (index === -1) return null;

    const updatedNote: Note = {
      ...notes[index],
      ...input,
      updatedAt: new Date().toISOString(),
    };

    notes[index] = updatedNote;
    await this.saveNotes(notes);
    
    return updatedNote;
  }

  static async deleteNote(id: string): Promise<boolean> {
    const notes = await this.getAllNotes();
    const filteredNotes = notes.filter(note => note.id !== id);
    
    if (filteredNotes.length === notes.length) return false;
    
    await this.saveNotes(filteredNotes);
    return true;
  }

  static async getNote(id: string): Promise<Note | null> {
    const notes = await this.getAllNotes();
    return notes.find(note => note.id === id) || null;
  }

  static async searchNotes(query: string): Promise<Note[]> {
    const notes = await this.getAllNotes();
    const lowercaseQuery = query.toLowerCase();
    
    return notes.filter(note =>
      note.title.toLowerCase().includes(lowercaseQuery) ||
      note.content.toLowerCase().includes(lowercaseQuery) ||
      (note.summary && note.summary.toLowerCase().includes(lowercaseQuery))
    );
  }

  private static async saveNotes(notes: Note[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    } catch (error) {
      console.error('Error saving notes:', error);
    }
  }
}