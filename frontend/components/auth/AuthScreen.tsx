"use client"

import React, { useState } from "react"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
  Sparkles,
  Lock,
  Mail,
  User as UserIcon,
  Eye,
  EyeOff,
  BookOpen,
  Pin,
  Tag,
  Loader2,
  ArrowRight,
} from "lucide-react"

export function AuthScreen() {
  const { login, signUp } = useAuth()
  const [mode, setMode] = useState<"login" | "signup">("login")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (mode === "login") {
        await login(email, password)
      } else {
        if (!name.trim()) {
          throw new Error("Name is required")
        }
        if (password.length < 6) {
          throw new Error("Password must be at least 6 characters")
        }
        await signUp(name.trim(), email.trim(), password)
      }
    } catch (err: any) {
      setError(err.message || "Authentication failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex-1 w-full flex items-center justify-center p-4 md:p-8 bg-background text-foreground relative">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-12 gap-6 border border-border p-6 md:p-8 bg-card">
        {/* Left Column: Brand & Info */}
        <div className="md:col-span-6 flex flex-col justify-between gap-6 border-b md:border-b-0 md:border-r border-border pb-6 md:pb-0 md:pr-6">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-2 py-0.5 border border-border text-[11px] font-medium tracking-wide uppercase text-muted-foreground">
              <Sparkles className="size-3 text-primary" />
              House of EdTech
            </div>

            <h1 className="font-heading text-2xl md:text-3xl font-medium tracking-tight text-foreground">
              Notes & AI Summarization
            </h1>

            <p className="text-xs text-muted-foreground leading-relaxed">
              Create structured notes, filter with dynamic tags, pin key
              insights, and generate concise summaries using Groq AI.
            </p>
          </div>

          <div className="space-y-3 pt-4">
            <div className="flex items-start gap-3 border border-border p-2.5 bg-muted/20">
              <Sparkles className="size-4 text-primary shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-medium text-foreground">
                  AI Summaries
                </h4>
                <p className="text-[11px] text-muted-foreground">
                  Generate key points & summaries in seconds
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 border border-border p-2.5 bg-muted/20">
              <Pin className="size-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-medium text-foreground">
                  Pin & Archive
                </h4>
                <p className="text-[11px] text-muted-foreground">
                  Prioritize important notes and archive clutter
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 border border-border p-2.5 bg-muted/20">
              <Tag className="size-4 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-medium text-foreground">
                  Tags & Filtering
                </h4>
                <p className="text-[11px] text-muted-foreground">
                  Organize by topics and search instantly
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Auth Form */}
        <div className="md:col-span-6 flex flex-col justify-center">
          {/* Mode Switcher */}
          <div className="flex border border-border mb-6">
            <Button
              type="button"
              variant={mode === "login" ? "default" : "ghost"}
              onClick={() => {
                setMode("login")
                setError(null)
              }}
              className="flex-1 rounded-none h-8 text-xs font-medium"
            >
              Sign In
            </Button>
            <Button
              type="button"
              variant={mode === "signup" ? "default" : "ghost"}
              onClick={() => {
                setMode("signup")
                setError(null)
              }}
              className="flex-1 rounded-none h-8 text-xs font-medium"
            >
              Sign Up
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <FieldError className="p-2 border border-destructive/30 bg-destructive/10 text-destructive text-xs">
                {error}
              </FieldError>
            )}

            <FieldGroup className="gap-3.5">
              {mode === "signup" && (
                <Field>
                  <FieldLabel htmlFor="name">Full Name</FieldLabel>
                  <InputGroup>
                    <InputGroupAddon align="inline-start">
                      <UserIcon className="size-3.5" />
                    </InputGroupAddon>
                    <InputGroupInput
                      id="name"
                      type="text"
                      placeholder="Alex Morgan"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required={mode === "signup"}
                    />
                  </InputGroup>
                </Field>
              )}

              <Field>
                <FieldLabel htmlFor="email">Email Address</FieldLabel>
                <InputGroup>
                  <InputGroupAddon align="inline-start">
                    <Mail className="size-3.5" />
                  </InputGroupAddon>
                  <InputGroupInput
                    id="email"
                    type="email"
                    placeholder="alex@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </InputGroup>
              </Field>

              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <InputGroup>
                  <InputGroupAddon align="inline-start">
                    <Lock className="size-3.5" />
                  </InputGroupAddon>
                  <InputGroupInput
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                  <InputGroupAddon align="inline-end">
                    <InputGroupButton
                      size="icon-xs"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="size-3.5" />
                      ) : (
                        <Eye className="size-3.5" />
                      )}
                    </InputGroupButton>
                  </InputGroupAddon>
                </InputGroup>
                {mode === "signup" && (
                  <FieldDescription>
                    Must be at least 6 characters
                  </FieldDescription>
                )}
              </Field>
            </FieldGroup>

            <div className="pt-2 flex flex-col gap-3">
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-8 rounded-none text-xs font-medium"
              >
                {loading ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin mr-1.5" />
                    {mode === "login" ? "Signing In..." : "Creating Account..."}
                  </>
                ) : (
                  <>
                    {mode === "login" ? "Sign In" : "Create Account"}
                    <ArrowRight className="size-3.5 ml-1.5" />
                  </>
                )}
              </Button>

              <p className="text-[11px] text-center text-muted-foreground">
                {mode === "login" ? (
                  <>
                    Don&apos;t have an account?{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setMode("signup")
                        setError(null)
                      }}
                      className="text-primary underline underline-offset-2"
                    >
                      Sign up
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setMode("login")
                        setError(null)
                      }}
                      className="text-primary underline underline-offset-2"
                    >
                      Sign in
                    </button>
                  </>
                )}
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
