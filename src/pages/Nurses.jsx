import React, { useState, useEffect, useCallback } from "react"
import {
  Search, Phone, Mail, Calendar, MapPin, X, ChevronLeft, ChevronRight,
  User, Plus, Edit3, Power, PowerOff, Award, KeyRound,
  Loader as LoaderIcon
} from 'lucide-react'
import { getNurses, createNurse, updateNurse } from '../api/nurses'
import { getBookings } from '../api/bookings'
import { getErrorMessage } from '../utils/apiError'
import toast from "react-hot-toast"

import Loader from "../components/Loader"
import ErrorState from "../components/ErrorState"
import EmptyState from "../components/EmptyState"

const emptyCreateForm = {
  name: '', email: '', phone: '', password: '', specialization: '', experience_years: '',
}

const Nurses = () => {
  const [nurses, setNurses] = useState([])
  const [bookingsByNurse, setBookingsByNurse] = useState({})
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [bookingModalNurse, setBookingModalNurse] = useState(null)
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

  if (loading) return <Loader />
  if (error) return <ErrorState message={error} onRetry={loadData} />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Nurses</h1>
          <p className="text-dark-500 mt-1">
            Manage nurse accounts, specializations, and availability for assignment.
          </p>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2">
          <Plus size={18} /> Add Nurse
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-4">
          <p className="text-xs text-dark-500 mb-1">Total Nurses</p>
          <p className="text-2xl font-bold text-dark-100">{nurses.length}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-dark-500 mb-1">Active</p>
          <p className="text-2xl font-bold text-emerald-400">{activeCount}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-dark-500 mb-1">Pending Password Reset</p>
          <p className="text-2xl font-bold text-amber-400">{pendingPasswordCount}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500" size={18} />
          <input
            type="text"
            placeholder="Search by name, email, phone, specialization..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1) }}
            className="input-field pl-10"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1) }}
          className="input-field w-full sm:w-40"
        >
          <option value="all">All Nurses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState message="No nurses found. Add a nurse to get started." />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginated.map((nurse) => {
              const initials = nurse.name.split(' ').filter(Boolean).map((n) => n[0]).join('').toUpperCase().slice(0, 2)
              const nurseBookings = bookingsFor(nurse)
              return (
                <div key={nurse.nurse_id} className={`card p-6 ${nurse.is_active ? '' : 'opacity-70'}`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-cyan to-accent-teal flex items-center justify-center text-dark-900 text-xl font-bold">
                      {initials}
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEdit(nurse)}
                        className="p-1.5 rounded-lg hover:bg-dark-800 text-dark-500 hover:text-accent-cyan"
                        title="Edit nurse"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => handleToggleActive(nurse)}
                        disabled={togglingId === nurse.nurse_id}
                        className={`p-1.5 rounded-lg disabled:opacity-50 ${
                          nurse.is_active
                            ? 'hover:bg-rose-500/10 text-dark-500 hover:text-rose-400'
                            : 'hover:bg-emerald-500/10 text-dark-500 hover:text-emerald-400'
                        }`}
                        title={nurse.is_active ? 'Deactivate nurse' : 'Activate nurse'}
                      >
                        {togglingId === nurse.nurse_id
                          ? <LoaderIcon size={16} className="animate-spin" />
                          : nurse.is_active ? <PowerOff size={16} /> : <Power size={16} />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-dark-100 text-lg">{nurse.name}</h3>
                    <span className={`badge ${
                      nurse.is_active
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : 'bg-dark-700 text-dark-400'
                    }`}>
                      {nurse.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  {nurse.specialization && (
                    <p className="text-sm text-accent-cyan mb-3">{nurse.specialization}</p>
                  )}

                  <div className="space-y-2 mb-4">
                    <a
                      href={`mailto:${nurse.email}`}
                      className="flex items-center gap-2 text-sm text-dark-400 hover:text-accent-cyan truncate"
                    >
                      <Mail size={14} className="text-dark-500 shrink-0" />
                      <span className="truncate">{nurse.email}</span>
                    </a>
                    {nurse.phone && (
                      <a
                        href={`tel:${nurse.phone}`}
                        className="flex items-center gap-2 text-sm text-dark-400 hover:text-accent-cyan"
                      >
                        <Phone size={14} className="text-dark-500 shrink-0" /> {nurse.phone}
                      </a>
                    )}
                    {nurse.experience_years != null && (
                      <div className="flex items-center gap-2 text-sm text-dark-400">
                        <Award size={14} className="text-dark-500 shrink-0" />
                        {nurse.experience_years} year{nurse.experience_years !== 1 ? 's' : ''} experience
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-dark-400">
                      <Calendar size={14} className="text-accent-cyan shrink-0" />
                      {nurseBookings.length} booking{nurseBookings.length !== 1 ? 's' : ''} assigned
                    </div>
                    {!nurse.is_password_reset && (
                      <div className="flex items-center gap-2 text-xs text-amber-400">
                        <KeyRound size={13} className="shrink-0" />
                        Still on temporary password
                      </div>
                    )}
                    {!nurse.is_active && (
                      <p className="text-xs text-dark-500">
                        Hidden after refresh - the server only lists active nurses.
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 pt-4 border-t border-dark-700">
                    {nurse.phone && (
                      <a
                        href={`tel:${nurse.phone}`}
                        className="flex-1 py-2 bg-dark-800 hover:bg-dark-700 rounded-lg text-sm text-dark-300 flex items-center justify-center gap-2"
                      >
                        <Phone size={14} /> Call
                      </a>
                    )}
                    <button
                      onClick={() => setBookingModalNurse({ ...nurse, bookings: nurseBookings })}
                      className="flex-1 py-2 bg-accent-cyan/10 hover:bg-accent-cyan/20 rounded-lg text-sm text-accent-cyan flex items-center justify-center gap-2"
                    >
                      <Calendar size={14} /> View Bookings
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="p-2 rounded-lg border border-dark-700 hover:bg-dark-800 disabled:opacity-50"
            >
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setCurrentPage(p)}
                className={`w-9 h-9 rounded-lg text-sm font-medium ${
                  page === p
                    ? 'bg-accent-cyan text-dark-900'
                    : 'border border-dark-700 hover:bg-dark-800 text-dark-400'
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="p-2 rounded-lg border border-dark-700 hover:bg-dark-800 disabled:opacity-50"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </>
      )}

      {/* View Bookings Modal */}
      {bookingModalNurse && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setBookingModalNurse(null)}>
          <div className="bg-dark-900 border border-dark-700 rounded-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-dark-700">
              <div>
                <h3 className="font-bold text-dark-100 text-lg">Bookings for {bookingModalNurse.name}</h3>
                <p className="text-sm text-dark-500">Assigned bookings</p>
              </div>
              <button onClick={() => setBookingModalNurse(null)} className="p-2 rounded-lg hover:bg-dark-800 text-dark-400">
                <X size={18} />
              </button>
            </div>
            <div className="p-5 space-y-3">
              {bookingModalNurse.bookings.length === 0 && (
                <p className="text-sm text-dark-500">No bookings assigned yet.</p>
              )}
              {bookingModalNurse.bookings.map((b) => (
                <div key={b.booking_id} className="bg-dark-800/50 rounded-xl p-4 border border-dark-700/50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-dark-200 font-medium">
                      <User size={14} className="text-accent-cyan" />
                      {b.booked_by_name || `User #${b.user_id}`}
                    </div>
                    <span className="badge bg-dark-600 text-dark-400">{b.status}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-dark-500">
                    <Calendar size={12} />
                    {new Date(b.slot_start).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </div>
                  {(b.custom_address || b.service_address) && (
                    <div className="flex items-center gap-2 text-xs text-dark-500 mt-1">
                      <MapPin size={12} />
                      {b.custom_address || b.service_address}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Nurse Modal */}
      {showFormModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={closeForm}>
          <div className="bg-dark-900 border border-dark-700 rounded-2xl w-full max-w-md max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-dark-700">
              <h3 className="font-bold text-dark-100 text-lg">{editTarget ? 'Edit Nurse' : 'Add Nurse'}</h3>
              <button onClick={closeForm} className="p-2 rounded-lg hover:bg-dark-800 text-dark-400">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-sm text-dark-500 mb-2">Full Name</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  placeholder="e.g. Priya Sharma"
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm text-dark-500 mb-2">Email</label>
                <input
                  required
                  type="email"
                  disabled={!!editTarget}
                  value={form.email}
                  onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                  placeholder="nurse@example.com"
                  className="input-field disabled:opacity-60 disabled:cursor-not-allowed"
                />
                {editTarget && (
                  <p className="text-xs text-dark-500 mt-1">Email is the nurse login and cannot be changed.</p>
                )}
              </div>
              <div>
                <label className="block text-sm text-dark-500 mb-2">Phone</label>
                <input
                  required
                  value={form.phone}
                  onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                  placeholder="9999999999"
                  className="input-field"
                />
              </div>
              {!editTarget && (
                <div>
                  <label className="block text-sm text-dark-500 mb-2">Temporary Password</label>
                  <input
                    required
                    type="password"
                    minLength={8}
                    value={form.password}
                    onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                    placeholder="At least 8 characters"
                    className="input-field"
                  />
                  <p className="text-xs text-dark-500 mt-1">
                    The nurse signs in with this and is prompted to set their own password.
                  </p>
                </div>
              )}
              <div>
                <label className="block text-sm text-dark-500 mb-2">Specialization (optional)</label>
                <input
                  value={form.specialization}
                  onChange={(e) => setForm((p) => ({ ...p, specialization: e.target.value }))}
                  placeholder="e.g. General Care, ICU, Paediatrics"
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm text-dark-500 mb-2">Experience (years, optional)</label>
                <input
                  type="number"
                  min="0"
                  value={form.experience_years}
                  onChange={(e) => setForm((p) => ({ ...p, experience_years: e.target.value }))}
                  placeholder="3"
                  className="input-field"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {submitting
                  ? <><LoaderIcon size={18} className="animate-spin" /> Saving...</>
                  : <><Plus size={18} /> {editTarget ? 'Update Nurse' : 'Create Nurse'}</>}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Nurses
