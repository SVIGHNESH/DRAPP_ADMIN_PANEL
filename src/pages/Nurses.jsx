import React, { useState, useEffect, useCallback } from "react"
import {
  Award, Calendar, CalendarDays, KeyRound, Loader2, Mail, MapPin, Pencil, Phone,
  Plus, Power, PowerOff, User,
} from 'lucide-react'
import toast from "react-hot-toast"

import { getNurses, createNurse, updateNurse, getNurseAvailability } from '../api/nurses'
import { getBookings } from '../api/bookings'
import { getErrorMessage } from '../utils/apiError'
import { dayOffset, formatDay, formatTimeOfDay } from '../utils/formatDate'
import PageHeader from "../components/PageHeader"
import ErrorState from "../components/ErrorState"
import EmptyState from "../components/EmptyState"
import Pagination from "../components/Pagination"
import SearchInput from "../components/SearchInput"
import StatusBadge from "../components/StatusBadge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Dialog, DialogBody, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { Field, FieldHint, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"

const emptyCreateForm = {
  name: '', email: '', phone: '', password: '', specialization: '', experience_years: '',
}

const emptyAvailability = { loading: false, days: null, error: null }

// A week back for "did they actually work it", a month forward for planning.
const defaultRange = () => ({ from: dayOffset(-7), to: dayOffset(30) })

const initialsOf = (name) =>
  name.split(' ').filter(Boolean).map((n) => n[0]).join('').toUpperCase().slice(0, 2)

const Stat = ({ label, value }) => (
  <Card className="p-4">
    <p className="text-xs font-medium text-fg-muted">{label}</p>
    <p className="mt-2 text-2xl font-semibold text-fg tabular-nums">{value}</p>
  </Card>
)

const DetailRow = ({ icon: Icon, children, className }) => (
  <div className={`flex items-center gap-2 text-xs ${className || 'text-fg-secondary'}`}>
    <Icon size={13} className="shrink-0 text-fg-subtle" />
    <span className="truncate">{children}</span>
  </div>
)

