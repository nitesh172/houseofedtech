import { API_URL } from "./config"
import type {
  User,
  Note,
  CreateNoteInput,
  UpdateNoteInput,
  NoteFilters,
  AISummaryResponse,
} from "@/types"

export class ApiError extends Error {
  status: number
  data?: any

  constructor(message: string, status: number = 500, data?: any) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.data = data
    Object.setPrototypeOf(this, ApiError.prototype)
  }
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  }

  let response: Response
  try {
    response = await fetch(url, {
      ...options,
      headers,
      credentials: "include",
    })
  } catch (networkError: any) {
    console.warn("Network request error:", networkError)
    throw new ApiError(
      "Unable to reach the server. Please check if the backend server is running.",
      0
    )
  }

  if (!response.ok) {
    let errorMessage = `Request failed (${response.status})`
    let errorData: any = null

    try {
      const text = await response.text()
      if (text) {
        try {
          errorData = JSON.parse(text)
          if (errorData?.message) {
            errorMessage = errorData.message
          } else if (errorData?.error) {
            errorMessage = errorData.error
          } else if (typeof errorData === "string") {
            errorMessage = errorData
          }
        } catch {
          errorMessage = text
        }
      }
    } catch {
      // Fallback to generic status message
    }

    throw new ApiError(errorMessage, response.status, errorData)
  }

  // Parse response
  const contentType = response.headers.get("content-type")
  if (contentType && contentType.includes("application/json")) {
    try {
      return await response.json()
    } catch {
      return {} as T
    }
  }

  const rawText = await response.text()
  return rawText as unknown as T
}

export const api = {
  // Auth endpoints
  auth: {
    async login(email: string, password: string): Promise<{ user: User }> {
      return request<{ user: User }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      })
    },

    async register(
      name: string,
      email: string,
      password: string
    ): Promise<{ user?: User; message?: string }> {
      return request<{ user?: User; message?: string }>("/auth/signup", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
      })
    },

    async logout(): Promise<{ message: string }> {
      try {
        return await request<{ message: string }>("/auth/logout", {
          method: "POST",
        })
      } catch {
        return { message: "Logged out" }
      }
    },

    async getMe(): Promise<{ user: User | null }> {
      try {
        const res = await request<{ user: User }>("/auth/me", {
          method: "GET",
        })
        return res
      } catch (err: any) {
        // If 401 Unauthorized or 403 Forbidden, user simply has no active session
        if (err?.status === 401 || err?.status === 403 || err?.status === 0) {
          return { user: null }
        }
        return { user: null }
      }
    },
  },

  // Notes endpoints
  notes: {
    async getNotes(filters?: NoteFilters): Promise<Note[]> {
      const params = new URLSearchParams()
      if (filters?.tags && filters.tags.length > 0) {
        params.append("tags", filters.tags.join(","))
      }
      if (typeof filters?.isPinned === "boolean") {
        params.append("isPinned", String(filters.isPinned))
      }
      if (typeof filters?.isArchived === "boolean") {
        params.append("isArchived", String(filters.isArchived))
      }

      const queryString = params.toString()
      const endpoint = `/notes${queryString ? `?${queryString}` : ""}`
      return request<Note[]>(endpoint, { method: "GET" })
    },

    async getNote(id: string): Promise<Note> {
      return request<Note>(`/notes/${id}`, { method: "GET" })
    },

    async createNote(data: CreateNoteInput): Promise<Note> {
      return request<Note>("/notes", {
        method: "POST",
        body: JSON.stringify(data),
      })
    },

    async updateNote(id: string, data: UpdateNoteInput): Promise<Note> {
      return request<Note>(`/notes/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      })
    },

    async deleteNote(id: string): Promise<{ message: string }> {
      return request<{ message: string }>(`/notes/${id}`, {
        method: "DELETE",
      })
    },
  },

  // AI Agent endpoint
  agent: {
    async generateSummary(prompt: string): Promise<AISummaryResponse> {
      const raw = await request<any>("/agent/generate", {
        method: "POST",
        body: JSON.stringify({ prompt }),
      })

      if (typeof raw === "string") {
        try {
          let jsonStr = raw.trim()
          if (jsonStr.startsWith("```json")) {
            jsonStr = jsonStr.replace(/^```json\s*/, "").replace(/\s*```$/, "")
          } else if (jsonStr.startsWith("```")) {
            jsonStr = jsonStr.replace(/^```\s*/, "").replace(/\s*```$/, "")
          }

          const parsed = JSON.parse(jsonStr)
          if (parsed && typeof parsed === "object") {
            return {
              summary: parsed.summary || jsonStr,
              keyPoints: Array.isArray(parsed.keyPoints)
                ? parsed.keyPoints
                : undefined,
            }
          }
        } catch {
          return { summary: raw }
        }
      } else if (raw && typeof raw === "object") {
        return {
          summary: raw.summary || JSON.stringify(raw),
          keyPoints: Array.isArray(raw.keyPoints) ? raw.keyPoints : undefined,
        }
      }

      return { summary: String(raw || "") }
    },
  },
}
