import React, { useState, useEffect, useCallback } from "react"
import { login as apiLogin, getMe } from "../api/auth"
import { AuthContext } from "./useAuth"

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

  // Profile edits return the updated UserOut, so the cached copy is replaced
  // outright rather than refetched.
  const updateUser = useCallback((updated) => {
    setUser(updated)
  }, [])

  return (
    <AuthContext.Provider
      value={{ user, token, isAuthenticated, isAdmin, loading, login, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  )
}
