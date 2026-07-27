import React, { createContext, useContext, useState, useEffect, useCallback } from "react"
import { login as apiLogin, getMe } from "../api/auth"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem("token"))

  const [loading, setLoading] = useState(() => !!localStorage.getItem("token"))

  const isAuthenticated = !!user
  const isAdmin = user?.role === "admin"

  const clearSession = useCallback(() => {
    localStorage.removeItem("token")
    setToken(null)
    setUser(null)
  }, [])

  useEffect(() => {
    if (!token) {
      setLoading(false)
      return
    }

    getMe()
      .then((res) => {
        setUser(res.data)
      })
      .catch(() => {
        clearSession()
      })
      .finally(() => {
        setLoading(false)
      })
  }, [token, clearSession])

  useEffect(() => {
    const handler = () => {
      clearSession()
    }
    window.addEventListener("auth:session-expired", handler)
    return () => window.removeEventListener("auth:session-expired", handler)
  }, [clearSession])

  const login = async (email, password) => {
    const res = await apiLogin({ email, password })
    const t = res.data.access_token
    localStorage.setItem("token", t)
    setToken(t)
    const me = await getMe()
    setUser(me.data)
    return me.data
  }

  const logout = () => {
    clearSession()
  }

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, isAdmin, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider")
  return ctx
}
