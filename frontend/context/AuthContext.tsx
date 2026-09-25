"use client"

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react"
import { api } from "@/lib/api"
import type { User } from "@/types"

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<User>
  signUp: (name: string, email: string, password: string) => Promise<User>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const verifySession = useCallback(async () => {
    try {
      const data = await api.auth.getMe()
      setUser(data.user)
    } catch (error) {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    verifySession()
  }, [verifySession])

  const login = async (email: string, password: string): Promise<User> => {
    try {
      const data = await api.auth.login(email, password)
      setUser(data.user)
      return data.user
    } catch (error) {
      console.error("Login failed:", error)
      throw error
    }
  }

  const signUp = async (
    name: string,
    email: string,
    password: string
  ): Promise<User> => {
    try {
      await api.auth.register(name, email, password)
      // Automatically login after successful registration
      return await login(email, password)
    } catch (error) {
      console.error("Sign up failed:", error)
      throw error
    }
  }

  const logout = async () => {
    try {
      await api.auth.logout()
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      setUser(null)
    }
  }

  const refreshUser = async () => {
    await verifySession()
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signUp,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
