import React, { useState } from "react"
import { Link } from "react-router-dom"
import { Heart, ArrowLeft, Loader } from "lucide-react"
import { forgotPassword } from "../api/auth"
import { getErrorMessage } from "../utils/apiError"
import toast from "react-hot-toast"

const ForgotPassword = () => {
  const [email, setEmail] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) return
    setSubmitting(true)
    try {
      await forgotPassword(email)
      setSent(true)
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4">
      <div className="card w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-accent-cyan to-accent-teal rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Heart className="text-dark-900" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-dark-100">Reset Password</h1>
          <p className="text-dark-500 mt-1">Enter your email to receive a reset link</p>
        </div>

        {sent ? (
          <div className="text-center space-y-4">
            <p className="text-dark-300">If an account with that email exists, a reset link has been sent.</p>
            <Link to="/login" className="btn-primary inline-flex items-center gap-2">
              <ArrowLeft size={16} /> Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-dark-500 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="input-field"
                required
                autoFocus
              />
            </div>
            <button type="submit" disabled={submitting} className="btn-primary w-full flex items-center justify-center gap-2">
              {submitting ? <Loader size={18} className="animate-spin" /> : null}
              {submitting ? "Sending..." : "Send Reset Link"}
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

export default ForgotPassword
