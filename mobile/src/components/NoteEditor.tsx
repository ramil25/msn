import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Note, NoteColor, CreateNoteInput, UpdateNoteInput } from '../types/note';
import { noteColorOptions } from '../lib/utils';
import { AIService } from '../lib/ai-service';

interface NoteEditorProps {
  note?: Note;
  visible: boolean;
  onClose: () => void;
  onSave: (input: CreateNoteInput | UpdateNoteInput) => void;
}

export function NoteEditor({ note, visible, onClose, onSave }: NoteEditorProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [color, setColor] = useState<NoteColor>('yellow');
  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setColor(note.color);
    } else {
      setTitle('');
      setContent('');
      setColor('yellow');
    }
  }, [note, visible]);

  const handleSave = async () => {
    if (!title.trim() && !content.trim()) return;

    setIsSaving(true);
    setIsGeneratingSummary(true);

    try {
      let summary: string | undefined;
      
      // Generate summary if content is substantial
      if (content.trim().length > 50) {
        summary = await AIService.summarizeNote(content);
      }

      const noteData = {
        title: title.trim() || 'Untitled Note',
        content: content.trim(),
        color,
        ...(summary && { summary }),
      };

      if (note) {
        onSave({ ...noteData, id: note.id });
      } else {
        onSave(noteData);
      }

      onClose();
    } catch (error) {
      console.error('Error saving note:', error);
    } finally {
      setIsSaving(false);
      setIsGeneratingSummary(false);
    }
  };

  const ColorPicker = () => (
    <View style={styles.colorPicker}>
      <Text style={styles.label}>Color</Text>
      <View style={styles.colorOptions}>
        {noteColorOptions.map((option) => (
          <TouchableOpacity
            key={option.value}
            onPress={() => setColor(option.value)}
            style={[
              styles.colorOption,
              { backgroundColor: option.color },
              color === option.value && styles.selectedColor,
            ]}
          />
        ))}
      </View>
    </View>
  );

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            {note ? 'Edit Note' : 'New Note'}
          </Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#374151" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.field}>
            <Text style={styles.label}>Title</Text>
            <TextInput
              style={styles.titleInput}
              value={title}
              onChangeText={setTitle}
              placeholder="Enter note title..."
              autoFocus
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Content</Text>
            <TextInput
              style={styles.contentInput}
              value={content}
              onChangeText={setContent}
              placeholder="Write your note here..."
              multiline
              textAlignVertical="top"
            />
          </View>

          <ColorPicker />

          {isGeneratingSummary && (
            <View style={styles.aiStatus}>
              <ActivityIndicator size="small" color="#3b82f6" />
              <Text style={styles.aiStatusText}>Generating summary...</Text>
            </View>
          )}
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={onClose}
            disabled={isSaving}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.saveButton,
              (!title.trim() && !content.trim()) || isSaving ? styles.saveButtonDisabled : null,
            ]}
            onPress={handleSave}
            disabled={isSaving || (!title.trim() && !content.trim())}
          >
            {isSaving ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <Ionicons name="save" size={16} color="#fff" />
                <Text style={styles.saveButtonText}>Save Note</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#374151',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  field: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  titleInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9fafb',
  },
  contentInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9fafb',
    minHeight: 200,
  },
  colorPicker: {
    marginBottom: 24,
  },
  colorOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  colorOption: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#d1d5db',
  },
  selectedColor: {
    borderColor: '#374151',
    borderWidth: 3,
  },
  aiStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
  },
  aiStatusText: {
    fontSize: 14,
    color: '#3b82f6',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    gap: 12,
  },
  cancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
  },
  saveButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: '#3b82f6',
    gap: 8,
  },
  saveButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});