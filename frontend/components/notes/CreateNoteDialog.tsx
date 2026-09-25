"use client"

import React, { useState } from "react"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
  FieldDescription,
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
  FileText,
  ListOrdered,
} from "lucide-react"
import type { Note, AISummaryResponse } from "@/types"

interface CreateNoteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onNoteCreated: (newNote: Note) => void
  existingTags?: string[]
}

export function CreateNoteDialog({
  open,
  onOpenChange,
  onNoteCreated,
  existingTags = [],
}: CreateNoteDialogProps) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [summary, setSummary] = useState("")
  const [keyPoints, setKeyPoints] = useState<string[]>([])
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [isPinned, setIsPinned] = useState(false)

  const [saving, setSaving] = useState(false)
  const [generatingAI, setGeneratingAI] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [aiSuccess, setAiSuccess] = useState(false)

  const resetForm = () => {
    setTitle("")
    setContent("")
    setSummary("")
    setKeyPoints([])
    setTags([])
    setTagInput("")
    setIsPinned(false)
    setError(null)
    setAiSuccess(false)
  }

  const handleAddTag = (tagToAdd?: string) => {
    const cleanTag = (tagToAdd || tagInput).trim().toLowerCase().replace(/^#/, "")
    if (cleanTag && !tags.includes(cleanTag)) {
      setTags([...tags, cleanTag])
      setTagInput("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove))
  }

  const handleKeyDownTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      handleAddTag()
    }
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
      if (result.keyPoints && result.keyPoints.length > 0) {
        setKeyPoints(result.keyPoints)
      } else {
        setKeyPoints([])
      }
      setAiSuccess(true)
    } catch (err: any) {
      setError(err.message || "Failed to generate AI summary. Check backend AI configuration.")
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
      const newNote = await api.notes.createNote({
        title: title.trim(),
        content: content.trim(),
        summary: summary.trim() || undefined,
        tags,
        isPinned,
        isArchived: false,
      })

      onNoteCreated(newNote)
      resetForm()
      onOpenChange(false)
    } catch (err: any) {
      setError(err.message || "Failed to create note.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        if (!val) resetForm()
        onOpenChange(val)
      }}
    >
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="size-4 text-primary" />
              <DialogTitle>Create Note</DialogTitle>
            </div>

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
          </div>
          <DialogDescription>
            Write your note, add tags, and generate instant AI summaries.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSaveNote} className="space-y-4 pt-2">
          {error && (
            <FieldError className="p-2 border border-destructive/30 bg-destructive/10 text-destructive text-xs">
              {error}
            </FieldError>
          )}

          <FieldGroup className="gap-3.5">
            {/* Title */}
            <Field>
              <FieldLabel htmlFor="create-title">Title *</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id="create-title"
                  placeholder="e.g. Weekly Research & Ideas"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </InputGroup>
            </Field>

            {/* Tags */}
            <Field>
              <FieldLabel htmlFor="create-tag">Tags</FieldLabel>
              <InputGroup>
                <InputGroupAddon align="inline-start">
                  <Tag className="size-3.5" />
                </InputGroupAddon>
                <InputGroupInput
                  id="create-tag"
                  placeholder="Type tag and press Enter..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleKeyDownTag}
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    size="xs"
                    onClick={() => handleAddTag()}
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

              {existingTags.length > 0 && tags.length < 5 && (
                <FieldDescription className="flex items-center gap-1.5 flex-wrap pt-0.5">
                  <span>Suggestions:</span>
                  {existingTags
                    .filter((t) => !tags.includes(t))
                    .slice(0, 4)
                    .map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => handleAddTag(t)}
                        className="underline text-[11px]"
                      >
                        #{t}
                      </button>
                    ))}
                </FieldDescription>
              )}
            </Field>

            {/* Note Content */}
            <Field>
              <div className="flex items-center justify-between">
                <FieldLabel htmlFor="create-content">Content *</FieldLabel>
                <span className="text-[11px] text-muted-foreground">
                  {content.length} chars
                </span>
              </div>
              <Textarea
                id="create-content"
                rows={6}
                placeholder="Write your note content here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                className="min-h-28 text-xs leading-relaxed"
              />
            </Field>

            {/* AI Summary Section */}
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
                      Summarizing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="size-3" />
                      {summary ? "Regenerate" : "Generate Summary"}
                    </>
                  )}
                </Button>
              </div>

              {aiSuccess && (
                <p className="text-[11px] text-emerald-500 flex items-center gap-1">
                  <Check className="size-3" /> Summary generated
                </p>
              )}

              <Textarea
                placeholder="AI summary will appear here..."
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                rows={2}
                className="min-h-16 text-xs bg-background"
              />

              {keyPoints.length > 0 && (
                <div className="space-y-1 pt-1 border-t border-border">
                  <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1">
                    <ListOrdered className="size-3" /> Key Points:
                  </span>
                  <ul className="list-disc list-inside space-y-0.5 text-[11px] text-foreground">
                    {keyPoints.map((point, i) => (
                      <li key={i}>{point}</li>
                    ))}
                  </ul>
                </div>
              )}
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
                  <Check className="size-3" /> Create Note
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
