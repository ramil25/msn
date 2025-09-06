'use client';

import { Note } from '@/types/note';
import { noteColorClasses, formatDate } from '@/lib/utils';
import { Edit3, Trash2 } from 'lucide-react';

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
}

export function NoteCard({ note, onEdit, onDelete }: NoteCardProps) {
  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this note?')) {
      onDelete(note.id);
    }
  };

  const contentPreview = note.content.length > 100 
    ? note.content.substring(0, 100) + '...' 
    : note.content;

  return (
    <div 
      className={`
        p-4 rounded-lg border-2 shadow-sm transition-all duration-200 cursor-pointer
        ${noteColorClasses[note.color]}
      `}
      onClick={() => onEdit(note)}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-gray-800 text-lg leading-tight">
          {note.title || 'Untitled Note'}
        </h3>
        <div className="flex gap-1 ml-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(note);
            }}
            className="p-1 rounded hover:bg-black hover:bg-opacity-10 transition-colors"
            title="Edit note"
          >
            <Edit3 size={16} className="text-gray-600" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
            className="p-1 rounded hover:bg-red-500 hover:bg-opacity-20 transition-colors"
            title="Delete note"
          >
            <Trash2 size={16} className="text-gray-600 hover:text-red-600" />
          </button>
        </div>
      </div>
      
      {note.summary && (
        <div className="mb-2">
          <p className="text-sm text-gray-600 italic">
            &quot;{note.summary}&quot;
          </p>
        </div>
      )}
      
      <p className="text-gray-700 text-sm leading-relaxed mb-3">
        {contentPreview}
      </p>
      
      <div className="text-xs text-gray-500">
        {formatDate(note.updatedAt)}
      </div>
    </div>
  );
}