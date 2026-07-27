import React, { useState, useEffect, useCallback } from "react"
import { Search, Phone, Calendar, MapPin, X, ChevronLeft, ChevronRight, User, Plus, Trash2, AlertTriangle } from 'lucide-react'
import { getBookings } from '../api/bookings'
import { getErrorMessage } from '../utils/apiError'
import { getLocalNurses, addLocalNurse, removeLocalNurse } from '../utils/localNurses'

import Loader from "../components/Loader"
import ErrorState from "../components/ErrorState"
import EmptyState from "../components/EmptyState"

const Nurses = () => {
  const [derivedNurses, setDerivedNurses] = useState([])
  const [localNurses, setLocalNurses] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [bookingModalNurse, setBookingModalNurse] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [addForm, setAddForm] = useState({ name: '', contact: '' })
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const itemsPerPage = 6

  const refreshLocal = useCallback(() => {
    setLocalNurses(getLocalNurses())
  }, [])

  const loadData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await getBookings()
      const bookings = res.data || []

      const nurseMap = {}
      bookings.forEach((b) => {
        if (b.assigned_nurse) {
          const name = b.assigned_nurse.nurse_name
          if (!nurseMap[name]) {
            nurseMap[name] = {
              name,
              contact: b.assigned_nurse.nurse_contact,
              bookingCount: 0,
              bookings: [],
            }
          }
          nurseMap[name].bookingCount++
          nurseMap[name].bookings.push(b)
        }
      })

      const sorted = Object.values(nurseMap).sort((a, b) => b.bookingCount - a.bookingCount)
      setDerivedNurses(sorted)
      refreshLocal()
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [refreshLocal])

  useEffect(() => {
    loadData()
  }, [loadData])

  const allNurses = [
    ...localNurses.map((n) => ({
      name: n.name,
      contact: n.contact,
      bookingCount: 0,
      bookings: [],
      _local: true,
      _localId: n.id,
    })),
    ...derivedNurses,
  ]

  const filtered = allNurses.filter((n) =>
    n.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const handleAdd = (e) => {
    e.preventDefault()
    if (!addForm.name.trim()) return
    const ok = addLocalNurse(addForm.name.trim(), addForm.contact.trim() || null)
    if (!ok) {
      return
    }
    refreshLocal()
    setAddForm({ name: '', contact: '' })
    setShowAddModal(false)
    setCurrentPage(1)
  }

  const handleDelete = () => {
    if (!deleteTarget) return
    removeLocalNurse(deleteTarget._localId)
    refreshLocal()
    setDeleteTarget(null)
  }

  if (loading) return <Loader />
  if (error) return <ErrorState message={error} onRetry={loadData} />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Nurses</h1>
          <p className="text-dark-500 mt-1">
            Nurses assigned to bookings and locally-managed staff list.
          </p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="btn-primary flex items-center gap-2">
          <Plus size={18} /> Add Nurse
        </button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500" size={18} />
        <input
          type="text"
          placeholder="Search nurses..."
          value={searchQuery}
          onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1) }}
          className="input-field pl-10"
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState message="No nurses found. Add one or assign a nurse when confirming a booking." />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginated.map((nurse) => {
              const initials = nurse.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
              return (
                <div key={nurse._localId || nurse.name} className="card p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-cyan to-accent-teal flex items-center justify-center text-dark-900 text-xl font-bold">
                      {initials}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {nurse._local && (
                        <button
                          onClick={() => setDeleteTarget(nurse)}
                          className="p-1.5 rounded-lg hover:bg-rose-500/10 text-dark-500 hover:text-rose-400"
                          title="Remove nurse"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                      {nurse._local && (
                        <span className="badge bg-dark-600 text-dark-400 text-xs">Local</span>
                      )}
                    </div>
                  </div>
                  <h3 className="font-bold text-dark-100 text-lg mb-1">{nurse.name}</h3>
                  {nurse.contact && (
                    <a href={`tel:${nurse.contact}`} className="text-accent-cyan font-medium text-sm mb-3 block hover:underline">
                      {nurse.contact}
                    </a>
                  )}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-dark-400">
                      <Calendar size={14} className="text-accent-cyan" />
                      {nurse.bookingCount} booking{nurse.bookingCount !== 1 ? 's' : ''} assigned
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pt-4 border-t border-dark-700">
                    {nurse.contact ? (
                      <a href={`tel:${nurse.contact}`} className="flex-1 py-2 bg-dark-800 hover:bg-dark-700 rounded-lg text-sm text-dark-300 flex items-center justify-center gap-2">
                        <Phone size={14} /> Call
                      </a>
                    ) : null}
                    <button
                      onClick={() => setBookingModalNurse(nurse)}
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
        </>
      )}

      {/* View Booking Modal */}
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
                      User #{b.user_id}
                    </div>
                    <span className="badge bg-dark-600 text-dark-400">{b.status}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-dark-500">
                    <Calendar size={12} />
                    {new Date(b.slot_start).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </div>
                  {b.custom_address && (
                    <div className="flex items-center gap-2 text-xs text-dark-500 mt-1">
                      <MapPin size={12} />
                      {b.custom_address}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add Nurse Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowAddModal(false)}>
          <div className="bg-dark-900 border border-dark-700 rounded-2xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-dark-700">
              <h3 className="font-bold text-dark-100 text-lg">Add Nurse</h3>
              <button onClick={() => setShowAddModal(false)} className="p-2 rounded-lg hover:bg-dark-800 text-dark-400">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleAdd} className="p-5 space-y-4">
              <div>
                <label className="block text-sm text-dark-500 mb-2">Nurse Name</label>
                <input
                  required
                  value={addForm.name}
                  onChange={(e) => setAddForm((p) => ({ ...p, name: e.target.value }))}
                  placeholder="e.g. Priya Sharma"
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm text-dark-500 mb-2">Contact (optional)</label>
                <input
                  value={addForm.contact}
                  onChange={(e) => setAddForm((p) => ({ ...p, contact: e.target.value }))}
                  placeholder="+91 90000 00000"
                  className="input-field"
                />
              </div>
              <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
                <Plus size={18} /> Add Nurse
              </button>
              <p className="text-xs text-dark-500 text-center">
                Added nurses are stored locally and will appear in the booking confirm dropdown.
              </p>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setDeleteTarget(null)}>
          <div className="bg-dark-900 border border-dark-700 rounded-2xl w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 text-center">
              <div className="w-14 h-14 rounded-full bg-rose-500/15 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle size={26} className="text-rose-400" />
              </div>
              <h3 className="font-bold text-dark-100 text-lg mb-1">Remove Nurse?</h3>
              <p className="text-sm text-dark-500 mb-6">
                Remove <span className="text-dark-300 font-medium">{deleteTarget.name}</span> from the local list?
              </p>
              <div className="flex items-center gap-3">
                <button onClick={() => setDeleteTarget(null)} className="flex-1 py-2.5 bg-dark-800 hover:bg-dark-700 rounded-xl text-sm text-dark-300 font-medium">Cancel</button>
                <button onClick={handleDelete} className="flex-1 py-2.5 bg-rose-500 hover:bg-rose-600 rounded-xl text-sm text-white font-medium">Remove</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Nurses
