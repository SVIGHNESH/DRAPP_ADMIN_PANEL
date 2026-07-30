import React, { useState } from "react"
import { Link } from "react-router-dom"
import { ArrowLeft, Loader2 } from "lucide-react"
import toast from "react-hot-toast"

import { forgotPassword } from "../api/auth"
import { getErrorMessage } from "../utils/apiError"
import AuthLayout from "../components/AuthLayout"
import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

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
    <AuthLayout title="Reset password" description="Enter your email to receive a reset link">
      {sent ? (
        <div className="flex flex-col gap-4">
          <p className="text-sm text-fg-secondary">
            If an account with that email exists, a reset link has been sent.
          </p>
          <Button asChild variant="outline" className="w-full">
            <Link to="/login">
              <ArrowLeft /> Back to login
            </Link>
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
              autoFocus
            />
          </Field>

          <Button type="submit" disabled={submitting} className="mt-1 w-full">
            {submitting && <Loader2 className="animate-spin" />}
            {submitting ? "Sending..." : "Send reset link"}
          </Button>

          <Link
            to="/login"
            className="inline-flex items-center justify-center gap-1 rounded-xs text-xs text-fg-muted outline-none hover:text-fg focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ArrowLeft size={13} /> Back to login
          </Link>
        </form>
      )}
    </AuthLayout>
  )
}

export default ForgotPassword
