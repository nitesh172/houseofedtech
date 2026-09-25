export interface User {
  _id: string
  name: string
  email: string
  role?: string
  createdAt?: string
  updatedAt?: string
}

export interface Note {
  _id: string
  title: string
  content: string
  summary?: string
  tags: string[]
  isPinned: boolean
  isArchived: boolean
  createdBy: string | User
  createdAt: string
  updatedAt: string
}

export interface CreateNoteInput {
  title: string
  content: string
  summary?: string
  tags?: string[]
  isPinned?: boolean
  isArchived?: boolean
}

export interface UpdateNoteInput {
  title?: string
  content?: string
  summary?: string
  tags?: string[]
  isPinned?: boolean
  isArchived?: boolean
}

export interface NoteFilters {
  tags?: string[]
  isPinned?: boolean
  isArchived?: boolean
  search?: string
}

export interface AISummaryResponse {
  summary: string
  keyPoints?: string[]
}
