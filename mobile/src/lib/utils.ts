import { NoteColor } from '../types/note';

export const noteColorStyles: Record<NoteColor, any> = {
  yellow: {
    backgroundColor: '#fef3c7',
    borderColor: '#fcd34d',
  },
  blue: {
    backgroundColor: '#dbeafe',
    borderColor: '#60a5fa',
  },
  green: {
    backgroundColor: '#dcfce7',
    borderColor: '#4ade80',
  },
  pink: {
    backgroundColor: '#fce7f3',
    borderColor: '#f472b6',
  },
  purple: {
    backgroundColor: '#ede9fe',
    borderColor: '#a78bfa',
  },
  orange: {
    backgroundColor: '#fed7aa',
    borderColor: '#fb923c',
  },
};

export const noteColorOptions: { value: NoteColor; label: string; color: string }[] = [
  { value: 'yellow', label: 'Yellow', color: '#fcd34d' },
  { value: 'blue', label: 'Blue', color: '#60a5fa' },
  { value: 'green', label: 'Green', color: '#4ade80' },
  { value: 'pink', label: 'Pink', color: '#f472b6' },
  { value: 'purple', label: 'Purple', color: '#a78bfa' },
  { value: 'orange', label: 'Orange', color: '#fb923c' },
];

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  // Less than 24 hours ago
  if (diff < 24 * 60 * 60 * 1000) {
    const hours = Math.floor(diff / (60 * 60 * 1000));
    if (hours < 1) {
      const minutes = Math.floor(diff / (60 * 1000));
      return minutes < 1 ? 'Just now' : `${minutes}m ago`;
    }
    return `${hours}h ago`;
  }
  
  // More than 24 hours ago
  const days = Math.floor(diff / (24 * 60 * 60 * 1000));
  if (days < 7) {
    return `${days}d ago`;
  }
  
  // More than a week ago, show date
  return date.toLocaleDateString();
}