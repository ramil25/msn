import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Note, CreateNoteInput, UpdateNoteInput } from '../types/note';
import { NotesStorage } from '../lib/notes-storage';
import { NoteCard } from './NoteCard';
import { NoteEditor } from './NoteEditor';

export function NotesApp() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNote, setSelectedNote] = useState<Note | undefined>();
  const [isEditorVisible, setIsEditorVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Load notes on component mount
  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const loadedNotes = await NotesStorage.getAllNotes();
      setNotes(loadedNotes);
    } catch (error) {
      console.error('Error loading notes:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadNotes();
  };

  // Filter notes based on search query
  const filteredNotes = React.useMemo(() => {
    if (!searchQuery.trim()) return notes;
    
    const query = searchQuery.toLowerCase();
    return notes.filter(note =>
      note.title.toLowerCase().includes(query) ||
      note.content.toLowerCase().includes(query) ||
      (note.summary && note.summary.toLowerCase().includes(query))
    );
  }, [notes, searchQuery]);

  const handleCreateNote = () => {
    setSelectedNote(undefined);
    setIsEditorVisible(true);
  };

  const handleEditNote = (note: Note) => {
    setSelectedNote(note);
    setIsEditorVisible(true);
  };

  const handleSaveNote = async (input: CreateNoteInput | UpdateNoteInput) => {
    try {
      if ('id' in input) {
        // Update existing note
        const updatedNote = await NotesStorage.updateNote(input);
        if (updatedNote) {
          setNotes(prev => 
            prev.map(note => note.id === updatedNote.id ? updatedNote : note)
          );
        }
      } else {
        // Create new note
        const newNote = await NotesStorage.saveNote(input);
        setNotes(prev => [newNote, ...prev]);
      }
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

  const handleDeleteNote = async (id: string) => {
    try {
      const success = await NotesStorage.deleteNote(id);
      if (success) {
        setNotes(prev => prev.filter(note => note.id !== id));
      }
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const handleCloseEditor = () => {
    setIsEditorVisible(false);
    setSelectedNote(undefined);
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="document-text-outline" size={64} color="#9ca3af" />
      <Text style={styles.emptyTitle}>
        {searchQuery ? 'No notes found' : 'No notes yet'}
      </Text>
      <Text style={styles.emptySubtitle}>
        {searchQuery 
          ? 'Try adjusting your search query' 
          : 'Create your first sticky note to get started'
        }
      </Text>
      {!searchQuery && (
        <TouchableOpacity 
          style={styles.createFirstButton}
          onPress={handleCreateNote}
        >
          <Text style={styles.createFirstButtonText}>Create First Note</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderNote = ({ item }: { item: Note }) => (
    <NoteCard
      note={item}
      onEdit={handleEditNote}
      onDelete={handleDeleteNote}
    />
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text style={styles.loadingText}>Loading your notes...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTitle}>
          <Ionicons name="document-text" size={28} color="#3b82f6" />
          <Text style={styles.title}>My Sticky Notes</Text>
        </View>
        <TouchableOpacity 
          style={styles.newButton}
          onPress={handleCreateNote}
        >
          <Ionicons name="add" size={20} color="#fff" />
          <Text style={styles.newButtonText}>New</Text>
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInput}>
          <Ionicons name="search" size={20} color="#9ca3af" style={styles.searchIcon} />
          <TextInput
            style={styles.searchField}
            placeholder="Search notes..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            clearButtonMode="while-editing"
          />
        </View>
      </View>

      {/* Notes List */}
      <FlatList
        style={styles.notesList}
        contentContainerStyle={styles.notesContainer}
        data={filteredNotes}
        renderItem={renderNote}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={['#3b82f6']}
            tintColor="#3b82f6"
          />
        }
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />

      {/* Note Editor Modal */}
      <NoteEditor
        note={selectedNote}
        visible={isEditorVisible}
        onClose={handleCloseEditor}
        onSave={handleSaveNote}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  newButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3b82f6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  newButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  searchContainer: {
    padding: 20,
    backgroundColor: '#fff',
  },
  searchInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchField: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#374151',
  },
  notesList: {
    flex: 1,
  },
  notesContainer: {
    padding: 20,
    paddingTop: 0,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    gap: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#374151',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 8,
  },
  createFirstButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  createFirstButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});