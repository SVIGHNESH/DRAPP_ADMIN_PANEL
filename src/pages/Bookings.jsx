// import React, { useState } from 'react'
import React, { useState, useEffect } from "react";
import { Search, Filter, Plus, Calendar, Clock, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { bookingsData as initialBookings, nursesData, getStatusColor } from '../data/mockData'

import toast from "react-hot-toast";

import Loader from "../components/Loader";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";

// Future API
import { getBookings } from "../api/bookings";

const emptyForm = { userName: '', nurse: '', careType: '', date: '', time: '', type: '', address: '' }

const Bookings = () => {
  // const [bookings, setBookings] = useState(initialBookings)
  const [bookings, setBookings] = useState([]);

const [loading, setLoading] = useState(false);

const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [showAddModal, setShowAddModal] = useState(false)
  const [form, setForm] = useState(emptyForm)

  const filtered = bookings.filter(b => {
    const matchesSearch = b.userName.toLowerCase().includes(searchQuery.toLowerCase()) || b.nurse.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const itemsPerPage = 5
  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const loadBookings = async () => {
  try {
    setLoading(true);
    setError(null);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Backend Ready
    // const response = await getBookings();
    // setBookings(response.data);

    setBookings(initialBookings);

  } catch (err) {
    console.error(err);
    setError("Bookings data is not available.");
    toast.error("Unable to load bookings.");
  } finally {
    setLoading(false);
  }
};
useEffect(() => {
  loadBookings();
}, []);

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleAddBooking = (e) => {
    e.preventDefault()
    if (!form.userName || !form.nurse || !form.date || !form.time) return
    const initials = form.userName.trim().split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    const newBooking = {
      id: Date.now(),
      userName: form.userName,
      userId: `US-${String(bookings.length + 1).padStart(3, '0')}`,
      nurse: form.nurse,
      careType: form.careType || 'General Nursing',
      date: form.date,
      time: form.time,
      status: 'pending',
      type: form.type || 'New Booking',
      avatar: initials || 'NB',
      address: form.address || '—',
    }
    setBookings(prev => [newBooking, ...prev])
    setForm(emptyForm)
    setShowAddModal(false)
    setCurrentPage(1)
  }

  if (loading) {
  return <Loader />;
}
if (error) {
  return (
    <ErrorState
      message={error}
      onRetry={loadBookings}
    />
  );
}

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="page-title">Bookings</h1><p className="text-dark-500 mt-1">Manage all caretaker bookings</p></div>
        <button onClick={() => setShowAddModal(true)} className="btn-primary flex items-center gap-2"><Plus size={18} /> New Booking</button>
      </div>

      <div className="card p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500" size={18} />
            <input type="text" placeholder="Search bookings..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="input-field pl-10" />
          </div>
          <div className="flex items-center gap-3">
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input-field w-40">
              <option value="all">All Status</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            {/* <button className="btn-secondary flex items-center gap-2"><Filter size={16} /> Filter</button> */}
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
                <th className="table-header">Type</th>
                <th className="table-header">Status</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((b) => (
                <tr key={b.id} className="border-b border-dark-700/50 hover:bg-dark-800/30">
                  <td className="table-cell">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-cyan to-accent-teal flex items-center justify-center text-dark-900 text-sm font-bold">{b.avatar}</div>
                      <div><p className="font-medium text-dark-200">{b.userName}</p><p className="text-xs text-dark-500">{b.userId}</p></div>
                    </div>
                  </td>
                  <td className="table-cell text-dark-300">{b.nurse}</td>
                  <td className="table-cell text-dark-400">{b.careType}</td>
                  <td className="table-cell">
                    <div className="flex items-center gap-2 text-dark-300"><Calendar size={14} className="text-dark-500" />{b.date}</div>
                    <div className="flex items-center gap-2 text-dark-500 text-xs mt-1"><Clock size={14} />{b.time}</div>
                  </td>
                  <td className="table-cell text-dark-400">{b.type}</td>
                  <td className="table-cell"><span className={`badge ${getStatusColor(b.status)}`}>{b.status}</span></td>
                </tr>
              ))}
              {paginated.length === 0 ? (
  <tr>
    <td colSpan="6">
      <EmptyState message="Bookings data is not available." />
    </td>
  </tr>
) : (
  paginated.map((b) => (
    <tr key={b.id} className="border-b border-dark-700/50 hover:bg-dark-800/30">
      ...
    </tr>
  ))
)}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between mt-6 pt-4 border-t border-dark-700">
          <p className="text-sm text-dark-500">Showing {filtered.length === 0 ? 0 : ((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filtered.length)} of {filtered.length} results</p>
          <div className="flex items-center gap-2">
            <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="p-2 rounded-lg border border-dark-700 hover:bg-dark-800 disabled:opacity-50"><ChevronLeft size={16} /></button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button key={page} onClick={() => setCurrentPage(page)} className={`w-9 h-9 rounded-lg text-sm font-medium ${currentPage === page ? 'bg-accent-cyan text-dark-900' : 'border border-dark-700 hover:bg-dark-800 text-dark-400'}`}>{page}</button>
            ))}
            <button onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="p-2 rounded-lg border border-dark-700 hover:bg-dark-800 disabled:opacity-50"><ChevronRight size={16} /></button>
          </div>
        </div>
      </div>

      {/* New Booking Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowAddModal(false)}>
          <div className="bg-dark-900 border border-dark-700 rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-dark-700">
              <h3 className="font-bold text-dark-100 text-lg">New Booking</h3>
              <button onClick={() => setShowAddModal(false)} className="p-2 rounded-lg hover:bg-dark-800 text-dark-400"><X size={18} /></button>
            </div>
            <form onSubmit={handleAddBooking} className="p-5 space-y-4">
              <div>
                <label className="block text-sm text-dark-500 mb-2">User Name</label>
                <input required name="userName" value={form.userName} onChange={handleChange} placeholder="e.g. Sarah Johnson" className="input-field" />
              </div>
              <div>
                <label className="block text-sm text-dark-500 mb-2">Select Nurse</label>
                <select required name="nurse" value={form.nurse} onChange={handleChange} className="input-field">
                  <option value="">Choose a nurse</option>
                  {nursesData.map(n => <option key={n.id} value={n.name}>{n.name} — {n.careType}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-dark-500 mb-2">Care Type</label>
                <input name="careType" value={form.careType} onChange={handleChange} placeholder="e.g. Elderly Care" className="input-field" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-dark-500 mb-2">Date</label>
                  <input required type="date" name="date" value={form.date} onChange={handleChange} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm text-dark-500 mb-2">Time</label>
                  <input required type="time" name="time" value={form.time} onChange={handleChange} className="input-field" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-dark-500 mb-2">Address</label>
                <input name="address" value={form.address} onChange={handleChange} placeholder="e.g. Sector 12, Bareilly" className="input-field" />
              </div>
              <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2"><Plus size={18} /> Add Booking</button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Bookings
