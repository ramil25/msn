export interface Note {
  id: string;
  title: string;
  content: string;
  summary?: string;
  color: NoteColor;
  createdAt: string;
  updatedAt: string;
}

export type NoteColor = 
  | 'yellow'
  | 'blue'
  | 'green'
  | 'pink'
  | 'purple'
  | 'orange';

export interface CreateNoteInput {
  title: string;
  content: string;
  color?: NoteColor;
}

export interface UpdateNoteInput extends Partial<CreateNoteInput> {
  id: string;
}