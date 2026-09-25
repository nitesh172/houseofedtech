"use client"

import React, { useState, useEffect } from "react"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupButton,
} from "@/components/ui/input-group"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Sparkles,
  Pin,
  Tag,
  Plus,
  X,
  Loader2,
  Check,
  Archive,
  Edit3,
} from "lucide-react"
import type { Note, AISummaryResponse } from "@/types"

interface EditNoteDialogProps {
  note: Note | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onNoteUpdated: (updatedNote: Note) => void
}

export function EditNoteDialog({
  note,
  open,
  onOpenChange,
  onNoteUpdated,
}: EditNoteDialogProps) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [summary, setSummary] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [isPinned, setIsPinned] = useState(false)
  const [isArchived, setIsArchived] = useState(false)

  const [saving, setSaving] = useState(false)
  const [generatingAI, setGeneratingAI] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [aiSuccess, setAiSuccess] = useState(false)

  useEffect(() => {
    if (note) {
      setTitle(note.title || "")
      setContent(note.content || "")
      setSummary(note.summary || "")
      setTags(note.tags || [])
      setIsPinned(Boolean(note.isPinned))
      setIsArchived(Boolean(note.isArchived))
      setError(null)
      setAiSuccess(false)
    }
  }, [note])

  if (!note) return null

  const handleAddTag = () => {
    const cleanTag = tagInput.trim().toLowerCase().replace(/^#/, "")
    if (cleanTag && !tags.includes(cleanTag)) {
      setTags([...tags, cleanTag])
      setTagInput("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove))
  }

  const handleGenerateSummary = async () => {
    if (!content.trim()) {
      setError("Please write some content first before generating an AI summary.")
      return
    }

    setError(null)
    setGeneratingAI(true)
    setAiSuccess(false)

    try {
      const result: AISummaryResponse = await api.agent.generateSummary(content)
      setSummary(result.summary)
      setAiSuccess(true)
    } catch (err: any) {
      setError(err.message || "Failed to generate AI summary.")
    } finally {
      setGeneratingAI(false)
    }
  }

  const handleSaveNote = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      setError("Note title is required.")
      return
    }
    if (!content.trim()) {
      setError("Note content is required.")
      return
    }

    setError(null)
    setSaving(true)

    try {
      const updated = await api.notes.updateNote(note._id, {
        title: title.trim(),
        content: content.trim(),
        summary: summary.trim() || undefined,
        tags,
        isPinned,
        isArchived,
      })

      onNoteUpdated(updated)
      onOpenChange(false)
    } catch (err: any) {
      setError(err.message || "Failed to update note.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Edit3 className="size-4 text-primary" />
              <DialogTitle>Edit Note</DialogTitle>
            </div>

            <div className="flex items-center gap-1.5">
              <Button
                type="button"
                variant={isPinned ? "default" : "outline"}
                size="xs"
                onClick={() => setIsPinned(!isPinned)}
                className="gap-1 rounded-none text-xs"
              >
                <Pin className={`size-3 ${isPinned ? "fill-current" : ""}`} />
                <span>{isPinned ? "Pinned" : "Pin"}</span>
              </Button>

              <Button
                type="button"
                variant={isArchived ? "secondary" : "outline"}
                size="xs"
                onClick={() => setIsArchived(!isArchived)}
                className="gap-1 rounded-none text-xs"
              >
                <Archive className="size-3" />
                <span>{isArchived ? "Archived" : "Archive"}</span>
              </Button>
            </div>
          </div>
          <DialogDescription>
            Update note content, tags, or regenerate AI summary.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSaveNote} className="space-y-4 pt-2">
          {error && (
            <FieldError className="p-2 border border-destructive/30 bg-destructive/10 text-destructive text-xs">
              {error}
            </FieldError>
          )}

          <FieldGroup className="gap-3.5">
            <Field>
              <FieldLabel htmlFor="edit-title">Title *</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id="edit-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </InputGroup>
            </Field>

            <Field>
              <FieldLabel htmlFor="edit-tag">Tags</FieldLabel>
              <InputGroup>
                <InputGroupAddon align="inline-start">
                  <Tag className="size-3.5" />
                </InputGroupAddon>
                <InputGroupInput
                  id="edit-tag"
                  placeholder="Add tag..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === ",") {
                      e.preventDefault()
                      handleAddTag()
                    }
                  }}
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    size="xs"
                    onClick={handleAddTag}
                    disabled={!tagInput.trim()}
                  >
                    <Plus className="size-3 mr-0.5" /> Add
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>

              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-1.5">
                  {tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="gap-1 rounded-none text-[11px]"
                    >
                      #{tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="opacity-70 hover:opacity-100 hover:text-destructive"
                      >
                        <X className="size-2.5" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </Field>

            <Field>
              <div className="flex items-center justify-between">
                <FieldLabel htmlFor="edit-content">Content *</FieldLabel>
                <span className="text-[11px] text-muted-foreground">
                  {content.length} chars
                </span>
              </div>
              <Textarea
                id="edit-content"
                rows={6}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                className="min-h-28 text-xs leading-relaxed"
              />
            </Field>

            <div className="border border-border p-3.5 space-y-3 bg-muted/20">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="size-3.5 text-primary" />
                  <span className="text-xs font-medium text-foreground">
                    AI Summary & Insights
                  </span>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="xs"
                  onClick={handleGenerateSummary}
                  disabled={generatingAI || !content.trim()}
                  className="rounded-none text-xs gap-1"
                >
                  {generatingAI ? (
                    <>
                      <Loader2 className="size-3 animate-spin" />
                      Regenerating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="size-3" />
                      Regenerate Summary
                    </>
                  )}
                </Button>
              </div>

              {aiSuccess && (
                <p className="text-[11px] text-emerald-500 flex items-center gap-1">
                  <Check className="size-3" /> Summary updated
                </p>
              )}

              <Textarea
                placeholder="AI summary..."
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                rows={2}
                className="min-h-16 text-xs bg-background"
              />
            </div>
          </FieldGroup>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="rounded-none text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={saving || !title.trim() || !content.trim()}
              className="rounded-none text-xs gap-1"
            >
              {saving ? (
                <>
                  <Loader2 className="size-3 animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Check className="size-3" /> Save Changes
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
