import React from "react"
import { Navigate } from "react-router-dom"
import { useAuth } from "../context/useAuth"
import Loader from "./Loader"
import NotAuthorized from "./NotAuthorized"

/**
 * Two gates, not one. Being signed in is not the same as being an admin:
 * customer accounts authenticate against the same /auth/login and were, until
 * this gate existed, dropped straight onto the dashboard.
 *
 * The backend still scopes what each token may read - this is the UI half of
 * that, not a replacement for it.
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth()

  if (loading) {
    return <Loader />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (!isAdmin) {
    return <NotAuthorized />
  }

  return children
}

export default ProtectedRoute
