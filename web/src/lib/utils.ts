import { NoteColor } from '@/types/note';

export const noteColorClasses: Record<NoteColor, string> = {
  yellow: 'bg-yellow-200 border-yellow-300 hover:bg-yellow-300',
  blue: 'bg-blue-200 border-blue-300 hover:bg-blue-300',
  green: 'bg-green-200 border-green-300 hover:bg-green-300',
  pink: 'bg-pink-200 border-pink-300 hover:bg-pink-300',
  purple: 'bg-purple-200 border-purple-300 hover:bg-purple-300',
  orange: 'bg-orange-200 border-orange-300 hover:bg-orange-300',
};

export const noteColorOptions: { value: NoteColor; label: string; class: string }[] = [
  { value: 'yellow', label: 'Yellow', class: 'bg-yellow-200' },
  { value: 'blue', label: 'Blue', class: 'bg-blue-200' },
  { value: 'green', label: 'Green', class: 'bg-green-200' },
  { value: 'pink', label: 'Pink', class: 'bg-pink-200' },
  { value: 'purple', label: 'Purple', class: 'bg-purple-200' },
  { value: 'orange', label: 'Orange', class: 'bg-orange-200' },
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