import React, { useState, useEffect, useCallback } from "react"
import {
  Search, Plus, Calendar, Clock, X, ChevronLeft, ChevronRight,
  User, MessageSquare, CheckCircle, Loader as LoaderIcon
} from 'lucide-react'
import { STATUS_LIST, UI_STATUS_MAP, BACKEND_STATUS_MAP } from '../constants/status'
import { getBookings as apiGetBookings, createBooking, confirmBooking, updateBookingStatus, addBookingNote } from '../api/bookings'
import { getServices } from '../api/services'
import { toUiBooking, buildServiceMap } from '../adapters/booking'
import { getErrorMessage } from '../utils/apiError'
import { getAllKnownNurses } from '../utils/localNurses'
import toast from "react-hot-toast"

import Loader from "../components/Loader"
import ErrorState from "../components/ErrorState"
import EmptyState from "../components/EmptyState"

const emptyForm = { service_id: '', slot_start: '', slot_end: '', custom_address: '', notes: '' }

const Bookings = () => {
  const [bookings, setBookings] = useState([])
  const [services, setServices] = useState([])
  const [serviceMap, setServiceMap] = useState(new Map())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [confirmForm, setConfirmForm] = useState({ nurse_name: '', nurse_contact: '' })
  const [noteText, setNoteText] = useState('')

  const itemsPerPage = 6

  const loadData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [bookRes, svcRes] = await Promise.all([
        apiGetBookings(),
        getServices(),
      ])
      const svcData = svcRes.data || []
      setServices(svcData)
      const sm = buildServiceMap(svcData)
      setServiceMap(sm)
      const mapped = (bookRes.data || []).map((b) => toUiBooking(b, sm))
      setBookings(mapped)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const updateBookingInList = (rawBooking) => {
    const updated = toUiBooking(rawBooking, serviceMap)
    setBookings((prev) => prev.map((b) => (b.id === rawBooking.booking_id ? updated : b)))
    return updated
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
      toast.success("Booking created")
      setShowAddModal(false)
      setForm(emptyForm)
      const newBooking = toUiBooking(res.data, serviceMap)
      setBookings((prev) => [newBooking, ...prev])
      setCurrentPage(1)
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  const handleConfirm = async (bookingId) => {
    if (!confirmForm.nurse_name) {
      toast.error("Nurse name is required")
      return
    }
    setSubmitting(true)
    try {
      const res = await confirmBooking(bookingId, confirmForm)
      updateBookingInList(res.data)
      setShowDetailModal(null)
      setConfirmForm({ nurse_name: '', nurse_contact: '' })
      toast.success("Booking confirmed")
    } catch (err) {
      toast.error(getErrorMessage(err))
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

  if (loading) return <Loader />
  if (error) return <ErrorState message={error} onRetry={loadData} />

  const canConfirm = (status) => status === 'pending' || status === 'confirmed'

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Bookings</h1>
          <p className="text-dark-500 mt-1">Manage all caretaker bookings</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="btn-primary flex items-center gap-2">
          <Plus size={18} /> New Booking
        </button>
      </div>

      <div className="card p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500" size={18} />
            <input
              type="text"
              placeholder="Search bookings..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1) }}
              className="input-field pl-10"
            />
          </div>
          <div className="flex items-center gap-3">
            <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1) }} className="input-field w-40">
              <option value="all">All Status</option>
              {STATUS_LIST.map((s) => (
                <option key={s} value={UI_STATUS_MAP[s]}>{UI_STATUS_MAP[s]}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-700">
                <th className="table-header">User</th>
                <th className="table-header">Nurse</th>
                <th className="table-header">Care Type</th>
                <th className="table-header">Date & Time</th>
                <th className="table-header">Status</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((b) => (
                <tr
                  key={b.id}
                  className="border-b border-dark-700/50 hover:bg-dark-800/30 cursor-pointer"
                  onClick={() => setShowDetailModal(b)}
                >
                  <td className="table-cell">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-cyan to-accent-teal flex items-center justify-center text-dark-900 text-sm font-bold">
                        {b.avatar}
                      </div>
                      <div>
                        <p className="font-medium text-dark-200">{b.userName}</p>
                        <p className="text-xs text-dark-500">#{b.userId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="table-cell text-dark-300">{b.nurse}</td>
                  <td className="table-cell text-dark-400">{b.careType}</td>
                  <td className="table-cell">
                    <div className="flex items-center gap-2 text-dark-300">
                      <Calendar size={14} className="text-dark-500" />
                      {b.date}
                    </div>
                    <div className="flex items-center gap-2 text-dark-500 text-xs mt-1">
                      <Clock size={14} />
                      {b.time}
                    </div>
                  </td>
                  <td className="table-cell">
                    <span className={`badge ${b.statusBadge}`}>{b.status}</span>
                  </td>
                </tr>
              ))}
              {paginated.length === 0 && (
                <tr>
                  <td colSpan="5">
                    <EmptyState message="No bookings found." />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between mt-6 pt-4 border-t border-dark-700">
          <p className="text-sm text-dark-500">
            Showing {filtered.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} to{' '}
            {Math.min(currentPage * itemsPerPage, filtered.length)} of {filtered.length} results
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-dark-700 hover:bg-dark-800 disabled:opacity-50"
            >
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-9 h-9 rounded-lg text-sm font-medium ${
                  currentPage === page
                    ? 'bg-accent-cyan text-dark-900'
                    : 'border border-dark-700 hover:bg-dark-800 text-dark-400'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-dark-700 hover:bg-dark-800 disabled:opacity-50"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
          onClick={() => { setShowDetailModal(null); setNoteText('') }}
        >
          <div
            className="bg-dark-900 border border-dark-700 rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-5 border-b border-dark-700">
              <h3 className="font-bold text-dark-100 text-lg">
                Booking #{showDetailModal.bookingId}
              </h3>
              <button
                onClick={() => { setShowDetailModal(null); setNoteText('') }}
                className="p-2 rounded-lg hover:bg-dark-800 text-dark-400"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-dark-800/50 rounded-xl p-3">
                  <p className="text-xs text-dark-500 mb-1">User</p>
                  <p className="text-sm font-medium text-dark-200">{showDetailModal.userName}</p>
                </div>
                <div className="bg-dark-800/50 rounded-xl p-3">
                  <p className="text-xs text-dark-500 mb-1">Status</p>
                  <span className={`badge ${showDetailModal.statusBadge}`}>{showDetailModal.status}</span>
                </div>
                <div className="bg-dark-800/50 rounded-xl p-3">
                  <p className="text-xs text-dark-500 mb-1">Care Type</p>
                  <p className="text-sm text-dark-200">{showDetailModal.careType}</p>
                </div>
                <div className="bg-dark-800/50 rounded-xl p-3">
                  <p className="text-xs text-dark-500 mb-1">Nurse</p>
                  <p className="text-sm text-dark-200">{showDetailModal.nurse}</p>
                </div>
                <div className="bg-dark-800/50 rounded-xl p-3 col-span-2">
                  <p className="text-xs text-dark-500 mb-1">Slot</p>
                  <p className="text-sm text-dark-200">{showDetailModal.date} {showDetailModal.time}</p>
                </div>
                <div className="bg-dark-800/50 rounded-xl p-3 col-span-2">
                  <p className="text-xs text-dark-500 mb-1">Address</p>
                  <p className="text-sm text-dark-200">{showDetailModal.address}</p>
                </div>
              </div>

              {/* Notes timeline */}
              {showDetailModal.notes.length > 0 && (
                <div>
                  <h4 className="font-semibold text-dark-200 mb-3 flex items-center gap-2">
                    <MessageSquare size={16} /> Notes
                  </h4>
                  <div className="space-y-3">
                    {showDetailModal.notes.map((note) => (
                      <div key={note.note_id} className="bg-dark-800/30 rounded-xl p-3 border border-dark-700/50">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-accent-cyan">{note.author}</span>
                          <span className="text-xs text-dark-500">
                            {new Date(note.created_at).toLocaleString('en-IN', {
                              day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
                            })}
                          </span>
                        </div>
                        <p className="text-sm text-dark-300">{note.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Add Note */}
              <div>
                <label className="block text-sm text-dark-500 mb-2">Add Note</label>
                <div className="flex gap-2">
                  <input
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    placeholder="Write a note..."
                    className="input-field flex-1"
                    disabled={submitting}
                  />
                  <button
                    onClick={() => handleAddNote(showDetailModal.bookingId)}
                    disabled={submitting || !noteText.trim()}
                    className="btn-primary"
                  >
                    {submitting ? <LoaderIcon size={16} className="animate-spin" /> : 'Add'}
                  </button>
                </div>
              </div>

              {/* Admin actions */}
              <div className="border-t border-dark-700 pt-4 space-y-3">
                {/* Confirm */}
                {canConfirm(showDetailModal.status) && (
                  <div className="bg-dark-800/30 rounded-xl p-3 space-y-2">
                    <h4 className="font-semibold text-dark-200 text-sm">Confirm & Assign Nurse</h4>
                    <div className="relative">
                      <input
                        list="known-nurses"
                        value={confirmForm.nurse_name}
                        onChange={(e) => {
                          const name = e.target.value
                          setConfirmForm((prev) => ({ ...prev, nurse_name: name }))
                          const match = getAllKnownNurses().find(
                            (n) => n.name.toLowerCase() === name.toLowerCase()
                          )
                          if (match && match.contact && !confirmForm.nurse_contact) {
                            setConfirmForm((prev) => ({ ...prev, nurse_contact: match.contact }))
                          }
                        }}
                        placeholder="Type or select a nurse"
                        className="input-field"
                        disabled={submitting}
                      />
                      <datalist id="known-nurses">
                        {getAllKnownNurses().map((n) => (
                          <option key={n.id} value={n.name} />
                        ))}
                      </datalist>
                    </div>
                    <input
                      value={confirmForm.nurse_contact}
                      onChange={(e) => setConfirmForm((prev) => ({ ...prev, nurse_contact: e.target.value }))}
                      placeholder="Nurse contact (optional)"
                      className="input-field"
                      disabled={submitting}
                    />
                    <button
                      onClick={() => handleConfirm(showDetailModal.bookingId)}
                      disabled={submitting || !confirmForm.nurse_name}
                      className="btn-primary w-full flex items-center justify-center gap-2"
                    >
                      {submitting ? <LoaderIcon size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                      Confirm Booking
                    </button>
                  </div>
                )}

                {/* Change Status */}
                <div>
                  <label className="block text-sm text-dark-500 mb-2">Change Status</label>
                  <select
                    value={BACKEND_STATUS_MAP[showDetailModal.status] || showDetailModal.status}
                    onChange={(e) => {
                      const backendStatus = e.target.value
                      if (backendStatus && backendStatus !== (BACKEND_STATUS_MAP[showDetailModal.status] || showDetailModal.status)) {
                        handleStatusChange(showDetailModal.bookingId, backendStatus)
                      }
                    }}
                    className="input-field"
                    disabled={submitting}
                  >
                    {STATUS_LIST.map((s) => (
                      <option key={s} value={s}>{UI_STATUS_MAP[s]}</option>
                    ))}
                  </select>
                </div>
              </div>

              {showDetailModal.assignedNurse && (
                <div className="flex items-center gap-2 text-sm text-dark-400 pt-2 border-t border-dark-700">
                  <User size={14} className="text-accent-teal" />
                  <span>
                    Assigned to <strong className="text-dark-200">{showDetailModal.assignedNurse.nurse_name}</strong>
                    {showDetailModal.assignedNurse.nurse_contact && (
                      <>
                        {' '}&middot;{' '}
                        <a href={`tel:${showDetailModal.assignedNurse.nurse_contact}`} className="text-accent-cyan hover:underline">
                          {showDetailModal.assignedNurse.nurse_contact}
                        </a>
                      </>
                    )}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* New Booking Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowAddModal(false)}>
          <div className="bg-dark-900 border border-dark-700 rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-dark-700">
              <h3 className="font-bold text-dark-100 text-lg">New Booking</h3>
              <button onClick={() => setShowAddModal(false)} className="p-2 rounded-lg hover:bg-dark-800 text-dark-400">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleCreateBooking} className="p-5 space-y-4">
              <div>
                <label className="block text-sm text-dark-500 mb-2">Service</label>
                <select required name="service_id" value={form.service_id} onChange={handleChange} className="input-field">
                  <option value="">Select a service</option>
                  {services.map((s) => (
                    <option key={s.service_id} value={s.service_id}>
                      {s.name} (₹{s.base_price})
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-dark-500 mb-2">Start Date & Time</label>
                  <input required type="datetime-local" name="slot_start" value={form.slot_start} onChange={handleChange} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm text-dark-500 mb-2">End Date & Time</label>
                  <input required type="datetime-local" name="slot_end" value={form.slot_end} onChange={handleChange} className="input-field" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-dark-500 mb-2">Address (free text)</label>
                <input
                  required
                  name="custom_address"
                  value={form.custom_address}
                  onChange={handleChange}
                  placeholder="e.g. Sector 12, Bareilly"
                  className="input-field"
                />
                <p className="text-xs text-dark-500 mt-1">
                  Note: Booking will be created under your own account (admin). Saved addresses cannot be selected here.
                </p>
              </div>
              <div>
                <label className="block text-sm text-dark-500 mb-2">Notes (optional)</label>
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  placeholder="Any additional notes..."
                  className="input-field"
                  rows={2}
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                {submitting ? <LoaderIcon size={18} className="animate-spin" /> : <Plus size={18} />}
                {submitting ? 'Creating...' : 'Create Booking'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Bookings
