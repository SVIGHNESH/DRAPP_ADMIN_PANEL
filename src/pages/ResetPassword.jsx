import React, { useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { ArrowLeft, Loader2 } from "lucide-react"
import toast from "react-hot-toast"

import { resetPassword } from "../api/auth"
import { getErrorMessage } from "../utils/apiError"
import AuthLayout from "../components/AuthLayout"
import PasswordInput from "../components/PasswordInput"
import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"

const ResetPassword = () => {
  const [searchParams] = useSearchParams()
  const token = searchParams.get("token") || ""
  const [newPassword, setNewPassword] = useState("")
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
      <AuthLayout title="Invalid link" description="This reset link is missing or invalid.">
        <Button asChild className="w-full">
          <Link to="/forgot-password">Request a new link</Link>
        </Button>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout title="Set a new password" description="Enter your new password below">
      {done ? (
        <div className="flex flex-col gap-4">
          <p className="text-sm text-fg-secondary">Your password has been reset.</p>
          <Button asChild variant="outline" className="w-full">
            <Link to="/login">
              <ArrowLeft /> Back to login
            </Link>
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Field>
            <FieldLabel htmlFor="new-password">New password</FieldLabel>
            <PasswordInput
              id="new-password"
              name="new-password"
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="At least 8 characters"
              required
              minLength={8}
              autoFocus
            />
          </Field>

          <Button type="submit" disabled={submitting} className="mt-1 w-full">
            {submitting && <Loader2 className="animate-spin" />}
            {submitting ? "Resetting..." : "Reset password"}
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

export default ResetPassword
