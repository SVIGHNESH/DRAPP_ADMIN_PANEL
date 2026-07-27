import React, { useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { Heart, Eye, EyeOff, Loader, ArrowLeft } from "lucide-react"
import { resetPassword } from "../api/auth"
import { getErrorMessage } from "../utils/apiError"
import toast from "react-hot-toast"

const ResetPassword = () => {
  const [searchParams] = useSearchParams()
  const token = searchParams.get("token") || ""
  const [newPassword, setNewPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!token) {
      toast.error("Missing reset token")
      return
    }
    if (!newPassword || newPassword.length < 8) {
      toast.error("Password must be at least 8 characters")
      return
    }
    setSubmitting(true)
    try {
      await resetPassword(token, newPassword)
      setDone(true)
      toast.success("Password reset successfully")
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4">
        <div className="card w-full max-w-md p-8 text-center">
          <h1 className="text-2xl font-bold text-dark-100 mb-4">Invalid Link</h1>
          <p className="text-dark-500 mb-6">This reset link is missing or invalid.</p>
          <Link to="/forgot-password" className="btn-primary inline-flex items-center gap-2">
            Request a new link
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4">
      <div className="card w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-accent-cyan to-accent-teal rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Heart className="text-dark-900" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-dark-100">Set New Password</h1>
          <p className="text-dark-500 mt-1">Enter your new password below</p>
        </div>

        {done ? (
          <div className="text-center space-y-4">
            <p className="text-dark-300">Your password has been reset.</p>
            <Link to="/login" className="btn-primary inline-flex items-center gap-2">
              <ArrowLeft size={16} /> Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-dark-500 mb-2">New Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className="input-field pr-10"
                  required
                  minLength={8}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-500"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={submitting} className="btn-primary w-full flex items-center justify-center gap-2">
              {submitting ? <Loader size={18} className="animate-spin" /> : null}
              {submitting ? "Resetting..." : "Reset Password"}
            </button>
            <div className="text-center">
              <Link to="/login" className="text-sm text-accent-cyan hover:underline inline-flex items-center gap-1">
                <ArrowLeft size={14} /> Back to Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default ResetPassword
