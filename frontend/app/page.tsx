"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { AuthScreen } from "@/components/auth/AuthScreen";
import { NotesDashboard } from "@/components/notes/NotesDashboard";
import { Sparkles, Loader2 } from "lucide-react";

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-zinc-950 text-zinc-100 gap-4">
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-2xl shadow-blue-500/30 animate-pulse">
            <Sparkles className="w-8 h-8" />
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-zinc-400 font-medium">
          <Loader2 className="w-4 h-4 animate-spin text-primary" />
          <span>Loading House of EdTech Notes...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthScreen />;
  }

  return <NotesDashboard />;
}
