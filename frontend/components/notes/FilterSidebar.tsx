"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  FileText,
  Pin,
  Archive,
  Sparkles,
  Tag as TagIcon,
  X,
} from "lucide-react"

export type ViewTab = "all" | "pinned" | "archived" | "summarized"

interface FilterSidebarProps {
  currentView: ViewTab
  onViewChange: (view: ViewTab) => void
  allTags: { name: string; count: number }[]
  selectedTags: string[]
  onTagToggle: (tag: string) => void
  onClearTags: () => void
  counts: {
    all: number
    pinned: number
    archived: number
    summarized: number
  }
}

export function FilterSidebar({
  currentView,
  onViewChange,
  allTags,
  selectedTags,
  onTagToggle,
  onClearTags,
  counts,
}: FilterSidebarProps) {
  return (
    <aside className="w-full lg:w-56 flex flex-col gap-5 p-3.5 border border-border bg-card">
      {/* Navigation Views */}
      <div className="space-y-1">
        <div className="px-2 py-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          Views
        </div>

        <button
          type="button"
          onClick={() => onViewChange("all")}
          className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs font-medium border transition-colors ${
            currentView === "all"
              ? "bg-primary text-primary-foreground border-primary"
              : "border-transparent text-muted-foreground hover:bg-muted/50 hover:text-foreground"
          }`}
        >
          <div className="flex items-center gap-2">
            <FileText className="size-3.5" />
            <span>All Notes</span>
          </div>
          <span className="text-[10px] opacity-80">{counts.all}</span>
        </button>

        <button
          type="button"
          onClick={() => onViewChange("pinned")}
          className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs font-medium border transition-colors ${
            currentView === "pinned"
              ? "bg-amber-500/10 text-amber-500 border-amber-500/30"
              : "border-transparent text-muted-foreground hover:bg-muted/50 hover:text-foreground"
          }`}
        >
          <div className="flex items-center gap-2">
            <Pin className="size-3.5 text-amber-500" />
            <span>Pinned</span>
          </div>
          <span className="text-[10px] opacity-80">{counts.pinned}</span>
        </button>

        <button
          type="button"
          onClick={() => onViewChange("summarized")}
          className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs font-medium border transition-colors ${
            currentView === "summarized"
              ? "bg-purple-500/10 text-purple-400 border-purple-500/30"
              : "border-transparent text-muted-foreground hover:bg-muted/50 hover:text-foreground"
          }`}
        >
          <div className="flex items-center gap-2">
            <Sparkles className="size-3.5 text-purple-400" />
            <span>AI Summaries</span>
          </div>
          <span className="text-[10px] opacity-80">{counts.summarized}</span>
        </button>

        <button
          type="button"
          onClick={() => onViewChange("archived")}
          className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs font-medium border transition-colors ${
            currentView === "archived"
              ? "bg-muted text-foreground border-border"
              : "border-transparent text-muted-foreground hover:bg-muted/50 hover:text-foreground"
          }`}
        >
          <div className="flex items-center gap-2">
            <Archive className="size-3.5" />
            <span>Archived</span>
          </div>
          <span className="text-[10px] opacity-80">{counts.archived}</span>
        </button>
      </div>

      {/* Tags Section */}
      <div className="space-y-2 pt-3 border-t border-border">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            <TagIcon className="size-3" />
            <span>Tags</span>
          </div>
          {selectedTags.length > 0 && (
            <button
              type="button"
              onClick={onClearTags}
              className="text-[10px] text-muted-foreground hover:text-foreground"
            >
              Clear
            </button>
          )}
        </div>

        {allTags.length === 0 ? (
          <p className="px-2 text-[11px] text-muted-foreground">
            No tags created yet.
          </p>
        ) : (
          <div className="flex flex-wrap gap-1 px-1">
            {allTags.map((tag) => {
              const isSelected = selectedTags.includes(tag.name)
              return (
                <button
                  key={tag.name}
                  type="button"
                  onClick={() => onTagToggle(tag.name)}
                  className={`inline-flex items-center gap-1 border px-2 py-0.5 text-xs font-medium transition-colors ${
                    isSelected
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border bg-card text-muted-foreground hover:border-input hover:text-foreground"
                  }`}
                >
                  <span>#{tag.name}</span>
                  <span className="text-[10px] opacity-70">{tag.count}</span>
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Selected Tags Indicator */}
      {selectedTags.length > 0 && (
        <div className="p-2 border border-border bg-muted/20 text-xs flex items-center justify-between">
          <span className="text-[11px] text-muted-foreground">
            Filtered by {selectedTags.length} tag{selectedTags.length > 1 ? "s" : ""}
          </span>
          <Button
            variant="ghost"
            size="xs"
            onClick={onClearTags}
            className="h-5 px-1.5 text-[10px]"
          >
            Reset
          </Button>
        </div>
      )}
    </aside>
  )
}