const Nurses = () => {
  const [nurses, setNurses] = useState([])
  const [bookingsByNurse, setBookingsByNurse] = useState({})
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [bookingModalNurse, setBookingModalNurse] = useState(null)
  const [availabilityNurse, setAvailabilityNurse] = useState(null)
  const [availability, setAvailability] = useState(emptyAvailability)
  const [range, setRange] = useState(defaultRange)
  const [showFormModal, setShowFormModal] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [form, setForm] = useState(emptyCreateForm)
  const [submitting, setSubmitting] = useState(false)
  const [togglingId, setTogglingId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const itemsPerPage = 6

  const loadData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      // Nurses are the primary resource here; booking counts are best-effort
      // so a bookings outage does not take the whole page down.
      const [nurseRes, bookingRes] = await Promise.allSettled([getNurses(), getBookings()])

      if (nurseRes.status === 'rejected') throw nurseRes.reason
      setNurses(nurseRes.value.data || [])

      if (bookingRes.status === 'fulfilled') {
        // Keyed by nurse_id when the assignment points at a real nurse row;
        // name is only a fallback for legacy assignments made before nurses
        // were linked by id.
        const grouped = {}
        ;(bookingRes.value.data || []).forEach((b) => {
          const assigned = b.assigned_nurse
          if (!assigned) return
          const key =
            assigned.nurse_id != null
              ? `id:${assigned.nurse_id}`
              : `name:${(assigned.nurse_name || '').toLowerCase()}`
          if (!grouped[key]) grouped[key] = []
          grouped[key].push(b)
        })
        setBookingsByNurse(grouped)
      } else {
        setBookingsByNurse({})
      }
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const bookingsFor = (nurse) => [
    ...(bookingsByNurse[`id:${nurse.nurse_id}`] || []),
    ...(bookingsByNurse[`name:${nurse.name.toLowerCase()}`] || []),
  ]

  // What the nurse declared in their own app: which days were leave, which
  // were worked, and the window on each. Distinct from the availability check
  // on the bookings page, which only answers "who is free for this one slot".
  const loadAvailability = useCallback(async (nurseId, from, to) => {
    setAvailability({ loading: true, days: null, error: null })
    try {
      const res = await getNurseAvailability(nurseId, from, to)
      // The API gives no ordering guarantee; ISO day strings sort lexically.
      const days = (res.data || []).slice().sort((a, b) => a.day.localeCompare(b.day))
      setAvailability({ loading: false, days, error: null })
    } catch (err) {
      setAvailability({ loading: false, days: null, error: getErrorMessage(err) })
    }
  }, [])

  const openAvailability = (nurse) => {
    setAvailabilityNurse(nurse)
    loadAvailability(nurse.nurse_id, range.from, range.to)
  }

  const closeAvailability = () => {
    setAvailabilityNurse(null)
    setAvailability(emptyAvailability)
  }

  // An empty date input clears the bound, which the API accepts as an open
  // end, so it refetches either way.
  const handleRangeChange = (key, value) => {
    const next = { ...range, [key]: value }
    setRange(next)
    if (availabilityNurse) {
      loadAvailability(availabilityNurse.nurse_id, next.from, next.to)
    }
  }

  const declaredDays = availability.days || []
  const leaveCount = declaredDays.filter((d) => d.is_leave).length
  const workingCount = declaredDays.length - leaveCount

  const query = searchQuery.trim().toLowerCase()
  const filtered = nurses.filter((n) => {
    const matchesSearch =
      !query ||
      n.name.toLowerCase().includes(query) ||
      (n.email || '').toLowerCase().includes(query) ||
      (n.phone || '').toLowerCase().includes(query) ||
      (n.specialization || '').toLowerCase().includes(query)
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' ? n.is_active : !n.is_active)
    return matchesSearch && matchesStatus
  })

  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1
  const page = Math.min(currentPage, totalPages)
  const paginated = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage)

  const activeCount = nurses.filter((n) => n.is_active).length
  const pendingPasswordCount = nurses.filter((n) => !n.is_password_reset).length

  const openAdd = () => {
    setEditTarget(null)
    setForm(emptyCreateForm)
    setShowFormModal(true)
  }

  const openEdit = (nurse) => {
    setEditTarget(nurse)
    setForm({
      name: nurse.name,
      email: nurse.email,
      phone: nurse.phone || '',
      password: '',
      specialization: nurse.specialization || '',
      experience_years: nurse.experience_years?.toString() ?? '',
    })
    setShowFormModal(true)
  }

  const closeForm = () => {
    setShowFormModal(false)
    setEditTarget(null)
    setForm(emptyCreateForm)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) return
    if (!editTarget && form.password.length < 8) {
      toast.error("Temporary password must be at least 8 characters")
      return
    }

    const experience =
      form.experience_years === '' ? null : parseInt(form.experience_years, 10)
    if (experience !== null && (Number.isNaN(experience) || experience < 0)) {
      toast.error("Experience must be a positive number of years")
      return
    }

    setSubmitting(true)
    try {
      if (editTarget) {
        await updateNurse(editTarget.nurse_id, {
          name: form.name.trim(),
          phone: form.phone.trim(),
          specialization: form.specialization.trim() || null,
          experience_years: experience,
        })
        toast.success("Nurse updated")
      } else {
        await createNurse({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          password: form.password,
          specialization: form.specialization.trim() || null,
          experience_years: experience,
        })
        toast.success("Nurse created. Share the temporary password with them.")
      }
      closeForm()
      await loadData()
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  const handleToggleActive = async (nurse) => {
    setTogglingId(nurse.nurse_id)
    try {
      const res = await updateNurse(nurse.nurse_id, { is_active: !nurse.is_active })
      setNurses((prev) =>
        prev.map((n) => (n.nurse_id === nurse.nurse_id ? res.data : n))
      )
      // The backend only lists active nurses, so a deactivated nurse is only
      // visible (and reversible) until the next reload.
      toast.success(
        nurse.is_active
          ? "Nurse deactivated. They stay visible until you refresh - reactivate now if this was a mistake."
          : "Nurse activated"
      )
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setTogglingId(null)
    }
  }

  return (
    <>
      <PageHeader
        title="Nurses"
        description="Manage nurse accounts and specializations, and review the days each nurse has declared."
        actions={
          <Button onClick={openAdd}>
            <Plus /> Add nurse
          </Button>
        }
      />

      {loading ? (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[0, 1, 2].map((i) => <Skeleton key={i} className="h-[86px]" />)}
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2, 3, 4, 5].map((i) => <Skeleton key={i} className="h-[232px]" />)}
          </div>
        </div>
      ) : error ? (
        <ErrorState message={error} onRetry={loadData} />
      ) : (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Stat label="Total Nurses" value={nurses.length} />
            <Stat label="Active" value={activeCount} />
            <Stat label="Pending Password Reset" value={pendingPasswordCount} />
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <SearchInput
              className="w-full sm:max-w-md"
              placeholder="Search by name, email, phone, specialization..."
              aria-label="Search nurses"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1) }}
            />
            <Select
              className="sm:w-40"
              aria-label="Filter by status"
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1) }}
            >
              <option value="all">All Nurses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </Select>
          </div>

          {filtered.length === 0 ? (
            <Card>
              <EmptyState message="No nurses found. Add a nurse to get started." />
            </Card>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {paginated.map((nurse) => {
                  const nurseBookings = bookingsFor(nurse)
                  return (
                    <Card
                      key={nurse.nurse_id}
                      className={`flex flex-col p-4 ${nurse.is_active ? '' : 'opacity-70'}`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex min-w-0 items-center gap-2.5">
                          <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-surface-sunken text-xs font-medium text-fg-secondary">
                            {initialsOf(nurse.name)}
                          </span>
                          <div className="min-w-0">
                            <h2 className="truncate text-sm font-semibold text-fg">{nurse.name}</h2>
                            {nurse.specialization && (
                              <p className="truncate text-xs text-fg-muted">{nurse.specialization}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex shrink-0 items-center gap-0.5">
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => openEdit(nurse)}
                            title="Edit nurse"
                            aria-label={`Edit ${nurse.name}`}
                          >
                            <Pencil />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => handleToggleActive(nurse)}
                            disabled={togglingId === nurse.nurse_id}
                            title={nurse.is_active ? 'Deactivate nurse' : 'Activate nurse'}
                            aria-label={`${nurse.is_active ? 'Deactivate' : 'Activate'} ${nurse.name}`}
                            className={nurse.is_active ? 'hover:text-danger' : 'hover:text-success'}
                          >
                            {togglingId === nurse.nurse_id
                              ? <Loader2 className="animate-spin" />
                              : nurse.is_active ? <PowerOff /> : <Power />}
                          </Button>
                        </div>
                      </div>

                      <div className="mt-3">
                        <StatusBadge tone={nurse.is_active ? 'success' : 'neutral'}>
                          {nurse.is_active ? 'Active' : 'Inactive'}
                        </StatusBadge>
                      </div>

                      <div className="mt-3 flex flex-col gap-1.5">
                        <a
                          href={`mailto:${nurse.email}`}
                          className="flex items-center gap-2 rounded-xs text-xs text-fg-secondary outline-none hover:text-accent-text focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          <Mail size={13} className="shrink-0 text-fg-subtle" />
                          <span className="truncate">{nurse.email}</span>
                        </a>
                        {nurse.phone && (
                          <a
                            href={`tel:${nurse.phone}`}
                            className="flex items-center gap-2 rounded-xs text-xs text-fg-secondary outline-none hover:text-accent-text focus-visible:ring-2 focus-visible:ring-ring"
                          >
                            <Phone size={13} className="shrink-0 text-fg-subtle" />
                            <span className="truncate tabular-nums">{nurse.phone}</span>
                          </a>
                        )}
                        {nurse.experience_years != null && (
                          <DetailRow icon={Award}>
                            {nurse.experience_years} year{nurse.experience_years !== 1 ? 's' : ''} experience
                          </DetailRow>
                        )}
                        <DetailRow icon={Calendar}>
                          {nurseBookings.length} booking{nurseBookings.length !== 1 ? 's' : ''} assigned
                        </DetailRow>
                        {!nurse.is_password_reset && (
                          <DetailRow icon={KeyRound} className="text-warning">
                            Still on temporary password
                          </DetailRow>
                        )}
                        {!nurse.is_active && (
                          <p className="text-xs text-fg-muted">
                            Hidden after refresh - the server only lists active nurses.
                          </p>
                        )}
                      </div>

                      {/* The Call button that used to sit here duplicated the
                          tel: link on the phone number above it, and its slot
                          was the only place Availability could go without
                          squeezing three controls into a third-width card. */}
                      <div className="mt-auto flex items-center gap-2 pt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => setBookingModalNurse({ ...nurse, bookings: nurseBookings })}
                        >
                          <Calendar /> Bookings
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => openAvailability(nurse)}
                        >
                          <CalendarDays /> Availability
                        </Button>
                      </div>
                    </Card>
                  )
                })}
              </div>

              <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                className="justify-center"
              />
            </>
          )}
        </div>
      )}

      {/* View Bookings */}
      <Dialog open={!!bookingModalNurse} onOpenChange={(open) => !open && setBookingModalNurse(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bookings for {bookingModalNurse?.name}</DialogTitle>
            <DialogDescription>Assigned bookings</DialogDescription>
          </DialogHeader>
          <DialogBody className="flex flex-col gap-2">
            {bookingModalNurse?.bookings.length === 0 && (
              <p className="py-4 text-sm text-fg-muted">No bookings assigned yet.</p>
            )}
            {bookingModalNurse?.bookings.map((b) => (
              <div key={b.booking_id} className="rounded-md border border-border bg-surface-sunken p-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-2 text-sm font-medium text-fg">
                    <User size={13} className="shrink-0 text-fg-subtle" />
                    <span className="truncate">{b.booked_by_name || `User #${b.user_id}`}</span>
                  </div>
                  <StatusBadge className="bg-surface">{b.status}</StatusBadge>
                </div>
                <div className="mt-2 flex items-center gap-2 text-xs text-fg-muted">
                  <Calendar size={12} className="shrink-0" />
                  {new Date(b.slot_start).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </div>
                {(b.custom_address || b.service_address) && (
                  <div className="mt-1 flex items-center gap-2 text-xs text-fg-muted">
                    <MapPin size={12} className="shrink-0" />
                    <span className="truncate">{b.custom_address || b.service_address}</span>
                  </div>
                )}
              </div>
            ))}
          </DialogBody>
        </DialogContent>
      </Dialog>

      {/* Availability */}
      <Dialog open={!!availabilityNurse} onOpenChange={(open) => !open && closeAvailability()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Availability for {availabilityNurse?.name}</DialogTitle>
            <DialogDescription>
              Days this nurse has declared in their own app. Read-only here - leave and working
              hours are set by the nurse.
            </DialogDescription>
          </DialogHeader>

          <DialogBody className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <Field>
                <FieldLabel htmlFor="avail-from">From</FieldLabel>
                <Input
                  id="avail-from"
                  type="date"
                  value={range.from}
                  onChange={(e) => handleRangeChange('from', e.target.value)}
                  className="tabular-nums"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="avail-to">To</FieldLabel>
                <Input
                  id="avail-to"
                  type="date"
                  value={range.to}
                  onChange={(e) => handleRangeChange('to', e.target.value)}
                  className="tabular-nums"
                />
              </Field>
            </div>

            {availability.loading ? (
              <div className="flex items-center gap-2 py-6 text-xs text-fg-muted">
                <Loader2 size={13} className="animate-spin" />
                Loading declared days...
              </div>
            ) : availability.error ? (
              <ErrorState
                message={availability.error}
                onRetry={() =>
                  loadAvailability(availabilityNurse.nurse_id, range.from, range.to)
                }
              />
            ) : declaredDays.length === 0 ? (
              <p className="py-6 text-center text-sm text-fg-muted">
                Nothing declared for this range. A nurse with no declared days is not
                automatically unavailable - the booking assignment check is what decides that.
              </p>
            ) : (
              <>
                <p className="text-xs text-fg-muted tabular-nums">
                  {workingCount} working day{workingCount !== 1 ? 's' : ''} &middot; {leaveCount} on
                  leave
                </p>

                <div className="flex flex-col gap-2">
                  {declaredDays.map((d) => (
                    <div
                      key={d.availability_id}
                      className="flex items-center justify-between gap-3 rounded-md border border-border bg-surface-sunken p-2.5"
                    >
                      <div className="min-w-0">
                        <p className="text-sm text-fg tabular-nums">{formatDay(d.day)}</p>
                        {d.note && (
                          <p className="mt-0.5 truncate text-xs text-fg-muted">{d.note}</p>
                        )}
                      </div>
                      <div className="shrink-0">
                        {d.is_leave ? (
                          <StatusBadge tone="warning" className="bg-surface">
                            On leave
                          </StatusBadge>
                        ) : d.start_time && d.end_time ? (
                          <span className="text-xs text-fg-secondary tabular-nums">
                            {formatTimeOfDay(d.start_time)} - {formatTimeOfDay(d.end_time)}
                          </span>
                        ) : (
                          <StatusBadge tone="success" className="bg-surface">
                            Available
                          </StatusBadge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </DialogBody>
        </DialogContent>
      </Dialog>

      {/* Add / Edit Nurse */}
      <Dialog open={showFormModal} onOpenChange={(open) => !open && closeForm()}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editTarget ? 'Edit nurse' : 'Add nurse'}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="contents">
            <DialogBody className="flex flex-col gap-4">
              <Field>
                <FieldLabel htmlFor="nurse-name">Full name</FieldLabel>
                <Input
                  id="nurse-name"
                  required
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  placeholder="e.g. Priya Sharma"
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="nurse-email">Email</FieldLabel>
                <Input
                  id="nurse-email"
                  required
                  type="email"
                  disabled={!!editTarget}
                  value={form.email}
                  onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                  placeholder="nurse@example.com"
                />
                {editTarget && <FieldHint>Email is the nurse login and cannot be changed.</FieldHint>}
              </Field>

              <Field>
                <FieldLabel htmlFor="nurse-phone">Phone</FieldLabel>
                <Input
                  id="nurse-phone"
                  required
                  value={form.phone}
                  onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                  placeholder="9999999999"
                  className="tabular-nums"
                />
              </Field>

              {!editTarget && (
                <Field>
                  <FieldLabel htmlFor="nurse-password">Temporary password</FieldLabel>
                  <Input
                    id="nurse-password"
                    required
                    type="password"
                    autoComplete="new-password"
                    minLength={8}
                    value={form.password}
                    onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                    placeholder="At least 8 characters"
                  />
                  <FieldHint>
                    The nurse signs in with this and is prompted to set their own password.
                  </FieldHint>
                </Field>
              )}

              <Field>
                <FieldLabel htmlFor="nurse-specialization">Specialization (optional)</FieldLabel>
                <Input
                  id="nurse-specialization"
                  value={form.specialization}
                  onChange={(e) => setForm((p) => ({ ...p, specialization: e.target.value }))}
                  placeholder="e.g. General Care, ICU, Paediatrics"
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="nurse-experience">Experience (years, optional)</FieldLabel>
                <Input
                  id="nurse-experience"
                  type="number"
                  min="0"
                  value={form.experience_years}
                  onChange={(e) => setForm((p) => ({ ...p, experience_years: e.target.value }))}
                  placeholder="3"
                  className="tabular-nums"
                />
              </Field>
            </DialogBody>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeForm}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting
                  ? <><Loader2 className="animate-spin" /> Saving...</>
                  : <><Plus /> {editTarget ? 'Update nurse' : 'Create nurse'}</>}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default Nurses
