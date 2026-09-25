"use client"

import React, { useState, useEffect, useMemo, useCallback } from "react"
import { api } from "@/lib/api"
import { Navbar } from "./Navbar"
import { FilterSidebar, type ViewTab } from "./FilterSidebar"
import { NoteCard } from "./NoteCard"
import { CreateNoteDialog } from "./CreateNoteDialog"
import { EditNoteDialog } from "./EditNoteDialog"
import { NoteDetailsDialog } from "./NoteDetailsDialog"
import { EmptyState } from "./EmptyState"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Sparkles,
  Pin,
  Archive,
  FileText,
  Loader2,
  RefreshCw,
  Plus,
} from "lucide-react"
import type { Note } from "@/types"

export function NotesDashboard() {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("")
  const [currentView, setCurrentView] = useState<ViewTab>("all")
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  // Modals & Dialogs
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [viewingNote, setViewingNote] = useState<Note | null>(null)
  const [isViewOpen, setIsViewOpen] = useState(false)

  // Fetch all notes for user
  const fetchNotes = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true)
    } else {
      setLoading(true)
    }
    setError(null)

    try {
      const data = await api.notes.getNotes()
      setNotes(data)
    } catch (err: any) {
      setError(err.message || "Failed to load notes.")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    fetchNotes()
  }, [fetchNotes])

  // Aggregate all unique tags from notes with counts
  const allTagsWithCounts = useMemo(() => {
    const tagCountMap: Record<string, number> = {}
    notes.forEach((note) => {
      if (note.tags && Array.isArray(note.tags)) {
        note.tags.forEach((tag) => {
          const clean = tag.trim().toLowerCase()
          if (clean) {
            tagCountMap[clean] = (tagCountMap[clean] || 0) + 1
          }
        })
      }
    })

    return Object.entries(tagCountMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
  }, [notes])

  // Counts for sidebar tabs
  const counts = useMemo(() => {
    return {
      all: notes.filter((n) => !n.isArchived).length,
      pinned: notes.filter((n) => n.isPinned && !n.isArchived).length,
      archived: notes.filter((n) => n.isArchived).length,
      summarized: notes.filter((n) => n.summary && !n.isArchived).length,
    }
  }, [notes])

  // Filter and search logic
  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      // 1. View filter
      if (currentView === "all" && note.isArchived) return false
      if (currentView === "pinned" && (!note.isPinned || note.isArchived))
        return false
      if (currentView === "archived" && !note.isArchived) return false
      if (currentView === "summarized" && (!note.summary || note.isArchived))
        return false

      // 2. Tag filter
      if (selectedTags.length > 0) {
        const noteTags = (note.tags || []).map((t) => t.toLowerCase())
        const hasAllTags = selectedTags.every((t) => noteTags.includes(t))
        if (!hasAllTags) return false
      }

      // 3. Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim()
        const matchTitle = note.title?.toLowerCase().includes(query)
        const matchContent = note.content?.toLowerCase().includes(query)
        const matchSummary = note.summary?.toLowerCase().includes(query)
        const matchTags = note.tags?.some((t) => t.toLowerCase().includes(query))
        return matchTitle || matchContent || matchSummary || matchTags
      }

      return true
    })
  }, [notes, currentView, selectedTags, searchQuery])

  // Separate pinned vs regular notes when in "all" view
  const { pinnedNotesList, regularNotesList } = useMemo(() => {
    if (currentView !== "all") {
      return { pinnedNotesList: [], regularNotesList: filteredNotes }
    }
    const pinned = filteredNotes.filter((n) => n.isPinned)
    const regular = filteredNotes.filter((n) => !n.isPinned)
    return { pinnedNotesList: pinned, regularNotesList: regular }
  }, [filteredNotes, currentView])

  // Handlers
  const handleTagToggle = (tag: string) => {
    const clean = tag.toLowerCase()
    if (selectedTags.includes(clean)) {
      setSelectedTags(selectedTags.filter((t) => t !== clean))
    } else {
      setSelectedTags([...selectedTags, clean])
    }
  }

  const handleClearTags = () => {
    setSelectedTags([])
  }

  const handleNoteCreated = (newNote: Note) => {
    setNotes((prev) => [newNote, ...prev])
  }

  const handleNoteUpdated = (updatedNote: Note) => {
    setNotes((prev) =>
      prev.map((n) => (n._id === updatedNote._id ? updatedNote : n))
    )
    if (viewingNote?._id === updatedNote._id) {
      setViewingNote(updatedNote)
    }
  }

  const handleTogglePin = async (note: Note) => {
    const updatedStatus = !note.isPinned
    setNotes((prev) =>
      prev.map((n) =>
        n._id === note._id ? { ...n, isPinned: updatedStatus } : n
      )
    )

    try {
      await api.notes.updateNote(note._id, { isPinned: updatedStatus })
    } catch (err) {
      setNotes((prev) =>
        prev.map((n) =>
          n._id === note._id ? { ...n, isPinned: note.isPinned } : n
        )
      )
    }
  }

  const handleToggleArchive = async (note: Note) => {
    const updatedStatus = !note.isArchived
    setNotes((prev) =>
      prev.map((n) =>
        n._id === note._id ? { ...n, isArchived: updatedStatus } : n
      )
    )

    try {
      await api.notes.updateNote(note._id, { isArchived: updatedStatus })
    } catch (err) {
      setNotes((prev) =>
        prev.map((n) =>
          n._id === note._id ? { ...n, isArchived: note.isArchived } : n
        )
      )
    }
  }

  const handleDeleteNote = async (id: string) => {
    if (!confirm("Are you sure you want to delete this note?")) return

    const previousNotes = [...notes]
    setNotes((prev) => prev.filter((n) => n._id !== id))

    try {
      await api.notes.deleteNote(id)
    } catch (err) {
      alert("Failed to delete note. Restoring...")
      setNotes(previousNotes)
    }
  }

  const handleOpenEdit = (note: Note) => {
    setEditingNote(note)
    setIsEditOpen(true)
  }

  const handleOpenView = (note: Note) => {
    setViewingNote(note)
    setIsViewOpen(true)
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onCreateClick={() => setIsCreateOpen(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 flex flex-col lg:flex-row gap-6">
        <FilterSidebar
          currentView={currentView}
          onViewChange={setCurrentView}
          allTags={allTagsWithCounts}
          selectedTags={selectedTags}
          onTagToggle={handleTagToggle}
          onClearTags={handleClearTags}
          counts={counts}
        />

        <div className="flex-1 flex flex-col gap-4">
          {/* Header Bar */}
          <div className="flex items-center justify-between flex-wrap gap-3 pb-2 border-b border-border">
            <div className="flex items-center gap-2">
              <h2 className="font-heading text-base font-medium text-foreground capitalize flex items-center gap-1.5">
                {currentView === "all" && (
                  <>
                    <FileText className="size-4 text-primary" /> All Notes
                  </>
                )}
                {currentView === "pinned" && (
                  <>
                    <Pin className="size-4 text-amber-500 fill-amber-500" /> Pinned Notes
                  </>
                )}
                {currentView === "summarized" && (
                  <>
                    <Sparkles className="size-4 text-purple-400" /> AI Summaries
                  </>
                )}
                {currentView === "archived" && (
                  <>
                    <Archive className="size-4" /> Archived Notes
                  </>
                )}
              </h2>

              <Badge variant="outline" size="sm">
                {filteredNotes.length}
              </Badge>
            </div>

            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="xs"
                onClick={() => fetchNotes(true)}
                disabled={refreshing}
                title="Refresh notes"
                className="rounded-none gap-1"
              >
                <RefreshCw
                  className={`size-3 ${refreshing ? "animate-spin" : ""}`}
                />
                <span className="hidden sm:inline">Refresh</span>
              </Button>

              <Button
                size="xs"
                onClick={() => setIsCreateOpen(true)}
                className="rounded-none gap-1"
              >
                <Plus className="size-3" />
                <span>Create Note</span>
              </Button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 border border-destructive/30 bg-destructive/10 text-destructive text-xs flex items-center justify-between">
              <span>{error}</span>
              <Button
                variant="ghost"
                size="xs"
                onClick={() => fetchNotes()}
                className="text-destructive"
              >
                Retry
              </Button>
            </div>
          )}

          {/* Loading */}
          {loading ? (
            <div className="flex flex-col items-center justify-center p-16 gap-2 text-muted-foreground">
              <Loader2 className="size-6 animate-spin text-primary" />
              <p className="text-xs">Loading notes...</p>
            </div>
          ) : filteredNotes.length === 0 ? (
            <EmptyState
              type={
                searchQuery || selectedTags.length > 0
                  ? "no-results"
                  : currentView === "pinned"
                  ? "no-pinned"
                  : currentView === "archived"
                  ? "no-archived"
                  : currentView === "summarized"
                  ? "no-summarized"
                  : "no-notes"
              }
              onCreateClick={() => setIsCreateOpen(true)}
              onClearFilters={() => {
                setSearchQuery("")
                setSelectedTags([])
                setCurrentView("all")
              }}
            />
          ) : currentView === "all" && pinnedNotesList.length > 0 ? (
            <div className="space-y-6">
              {/* Pinned Section */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-medium text-amber-500 uppercase tracking-wider">
                  <Pin className="size-3 fill-amber-500" />
                  <span>Pinned ({pinnedNotesList.length})</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                  {pinnedNotesList.map((note) => (
                    <NoteCard
                      key={note._id}
                      note={note}
                      onEdit={handleOpenEdit}
                      onDelete={handleDeleteNote}
                      onTogglePin={handleTogglePin}
                      onToggleArchive={handleToggleArchive}
                      onViewDetails={handleOpenView}
                      onTagClick={handleTagToggle}
                    />
                  ))}
                </div>
              </div>

              {/* Other Notes */}
              {regularNotesList.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    <FileText className="size-3" />
                    <span>Other Notes ({regularNotesList.length})</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                    {regularNotesList.map((note) => (
                      <NoteCard
                        key={note._id}
                        note={note}
                        onEdit={handleOpenEdit}
                        onDelete={handleDeleteNote}
                        onTogglePin={handleTogglePin}
                        onToggleArchive={handleToggleArchive}
                        onViewDetails={handleOpenView}
                        onTagClick={handleTagToggle}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {filteredNotes.map((note) => (
                <NoteCard
                  key={note._id}
                  note={note}
                  onEdit={handleOpenEdit}
                  onDelete={handleDeleteNote}
                  onTogglePin={handleTogglePin}
                  onToggleArchive={handleToggleArchive}
                  onViewDetails={handleOpenView}
                  onTagClick={handleTagToggle}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Dialogs */}
      <CreateNoteDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onNoteCreated={handleNoteCreated}
        existingTags={allTagsWithCounts.map((t) => t.name)}
      />

      <EditNoteDialog
        note={editingNote}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        onNoteUpdated={handleNoteUpdated}
      />

      <NoteDetailsDialog
        note={viewingNote}
        open={isViewOpen}
        onOpenChange={setIsViewOpen}
        onEdit={handleOpenEdit}
        onDelete={handleDeleteNote}
        onTogglePin={handleTogglePin}
        onToggleArchive={handleToggleArchive}
      />
    </div>
  )
}
