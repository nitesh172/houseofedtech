"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
  Calendar,
  Copy,
  Check,
  Edit3,
  Trash2,
  Archive,
} from "lucide-react"
import type { Note } from "@/types"

interface NoteDetailsDialogProps {
  note: Note | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onEdit: (note: Note) => void
  onDelete: (id: string) => void
  onTogglePin: (note: Note) => void
  onToggleArchive: (note: Note) => void
}

export function NoteDetailsDialog({
  note,
  open,
  onOpenChange,
  onEdit,
  onDelete,
  onTogglePin,
  onToggleArchive,
}: NoteDetailsDialogProps) {
  const [copied, setCopied] = useState(false)

  if (!note) return null

  const handleCopy = () => {
    const textToCopy = `${note.title}\n\n${note.summary ? `Summary:\n${note.summary}\n\n` : ""}Content:\n${note.content}`
    navigator.clipboard.writeText(textToCopy)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const formattedDate = new Date(note.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            {note.isPinned && (
              <Badge variant="amber" size="sm" className="gap-1">
                <Pin className="size-2.5 fill-current" /> Pinned
              </Badge>
            )}
            {note.isArchived && (
              <Badge variant="secondary" size="sm" className="gap-1">
                <Archive className="size-2.5" /> Archived
              </Badge>
            )}
            {note.summary && (
              <Badge variant="purple" size="sm" className="gap-1">
                <Sparkles className="size-2.5" /> AI Summary
              </Badge>
            )}

            <div className="ml-auto flex items-center gap-1 text-[11px] text-muted-foreground">
              <Calendar className="size-3" />
              <span>{formattedDate}</span>
            </div>
          </div>

          <DialogTitle className="text-base font-medium text-foreground">
            {note.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-1">
          {/* Tags */}
          {note.tags && note.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 items-center">
              <Tag className="size-3 text-muted-foreground" />
              {note.tags.map((tag) => (
                <Badge key={tag} variant="outline" size="sm">
                  #{tag}
                </Badge>
              ))}
            </div>
          )}

          {/* AI Summary */}
          {note.summary && (
            <div className="p-3 border border-border bg-muted/20 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-medium text-foreground">
                <Sparkles className="size-3 text-primary" /> AI Summary & Insights
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {note.summary}
              </p>
            </div>
          )}

          {/* Full Content */}
          <div className="space-y-1">
            <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
              Content
            </span>
            <div className="p-3 border border-border bg-card text-xs text-foreground leading-relaxed whitespace-pre-wrap">
              {note.content}
            </div>
          </div>
        </div>

        <DialogFooter className="pt-3 border-t border-border flex items-center justify-between sm:justify-between">
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="xs"
              onClick={handleCopy}
              className="rounded-none gap-1"
            >
              {copied ? (
                <>
                  <Check className="size-3 text-emerald-500" /> Copied
                </>
              ) : (
                <>
                  <Copy className="size-3" /> Copy
                </>
              )}
            </Button>

            <Button
              variant="destructive"
              size="xs"
              onClick={() => {
                onDelete(note._id)
                onOpenChange(false)
              }}
              className="rounded-none gap-1"
            >
              <Trash2 className="size-3" /> Delete
            </Button>
          </div>

          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="xs"
              onClick={() => onTogglePin(note)}
              className="rounded-none gap-1"
            >
              <Pin className="size-3" />
              {note.isPinned ? "Unpin" : "Pin"}
            </Button>

            <Button
              variant="outline"
              size="xs"
              onClick={() => onToggleArchive(note)}
              className="rounded-none gap-1"
            >
              <Archive className="size-3" />
              {note.isArchived ? "Unarchive" : "Archive"}
            </Button>

            <Button
              size="xs"
              onClick={() => {
                onOpenChange(false)
                onEdit(note)
              }}
              className="rounded-none gap-1"
            >
              <Edit3 className="size-3" /> Edit
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
