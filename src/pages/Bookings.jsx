import React, { useState, useEffect, useCallback } from "react"
import {
  Calendar, CheckCircle, Clock, Loader2, MessageSquare, Plus, User,
} from 'lucide-react'
import toast from "react-hot-toast"

import {
  STATUS_LIST, ADMIN_SETTABLE_STATUSES, UI_STATUS_MAP, BACKEND_STATUS_MAP,
  getPaymentStatusTone,
} from '../constants/status'
import { getBookings as apiGetBookings, createBooking, confirmBooking, updateBookingStatus, addBookingNote } from '../api/bookings'
import { getServices } from '../api/services'
import { getNurses, getAvailableNurses } from '../api/nurses'
import { toUiBooking, buildServiceMap } from '../adapters/booking'
import { getErrorMessage } from '../utils/apiError'
import { formatDate, toDateParam } from '../utils/formatDate'
import PageHeader from "../components/PageHeader"
import ErrorState from "../components/ErrorState"
import EmptyState from "../components/EmptyState"
import Pagination from "../components/Pagination"
import SearchInput from "../components/SearchInput"
import StatusBadge from "../components/StatusBadge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog, DialogBody, DialogContent, DialogDescription, DialogFooter, DialogHeader,
  DialogTitle, focusContent,
} from "@/components/ui/dialog"
import { Field, FieldHint, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"

const emptyForm = { service_id: '', slot_start: '', slot_end: '', custom_address: '', notes: '' }
const emptyAvailability = { loading: false, list: null, error: null, date: null }
const emptyConfirmForm = { nurse_id: null, nurse_name: '', nurse_contact: '' }

// Newest first. GET /bookings returns no ordering guarantee and takes no sort
// param, so the queue is ordered here: the booking that just came in is the
// one an admin is looking for, and it was previously wherever the backend
// happened to put it.
const byNewest = (a, b) => new Date(b.createdAt) - new Date(a.createdAt)

// The backend allows confirming from pending_payment, requested and confirmed.
const canConfirm = (status) =>
  status === 'awaiting-payment' || status === 'pending' || status === 'confirmed'

/** One of the field boxes in the detail modal, on T03's --surface-sunken. */
const DetailBox = ({ label, children, className }) => (
  <div className={`rounded-md border border-border bg-surface-sunken p-2.5 ${className || ''}`}>
    <p className="text-2xs font-medium tracking-wide text-fg-muted uppercase">{label}</p>
    <div className="mt-1 text-sm text-fg">{children}</div>
  </div>
)

const Bookings = () => {
  const [bookings, setBookings] = useState([])
  const [services, setServices] = useState([])
  const [nurses, setNurses] = useState([])
  const [availability, setAvailability] = useState(emptyAvailability)
  const [manualNurse, setManualNurse] = useState(false)
  const [serviceMap, setServiceMap] = useState(new Map())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showPending, setShowPending] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [confirmForm, setConfirmForm] = useState(emptyConfirmForm)
  const [noteText, setNoteText] = useState('')

  const itemsPerPage = 6

  const loadData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [bookRes, svcRes] = await Promise.all([
        apiGetBookings(showPending),
        getServices(),
      ])
      const svcData = svcRes.data || []
      setServices(svcData)
      const sm = buildServiceMap(svcData)
      setServiceMap(sm)
      const mapped = (bookRes.data || []).map((b) => toUiBooking(b, sm)).sort(byNewest)
      setBookings(mapped)

      // Roster is only needed as a fallback for the assign-nurse picker, so a
      // failure here must not block the bookings table.
      try {
        const nurseRes = await getNurses()
        setNurses((nurseRes.data || []).filter((n) => n.is_active))
      } catch {
        setNurses([])
      }
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [showPending])

  useEffect(() => {
    loadData()
  }, [loadData])

  const updateBookingInList = (rawBooking) => {
    const updated = toUiBooking(rawBooking, serviceMap)
    setBookings((prev) => prev.map((b) => (b.id === rawBooking.booking_id ? updated : b)))
    return updated
  }

  const loadAvailability = async (booking) => {
    const dateStr = toDateParam(booking.slotStart)
    if (!dateStr) {
      setAvailability(emptyAvailability)
      return
    }
    setAvailability({ loading: true, list: null, error: null, date: dateStr })
    try {
      // Pass the exact slot: without it the backend treats the whole day as
      // the window and hides any nurse with a single booking that day.
      const res = await getAvailableNurses(dateStr, booking.slotStart, booking.slotEnd)
      setAvailability({ loading: false, list: res.data || [], error: null, date: dateStr })
    } catch (err) {
      setAvailability({ loading: false, list: null, error: getErrorMessage(err), date: dateStr })
    }
  }

  const openDetail = (booking) => {
    setShowDetailModal(booking)
    setConfirmForm(emptyConfirmForm)
    setManualNurse(false)
    setAvailability(emptyAvailability)
    if (canConfirm(booking.status)) {
      loadAvailability(booking)
    }
  }

  const closeDetail = () => {
    setShowDetailModal(null)
    setNoteText('')
    setAvailability(emptyAvailability)
    setManualNurse(false)
  }

  // Availability is the source of truth for who can take the slot; the full
  // active roster is the fallback when that lookup is unavailable.
  const nurseOptions =
    availability.list ??
    nurses.map((n) => ({
      nurse_id: n.nurse_id,
      nurse_name: n.name,
      phone: n.phone,
      specialization: n.specialization,
      experience_years: n.experience_years,
    }))

  const handleSelectNurse = (nurseId) => {
    if (nurseId === '__manual__') {
      setManualNurse(true)
      setConfirmForm(emptyConfirmForm)
      return
    }
    setManualNurse(false)
    const nurse = nurseOptions.find((n) => String(n.nurse_id) === nurseId)
    setConfirmForm({
      nurse_id: nurse?.nurse_id ?? null,
      nurse_name: nurse?.nurse_name || '',
      nurse_contact: nurse?.phone || '',
    })
  }

  const filtered = bookings.filter((b) => {
    const matchesSearch =
      b.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.nurse.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.careType.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleCreateBooking = async (e) => {
    e.preventDefault()
    if (!form.service_id || !form.slot_start || !form.slot_end) return
    if (!form.custom_address) {
      toast.error("Address is required")
      return
    }
    setSubmitting(true)
    try {
      const toNoTz = (v) => v ? v + ':00' : undefined
      const payload = {
        service_id: parseInt(form.service_id, 10),
        slot_start: toNoTz(form.slot_start),
        slot_end: toNoTz(form.slot_end),
        custom_address: form.custom_address,
        notes: form.notes || undefined,
      }
      const res = await createBooking(payload)
      toast.success("Booking created - it starts as awaiting payment until confirmed")
      setShowAddModal(false)
      setForm(emptyForm)
      const newBooking = toUiBooking(res.data, serviceMap)
      setBookings((prev) => [newBooking, ...prev])
      setCurrentPage(1)
      // A new booking starts as pending_payment, which the default listing
      // hides; switch the pending filter on so it survives a reload.
      setShowPending(true)
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  const handleConfirm = async (bookingId) => {
    if (!confirmForm.nurse_id && !confirmForm.nurse_name.trim()) {
      toast.error("Select a nurse or enter a name")
      return
    }
    setSubmitting(true)
    try {
      // nurse_id links the assignment to the nurse row, which is what makes
      // the backend's overlap checks see the slot as taken. nurse_name is
      // sent alongside it because older backend deployments require it (they
      // predate nurse_id and would 422 without a name).
      const payload = {
        ...(confirmForm.nurse_id ? { nurse_id: confirmForm.nurse_id } : {}),
        nurse_name: confirmForm.nurse_name.trim(),
        nurse_contact: confirmForm.nurse_contact.trim() || undefined,
      }
      const res = await confirmBooking(bookingId, payload)
      updateBookingInList(res.data)
      closeDetail()
      setConfirmForm(emptyConfirmForm)
      toast.success("Booking confirmed")
    } catch (err) {
      toast.error(getErrorMessage(err))
      // A 409 means the nurse was booked meanwhile; refresh the picker.
      if (err.response?.status === 409 && showDetailModal) {
        setConfirmForm(emptyConfirmForm)
        loadAvailability(showDetailModal)
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleStatusChange = async (bookingId, newStatus) => {
    setSubmitting(true)
    try {
      const res = await updateBookingStatus(bookingId, newStatus)
      updateBookingInList(res.data)
      toast.success(`Status updated to ${UI_STATUS_MAP[newStatus] || newStatus}`)
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  const handleAddNote = async (bookingId) => {
    if (!noteText.trim()) return
    setSubmitting(true)
    try {
      const res = await addBookingNote(bookingId, noteText)
      const updated = updateBookingInList(res.data)
      setShowDetailModal(updated)
      setNoteText('')
      toast.success("Note added")
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  const detail = showDetailModal

  return (
    <>
      <PageHeader
        title="Bookings"
        description="Manage all caretaker bookings"
        actions={
          <Button onClick={() => setShowAddModal(true)}>
            <Plus /> New booking
          </Button>
        }
      />

      {loading ? (
        <Skeleton className="h-[520px]" />
      ) : error ? (
        <ErrorState message={error} onRetry={loadData} />
      ) : (
        <Card>
          <div className="flex flex-col items-start gap-3 border-b border-border p-3 sm:flex-row sm:items-center sm:justify-between">
            <SearchInput
              className="w-full sm:max-w-xs"
              placeholder="Search bookings..."
              aria-label="Search bookings"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1) }}
            />
            <div className="flex w-full items-center gap-3 sm:w-auto">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="show-pending"
                  checked={showPending}
                  onCheckedChange={(checked) => { setShowPending(checked === true); setCurrentPage(1) }}
                />
                <Label htmlFor="show-pending" className="whitespace-nowrap">
                  Show awaiting payment
                </Label>
              </div>
              <Select
                className="w-40"
                aria-label="Filter by status"
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1) }}
              >
                <option value="all">All Status</option>
                {STATUS_LIST.map((s) => (
                  <option key={s} value={UI_STATUS_MAP[s]}>{UI_STATUS_MAP[s]}</option>
                ))}
              </Select>
            </div>
          </div>

          {paginated.length === 0 ? (
            <EmptyState message="No bookings found." />
          ) : (
            // min-w: five columns of names, dates and statuses do not compress
            // below this without every cell wrapping to three lines, so the
            // table scrolls sideways on a phone rather than concertinaing.
            <Table className="min-w-[760px]">
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Nurse</TableHead>
                  <TableHead>Care Type</TableHead>
                  <TableHead>Date &amp; Time</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.map((b) => (
                  <TableRow key={b.id} interactive onClick={() => openDetail(b)}>
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-border bg-surface-sunken text-2xs font-medium text-fg-secondary">
                          {b.avatar}
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate font-medium text-fg">{b.userName}</span>
                          <span className="block truncate text-xs text-fg-muted">
                            {b.userEmail || `#${b.userId}`}
                          </span>
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">{b.nurse}</TableCell>
                    <TableCell className="whitespace-nowrap text-fg-muted">{b.careType}</TableCell>
                    <TableCell>
                      <span className="flex items-center gap-1.5 whitespace-nowrap tabular-nums">
                        <Calendar size={12} className="shrink-0 text-fg-subtle" />
                        {b.date}
                      </span>
                      <span className="mt-0.5 flex items-center gap-1.5 text-xs whitespace-nowrap text-fg-muted tabular-nums">
                        <Clock size={12} className="shrink-0" />
                        {b.time}
                      </span>
                    </TableCell>
                    <TableCell>
                      <StatusBadge tone={b.statusTone}>{b.status}</StatusBadge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          <div className="flex flex-col items-center justify-between gap-3 border-t border-border p-3 sm:flex-row">
            <p className="text-xs text-fg-muted tabular-nums">
              Showing {filtered.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} to{' '}
              {Math.min(currentPage * itemsPerPage, filtered.length)} of {filtered.length} results
            </p>
            <Pagination page={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </div>
        </Card>
      )}

      {/* Detail */}
      <Dialog open={!!detail} onOpenChange={(open) => !open && closeDetail()}>
        <DialogContent onOpenAutoFocus={focusContent}>
          <DialogHeader>
            <DialogTitle className="tabular-nums">Booking #{detail?.bookingId}</DialogTitle>
            {detail?.createdAt && (
              <DialogDescription className="tabular-nums">
                Booked on {formatDate(detail.createdAt).date} at {formatDate(detail.createdAt).time}
              </DialogDescription>
            )}
          </DialogHeader>

          {detail && (
            <DialogBody className="flex flex-col gap-5">
              <div className="grid grid-cols-2 gap-2">
                <DetailBox label="Booked by">
                  <p className="truncate">{detail.userName}</p>
                  {detail.userEmail && (
                    <p className="truncate text-xs text-fg-muted">{detail.userEmail}</p>
                  )}
                </DetailBox>
                <DetailBox label="Status">
                  <StatusBadge tone={detail.statusTone} className="bg-surface">
                    {detail.status}
                  </StatusBadge>
                </DetailBox>
                <DetailBox label="Care type">{detail.careType}</DetailBox>
                <DetailBox label="Payment">
                  {detail.paymentStatus ? (
                    <StatusBadge tone={getPaymentStatusTone(detail.paymentStatus)} className="bg-surface">
                      {detail.paymentStatus}
                    </StatusBadge>
                  ) : (
                    <span className="text-fg-muted">No payment yet</span>
                  )}
                </DetailBox>
                {detail.patientName && (
                  <DetailBox label="Patient" className="col-span-2">
                    <p>
                      {detail.patientName}
                      {detail.patientAge != null && `, ${detail.patientAge} yrs`}
                      {detail.patientSex && ` (${detail.patientSex})`}
                    </p>
                    {detail.patientCondition && (
                      <p className="mt-0.5 text-xs text-fg-muted">{detail.patientCondition}</p>
                    )}
                  </DetailBox>
                )}
                <DetailBox label="Nurse">{detail.nurse}</DetailBox>
                <DetailBox label="Slot">
                  <span className="tabular-nums">{detail.date} {detail.time}</span>
                </DetailBox>
                <DetailBox label="Address" className="col-span-2">{detail.address}</DetailBox>
              </div>

              {detail.notes.length > 0 && (
                <section>
                  <h3 className="mb-2 flex items-center gap-1.5 text-xs font-medium text-fg-secondary">
                    <MessageSquare size={13} className="text-fg-subtle" /> Notes
                  </h3>
                  <div className="flex flex-col gap-2">
                    {detail.notes.map((note) => (
                      <div key={note.note_id} className="rounded-md border border-border bg-surface-sunken p-2.5">
                        <div className="flex items-center justify-between gap-3">
                          <span className="truncate text-xs font-medium text-fg">{note.author}</span>
                          <span className="shrink-0 text-xs text-fg-muted tabular-nums">
                            {new Date(note.created_at).toLocaleString('en-IN', {
                              day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
                            })}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-fg-secondary">{note.message}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              <Field>
                <FieldLabel htmlFor="booking-note">Add note</FieldLabel>
                <div className="flex gap-2">
                  <Input
                    id="booking-note"
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    placeholder="Write a note..."
                    disabled={submitting}
                  />
                  <Button
                    onClick={() => handleAddNote(detail.bookingId)}
                    disabled={submitting || !noteText.trim()}
                  >
                    {submitting ? <Loader2 className="animate-spin" /> : 'Add'}
                  </Button>
                </div>
              </Field>

              {canConfirm(detail.status) && (
                <section className="flex flex-col gap-2 rounded-md border border-border bg-surface-sunken p-3">
                  <h3 className="text-xs font-medium text-fg">Confirm &amp; assign nurse</h3>

                  {availability.loading ? (
                    <div className="flex items-center gap-2 py-1 text-xs text-fg-muted">
                      <Loader2 size={13} className="animate-spin" />
                      Checking nurse availability for {detail.date}...
                    </div>
                  ) : (
                    <>
                      <Select
                        aria-label="Select a nurse"
                        value={manualNurse ? '__manual__' : (confirmForm.nurse_id ?? '')}
                        onChange={(e) => handleSelectNurse(e.target.value)}
                        disabled={submitting}
                      >
                        <option value="">Select a nurse</option>
                        {nurseOptions.map((n) => (
                          <option key={n.nurse_id} value={n.nurse_id}>
                            {n.nurse_name}
                            {n.specialization ? ` - ${n.specialization}` : ''}
                            {n.experience_years != null ? ` (${n.experience_years}y)` : ''}
                          </option>
                        ))}
                        <option value="__manual__">Enter nurse manually...</option>
                      </Select>

                      {availability.list && (
                        <FieldHint>
                          {availability.list.length === 0
                            ? `No nurses free on ${detail.date}. Assign manually if you have arranged cover.`
                            : `${availability.list.length} nurse${availability.list.length !== 1 ? 's' : ''} available on ${detail.date}.`}
                        </FieldHint>
                      )}
                      {availability.error && (
                        <p className="text-xs text-warning">
                          Availability check failed ({availability.error}). Showing all active nurses.
                        </p>
                      )}

                      {manualNurse && (
                        <Input
                          value={confirmForm.nurse_name}
                          onChange={(e) => setConfirmForm((prev) => ({ ...prev, nurse_name: e.target.value }))}
                          placeholder="Nurse name"
                          aria-label="Nurse name"
                          disabled={submitting}
                        />
                      )}
                    </>
                  )}

                  <Input
                    value={confirmForm.nurse_contact}
                    onChange={(e) => setConfirmForm((prev) => ({ ...prev, nurse_contact: e.target.value }))}
                    placeholder="Nurse contact (optional)"
                    aria-label="Nurse contact"
                    disabled={submitting}
                  />
                  <Button
                    onClick={() => handleConfirm(detail.bookingId)}
                    disabled={submitting || !confirmForm.nurse_name}
                    className="w-full"
                  >
                    {submitting ? <Loader2 className="animate-spin" /> : <CheckCircle />}
                    Confirm booking
                  </Button>
                </section>
              )}

              <Field>
                <FieldLabel htmlFor="booking-status">Change status</FieldLabel>
                <Select
                  id="booking-status"
                  value={BACKEND_STATUS_MAP[detail.status] || detail.status}
                  onChange={(e) => {
                    const backendStatus = e.target.value
                    if (backendStatus && backendStatus !== (BACKEND_STATUS_MAP[detail.status] || detail.status)) {
                      handleStatusChange(detail.bookingId, backendStatus)
                    }
                  }}
                  disabled={submitting}
                >
                  {/* pending_payment is only listed while the booking is in
                      it - a checkout state is not something to move back to. */}
                  {detail.backendStatus === 'pending_payment' && (
                    <option value="pending_payment">{UI_STATUS_MAP.pending_payment}</option>
                  )}
                  {ADMIN_SETTABLE_STATUSES.map((s) => (
                    <option key={s} value={s}>{UI_STATUS_MAP[s]}</option>
                  ))}
                </Select>
              </Field>

              {detail.assignedNurse && (
                <div className="flex items-start gap-2 border-t border-border pt-3 text-xs text-fg-muted">
                  <User size={13} className="mt-px shrink-0 text-fg-subtle" />
                  <span>
                    Assigned to <span className="font-medium text-fg">{detail.assignedNurse.nurse_name}</span>
                    {detail.assignedNurse.nurse_contact && (
                      <>
                        {' '}&middot;{' '}
                        <a
                          href={`tel:${detail.assignedNurse.nurse_contact}`}
                          className="rounded-xs text-accent-text tabular-nums outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          {detail.assignedNurse.nurse_contact}
                        </a>
                      </>
                    )}
                  </span>
                </div>
              )}
            </DialogBody>
          )}
        </DialogContent>
      </Dialog>

      {/* New Booking */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New booking</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleCreateBooking} className="contents">
            <DialogBody className="flex flex-col gap-4">
              <Field>
                <FieldLabel htmlFor="booking-service">Service</FieldLabel>
                <Select
                  id="booking-service"
                  required
                  name="service_id"
                  value={form.service_id}
                  onChange={handleChange}
                >
                  <option value="">Select a service</option>
                  {services.map((s) => (
                    <option key={s.service_id} value={s.service_id}>
                      {s.name} (₹{s.base_price})
                    </option>
                  ))}
                </Select>
              </Field>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="slot-start">Start date &amp; time</FieldLabel>
                  <Input
                    id="slot-start"
                    required
                    type="datetime-local"
                    name="slot_start"
                    value={form.slot_start}
                    onChange={handleChange}
                    className="tabular-nums"
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="slot-end">End date &amp; time</FieldLabel>
                  <Input
                    id="slot-end"
                    required
                    type="datetime-local"
                    name="slot_end"
                    value={form.slot_end}
                    onChange={handleChange}
                    className="tabular-nums"
                  />
                </Field>
              </div>

              <Field>
                <FieldLabel htmlFor="booking-address">Address (free text)</FieldLabel>
                <Input
                  id="booking-address"
                  required
                  name="custom_address"
                  value={form.custom_address}
                  onChange={handleChange}
                  placeholder="e.g. Sector 12, Bareilly"
                />
                <FieldHint>
                  Note: Booking will be created under your own account (admin). Saved addresses cannot be selected here.
                </FieldHint>
              </Field>

              <Field>
                <FieldLabel htmlFor="booking-notes">Notes (optional)</FieldLabel>
                <Textarea
                  id="booking-notes"
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  placeholder="Any additional notes..."
                  rows={2}
                />
              </Field>
            </DialogBody>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowAddModal(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? <Loader2 className="animate-spin" /> : <Plus />}
                {submitting ? 'Creating...' : 'Create booking'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default Bookings
