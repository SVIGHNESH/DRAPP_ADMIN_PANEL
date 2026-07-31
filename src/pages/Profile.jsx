import React, { useState } from "react"
import { Loader2 } from "lucide-react"
import toast from "react-hot-toast"

import { updateMe } from "../api/auth"
import { useAuth } from "../context/useAuth"
import { getErrorMessage } from "../utils/apiError"
import { formatDate } from "../utils/formatDate"
import PageHeader from "../components/PageHeader"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Field, FieldHint, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

/** A field the API will not accept a change to, shown for reference only. */
const ReadOnlyRow = ({ label, value }) => (
  <div className="flex items-baseline justify-between gap-4 py-2">
    <span className="text-xs text-fg-muted">{label}</span>
    <span className="truncate text-sm text-fg">{value}</span>
  </div>
)

/**
 * PATCH /users/me, which takes name and phone and nothing else.
 *
 * Email is the login credential and role is assigned server-side - neither is
 * in UserUpdate - so both sit in the read-only block rather than as disabled
 * inputs that imply they could be edited somewhere.
 */
const Profile = () => {
  const { user, updateUser } = useAuth()
  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
  })
  const [submitting, setSubmitting] = useState(false)

  const dirty =
    form.name.trim() !== (user?.name || "") || form.phone.trim() !== (user?.phone || "")

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) {
      toast.error("Name cannot be empty")
      return
    }

    setSubmitting(true)
    try {
      const res = await updateMe({
        name: form.name.trim(),
        phone: form.phone.trim() || null,
      })
      updateUser(res.data)
      setForm({ name: res.data.name || "", phone: res.data.phone || "" })
      toast.success("Profile updated")
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  const joined = user?.created_at ? formatDate(user.created_at).date : null

  return (
    <>
      <PageHeader title="Profile" description="Your admin account details." />

      <div className="flex max-w-xl flex-col gap-4">
        <Card className="p-4">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Field>
              <FieldLabel htmlFor="profile-name">Full name</FieldLabel>
              <Input
                id="profile-name"
                required
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                placeholder="e.g. Priya Sharma"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="profile-phone">Phone</FieldLabel>
              <Input
                id="profile-phone"
                value={form.phone}
                onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                placeholder="9999999999"
                className="tabular-nums"
              />
              <FieldHint>Leave blank to remove the number on file.</FieldHint>
            </Field>

            <div className="flex justify-end">
              <Button type="submit" disabled={submitting || !dirty}>
                {submitting && <Loader2 className="animate-spin" />}
                {submitting ? "Saving..." : "Save changes"}
              </Button>
            </div>
          </form>
        </Card>

        <Card className="p-4">
          <h2 className="text-xs font-medium text-fg-secondary">Account</h2>
          <div className="mt-1 divide-y divide-border">
            <ReadOnlyRow label="Email" value={user?.email || "-"} />
            <ReadOnlyRow label="Role" value={user?.role || "-"} />
            {joined && <ReadOnlyRow label="Member since" value={joined} />}
          </div>
          <p className="mt-3 text-xs text-fg-muted">
            Email is your sign-in and cannot be changed here. To change your password, sign out
            and use the forgot-password link.
          </p>
        </Card>
      </div>
    </>
  )
}

export default Profile
