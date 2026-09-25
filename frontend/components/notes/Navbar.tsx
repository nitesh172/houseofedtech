"use client"

import React from "react"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupButton,
} from "@/components/ui/input-group"
import {
  Sparkles,
  Search,
  Plus,
  LogOut,
  StickyNote,
  X,
} from "lucide-react"

interface NavbarProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  onCreateClick: () => void
}

export function Navbar({
  searchQuery,
  onSearchChange,
  onCreateClick,
}: NavbarProps) {
  const { user, logout } = useAuth()

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-12 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="size-6 border border-border flex items-center justify-center bg-primary text-primary-foreground">
            <StickyNote className="size-3.5" />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-heading text-sm font-medium tracking-tight text-foreground">
              House of EdTech
            </span>
            <span className="hidden sm:inline-block border border-border px-1.5 py-0.2 text-[10px] text-muted-foreground uppercase font-medium">
              Notes
            </span>
          </div>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-sm">
          <InputGroup>
            <InputGroupAddon align="inline-start">
              <Search className="size-3.5" />
            </InputGroupAddon>
            <InputGroupInput
              placeholder="Search notes, tags, summaries..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            {searchQuery && (
              <InputGroupAddon align="inline-end">
                <InputGroupButton
                  size="icon-xs"
                  onClick={() => onSearchChange("")}
                >
                  <X className="size-3" />
                </InputGroupButton>
              </InputGroupAddon>
            )}
          </InputGroup>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <Button
            size="sm"
            onClick={onCreateClick}
            className="h-7 px-2.5 text-xs font-medium rounded-none"
          >
            <Plus className="size-3.5 mr-1" />
            <span>Create Note</span>
          </Button>

          <div className="h-4 w-px bg-border mx-1" />

          {/* User & Logout */}
          <div className="flex items-center gap-2">
            <span className="hidden md:inline-block text-xs text-muted-foreground max-w-[120px] truncate">
              {user?.name || user?.email}
            </span>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={logout}
              title="Sign Out"
              className="rounded-none text-muted-foreground hover:text-foreground"
            >
              <LogOut className="size-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
