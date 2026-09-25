"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from "@/components/ui/empty"
import { FileText, Plus, Search, Sparkles } from "lucide-react"

interface EmptyStateProps {
  type: "no-notes" | "no-results" | "no-pinned" | "no-archived" | "no-summarized"
  onCreateClick?: () => void
  onClearFilters?: () => void
}

export function EmptyState({
  type,
  onCreateClick,
  onClearFilters,
}: EmptyStateProps) {
  if (type === "no-results") {
    return (
      <Empty className="border border-border bg-card/50 py-12">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Search />
          </EmptyMedia>
          <EmptyTitle>No matching notes found</EmptyTitle>
          <EmptyDescription>
            Try adjusting your search query, clearing tag filters, or selecting
            another view.
          </EmptyDescription>
        </EmptyHeader>
        {onClearFilters && (
          <EmptyContent>
            <Button
              variant="outline"
              size="xs"
              onClick={onClearFilters}
              className="rounded-none"
            >
              Clear Search & Filters
            </Button>
          </EmptyContent>
        )}
      </Empty>
    )
  }

  if (type === "no-pinned") {
    return (
      <Empty className="border border-border bg-card/50 py-12">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <FileText />
          </EmptyMedia>
          <EmptyTitle>No pinned notes</EmptyTitle>
          <EmptyDescription>
            Click the pin icon on any note to pin important notes to the top.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  if (type === "no-archived") {
    return (
      <Empty className="border border-border bg-card/50 py-12">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <FileText />
          </EmptyMedia>
          <EmptyTitle>No archived notes</EmptyTitle>
          <EmptyDescription>
            Archived notes will be stored here to keep your main workspace clean.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  if (type === "no-summarized") {
    return (
      <Empty className="border border-border bg-card/50 py-12">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Sparkles />
          </EmptyMedia>
          <EmptyTitle>No AI summarized notes</EmptyTitle>
          <EmptyDescription>
            Use the ✨ Generate Summary button when creating notes to synthesize
            content with Groq AI.
          </EmptyDescription>
        </EmptyHeader>
        {onCreateClick && (
          <EmptyContent>
            <Button
              size="xs"
              onClick={onCreateClick}
              className="rounded-none gap-1"
            >
              <Plus className="size-3" /> Create AI Note
            </Button>
          </EmptyContent>
        )}
      </Empty>
    )
  }

  return (
    <Empty className="border border-border bg-card/50 py-12">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FileText />
        </EmptyMedia>
        <EmptyTitle>No notes created yet</EmptyTitle>
        <EmptyDescription>
          Capture notes, organize with tags, and generate instant AI summaries.
        </EmptyDescription>
      </EmptyHeader>
      {onCreateClick && (
        <EmptyContent>
          <Button
            size="xs"
            onClick={onCreateClick}
            className="rounded-none gap-1"
          >
            <Plus className="size-3" /> Create Note
          </Button>
        </EmptyContent>
      )}
    </Empty>
  )
}
