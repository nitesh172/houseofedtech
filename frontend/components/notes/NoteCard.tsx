"use client"

import React, { useState } from "react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Sparkles,
  Pin,
  Calendar,
  Edit3,
  Trash2,
  Archive,
  ChevronDown,
  ChevronUp,
  Maximize2,
} from "lucide-react"
import type { Note } from "@/types"

interface NoteCardProps {
  note: Note
  onEdit: (note: Note) => void
  onDelete: (id: string) => void
  onTogglePin: (note: Note) => void
  onToggleArchive: (note: Note) => void
  onViewDetails: (note: Note) => void
  onTagClick?: (tag: string) => void
}

export function NoteCard({
  note,
  onEdit,
  onDelete,
  onTogglePin,
  onToggleArchive,
  onViewDetails,
  onTagClick,
}: NoteCardProps) {
  const [showFullSummary, setShowFullSummary] = useState(false)

  const formattedDate = new Date(note.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })

  return (
    <Card className="group relative flex flex-col justify-between hover:border-foreground/30 transition-colors">
      <div>
        <CardHeader className="p-3.5 pb-2 space-y-1.5">
          <div className="flex items-center justify-between gap-1.5">
            <div className="flex items-center gap-1 flex-wrap">
              {note.isPinned && (
                <Badge variant="amber" size="sm" className="gap-1">
                  <Pin className="size-2.5 fill-current" /> Pinned
                </Badge>
              )}
              {note.isArchived && (
                <Badge variant="secondary" size="sm">
                  Archived
                </Badge>
              )}
              {note.summary && (
                <Badge variant="purple" size="sm" className="gap-1">
                  <Sparkles className="size-2.5" /> AI
                </Badge>
              )}
            </div>

            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => onTogglePin(note)}
              title={note.isPinned ? "Unpin note" : "Pin note"}
              className="rounded-none text-muted-foreground hover:text-foreground"
            >
              <Pin
                className={`size-3.5 ${
                  note.isPinned ? "fill-amber-500 text-amber-500" : ""
                }`}
              />
            </Button>
          </div>

          <CardTitle
            onClick={() => onViewDetails(note)}
            className="cursor-pointer hover:underline underline-offset-2 line-clamp-2"
          >
            {note.title}
          </CardTitle>
        </CardHeader>

        <CardContent className="p-3.5 pt-1 pb-3 space-y-2.5">
          {/* AI Summary */}
          {note.summary && (
            <div className="p-2.5 border border-border bg-muted/20 space-y-1">
              <div
                onClick={() => setShowFullSummary(!showFullSummary)}
                className="flex items-center justify-between cursor-pointer text-[11px] font-medium text-foreground"
              >
                <div className="flex items-center gap-1">
                  <Sparkles className="size-3 text-primary" />
                  <span>AI Summary</span>
                </div>
                {showFullSummary ? (
                  <ChevronUp className="size-3 text-muted-foreground" />
                ) : (
                  <ChevronDown className="size-3 text-muted-foreground" />
                )}
              </div>
              <p
                className={`text-[11px] text-muted-foreground leading-relaxed ${
                  showFullSummary ? "" : "line-clamp-2"
                }`}
              >
                {note.summary}
              </p>
            </div>
          )}

          {/* Content snippet */}
          <p
            onClick={() => onViewDetails(note)}
            className="text-xs text-muted-foreground line-clamp-3 leading-relaxed cursor-pointer hover:text-foreground transition-colors"
          >
            {note.content}
          </p>

          {/* Tags */}
          {note.tags && note.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-1">
              {note.tags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => onTagClick && onTagClick(tag)}
                  className="border border-border px-1.5 py-0.2 text-[10px] text-muted-foreground hover:border-input hover:text-foreground font-medium transition-colors"
                >
                  #{tag}
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </div>

      <CardFooter className="p-3.5 pt-2 flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-1 text-[11px]">
          <Calendar className="size-3" />
          <span>{formattedDate}</span>
        </div>

        <div className="flex items-center gap-0.5">
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => onViewDetails(note)}
            title="Read note"
            className="rounded-none text-muted-foreground hover:text-foreground"
          >
            <Maximize2 className="size-3" />
          </Button>

          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => onToggleArchive(note)}
            title={note.isArchived ? "Unarchive" : "Archive"}
            className="rounded-none text-muted-foreground hover:text-foreground"
          >
            <Archive className="size-3" />
          </Button>

          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => onEdit(note)}
            title="Edit note"
            className="rounded-none text-muted-foreground hover:text-foreground"
          >
            <Edit3 className="size-3" />
          </Button>

          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => onDelete(note._id)}
            title="Delete note"
            className="rounded-none text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="size-3" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
