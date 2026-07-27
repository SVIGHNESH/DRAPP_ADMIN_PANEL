// import React, { useState } from 'react'
import { Search, Plus, Star, Phone, Mail, Calendar, MapPin, X, ChevronLeft, ChevronRight, Users, Clock, User, Trash2, AlertTriangle } from 'lucide-react'
import { nursesData as initialNurses, bookingsData } from '../data/mockData'
import React, { useState, useEffect } from "react";
import {
  bookingsData as initialBookings,
  nursesData,
  getStatusColor,
} from "../data/mockData";

import toast from "react-hot-toast";
import Loader from "../components/Loader";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";

// Future API
import { getBookings } from "../api/bookings";
const emptyForm = { name: '', gender: 'Female', careType: '', experience: '', phone: '', email: '', availability: '', address: '' }

const Nurses = () => {
  // const [nurses, setNurses] = useState(initialNurses)
  const [nurses, setNurses] = useState(nursesData);
  const [searchQuery, setSearchQuery] = useState('')
  const [careFilter, setCareFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [bookingModalNurse, setBookingModalNurse] = useState(null)
  const [locationModalNurse, setLocationModalNurse] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [deleteModalNurse, setDeleteModalNurse] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
const [bookings, setBookings] = useState(initialBookings);

  const careTypes = ['all', ...new Set(nurses.map(n => n.careType))]
  const filtered = nurses.filter(nurse => {
    const matchesSearch = nurse.name.toLowerCase().includes(searchQuery.toLowerCase()) || nurse.careType.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCare = careFilter === 'all' || nurse.careType === careFilter
    return matchesSearch && matchesCare
  })

  const itemsPerPage = 6
  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const bookingsForNurse = (nurseName) => bookingsData.filter(b => b.nurse === nurseName)
  const loadBookings = async () => {
  try {
    setLoading(true);
    setError(null);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Future Backend
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
//   const loadBookings = async () => {
//   try {
//     setLoading(true);
//     setError(null);

//     await new Promise((resolve) => setTimeout(resolve, 1000));

//     // Future Backend
//     // const response = await getBookings();
//     // setBookings(response.data);

//     setBookings(initialBookings);

//   } catch (err) {
//     console.error(err);
//     setError("Bookings data is not available.");
//     toast.error("Unable to load bookings.");
//   } finally {
//     setLoading(false);
//   }
// };

  const handleAddNurse = (e) => {
    e.preventDefault()
    if (!form.name || !form.careType) return
    const initials = form.name.trim().split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    const newNurse = {
      id: Date.now(),
      name: form.name,
      gender: form.gender,
      careType: form.careType,
      experience: form.experience || '0 years',
      rating: 4.5,
      clients: 0,
      status: 'active',
      avatar: initials || 'NN',
      availability: form.availability || 'Not set',
      phone: form.phone || '+91 00000 00000',
      email: form.email || 'not-set@example.com',
      location: { address: form.address || 'Not set', lastUpdated: 'just now' },
    }
    setNurses(prev => [newNurse, ...prev])
    setForm(emptyForm)
    setShowAddModal(false)
    setCurrentPage(1)
  }

  const handleDeleteNurse = () => {
    if (!deleteModalNurse) return
    setNurses(prev => prev.filter(n => n.id !== deleteModalNurse.id))
    if (bookingModalNurse?.id === deleteModalNurse.id) setBookingModalNurse(null)
    if (locationModalNurse?.id === deleteModalNurse.id) setLocationModalNurse(null)
    setDeleteModalNurse(null)
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
        <div><h1 className="page-title">Nurses</h1><p className="text-dark-500 mt-1">Manage caretaker nurses and their bookings</p></div>
        <button onClick={() => setShowAddModal(true)} className="btn-primary flex items-center gap-2"><Plus size={18} /> Add Nurse</button>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500" size={18} />
          <input type="text" placeholder="Search nurses..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="input-field pl-10" />
        </div>
        <select value={careFilter} onChange={(e) => setCareFilter(e.target.value)} className="input-field w-56">
          {careTypes.map(c => <option key={c} value={c}>{c === 'all' ? 'All Care Types' : c}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginated.map((nurse) => (
          <div key={nurse.id} className="card p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-cyan to-accent-teal flex items-center justify-center text-dark-900 text-xl font-bold">{nurse.avatar}</div>
              <div className="flex flex-col items-end gap-2">
                <button onClick={() => setDeleteModalNurse(nurse)} className="p-1.5 rounded-lg hover:bg-rose-500/10 text-dark-500 hover:text-rose-400" title="Delete nurse"><Trash2 size={16} /></button>
                <div className={`badge ${nurse.status === 'active' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-amber-500/15 text-amber-400'}`}>{nurse.status}</div>
                <div className={`badge ${nurse.gender === 'Female' ? 'bg-pink-500/15 text-pink-400' : 'bg-cyan-500/15 text-cyan-400'}`}>{nurse.gender}</div>
              </div>
            </div>
            <h3 className="font-bold text-dark-100 text-lg mb-1">{nurse.name}</h3>
            <p className="text-accent-cyan font-medium text-sm mb-3">{nurse.careType}</p>
            <div className="flex items-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => <Star key={i} size={14} className={i < Math.floor(nurse.rating) ? 'text-amber-400 fill-amber-400' : 'text-dark-600'} />)}
              <span className="text-sm text-dark-400 ml-1">{nurse.rating}</span>
            </div>
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-dark-400"><Star size={14} className="text-accent-cyan" />{nurse.experience} experience</div>
              <div className="flex items-center gap-2 text-sm text-dark-400"><Users size={14} className="text-accent-teal" />{nurse.clients} clients cared for</div>
              <div className="flex items-center gap-2 text-sm text-dark-400"><Calendar size={14} className="text-accent-amber" />{nurse.availability}</div>
              <div className="flex items-center gap-2 text-sm text-dark-400"><MapPin size={14} className="text-accent-rose" />{nurse.location.address}</div>
            </div>
            <div className="flex items-center gap-2 pt-4 border-t border-dark-700">
              <a href={`tel:${nurse.phone}`} className="flex-1 py-2 bg-dark-800 hover:bg-dark-700 rounded-lg text-sm text-dark-300 flex items-center justify-center gap-2"><Phone size={14} /> Call</a>
              <a href={`mailto:${nurse.email}`} className="flex-1 py-2 bg-dark-800 hover:bg-dark-700 rounded-lg text-sm text-dark-300 flex items-center justify-center gap-2"><Mail size={14} /> Email</a>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <button onClick={() => setBookingModalNurse(nurse)} className="flex-1 py-2 bg-accent-cyan/10 hover:bg-accent-cyan/20 rounded-lg text-sm text-accent-cyan flex items-center justify-center gap-2"><Calendar size={14} /> View Booking</button>
              <button onClick={() => setLocationModalNurse(nurse)} className="flex-1 py-2 bg-accent-teal/10 hover:bg-accent-teal/20 rounded-lg text-sm text-accent-teal flex items-center justify-center gap-2"><MapPin size={14} /> Track Location</button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center gap-2">
        <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="p-2 rounded-lg border border-dark-700 hover:bg-dark-800 disabled:opacity-50"><ChevronLeft size={16} /></button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
          <button key={page} onClick={() => setCurrentPage(page)} className={`w-9 h-9 rounded-lg text-sm font-medium ${currentPage === page ? 'bg-accent-cyan text-dark-900' : 'border border-dark-700 hover:bg-dark-800 text-dark-400'}`}>{page}</button>
        ))}
        <button onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="p-2 rounded-lg border border-dark-700 hover:bg-dark-800 disabled:opacity-50"><ChevronRight size={16} /></button>
      </div>

      {/* View Booking Modal */}
      {bookingModalNurse && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setBookingModalNurse(null)}>
          <div className="bg-dark-900 border border-dark-700 rounded-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-dark-700">
              <div>
                <h3 className="font-bold text-dark-100 text-lg">Bookings for {bookingModalNurse.name}</h3>
                <p className="text-sm text-dark-500">Who has booked this nurse</p>
              </div>
              <button onClick={() => setBookingModalNurse(null)} className="p-2 rounded-lg hover:bg-dark-800 text-dark-400"><X size={18} /></button>
            </div>
            <div className="p-5 space-y-3">
              {bookingsForNurse(bookingModalNurse.name).length === 0 && (
                <p className="text-sm text-dark-500">No bookings found for this nurse yet.</p>
              )}
              {bookingsForNurse(bookingModalNurse.name).map((b) => (
                <div key={b.id} className="bg-dark-800/50 rounded-xl p-4 border border-dark-700/50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-dark-200 font-medium"><User size={14} className="text-accent-cyan" />{b.userName}</div>
                    <span className={`badge ${b.status === 'confirmed' ? 'bg-emerald-500/15 text-emerald-400' : b.status === 'pending' ? 'bg-amber-500/15 text-amber-400' : b.status === 'cancelled' ? 'bg-rose-500/15 text-rose-400' : 'bg-dark-600 text-dark-400'}`}>{b.status}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-dark-500 mb-1"><Calendar size={12} />{b.date} <Clock size={12} className="ml-2" />{b.time}</div>
                  <div className="flex items-center gap-2 text-xs text-dark-500"><MapPin size={12} />{b.address}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Track Location Modal */}
      {locationModalNurse && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setLocationModalNurse(null)}>
          <div className="bg-dark-900 border border-dark-700 rounded-2xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-dark-700">
              <div>
                <h3 className="font-bold text-dark-100 text-lg">Live Location</h3>
                <p className="text-sm text-dark-500">{locationModalNurse.name}</p>
              </div>
              <button onClick={() => setLocationModalNurse(null)} className="p-2 rounded-lg hover:bg-dark-800 text-dark-400"><X size={18} /></button>
            </div>
            <div className="p-5">
              <div className="h-40 rounded-xl bg-dark-800 border border-dark-700 flex items-center justify-center mb-4 relative overflow-hidden">
                <div className="w-3 h-3 rounded-full bg-accent-cyan animate-ping absolute" />
                <div className="w-3 h-3 rounded-full bg-accent-cyan absolute" />
                <span className="text-xs text-dark-500 absolute bottom-2">Map preview</span>
              </div>
              <div className="flex items-center gap-2 text-dark-200 mb-1"><MapPin size={16} className="text-accent-rose" />{locationModalNurse.location.address}</div>
              <p className="text-xs text-dark-500">Last updated: {locationModalNurse.location.lastUpdated}</p>
              <div className="mt-4 flex items-center gap-2 text-emerald-400 text-sm"><span className="w-2 h-2 rounded-full bg-emerald-400" /> Live tracking active</div>
            </div>
          </div>
        </div>
      )}
      {/* Add Nurse Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowAddModal(false)}>
          <div className="bg-dark-900 border border-dark-700 rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-dark-700">
              <h3 className="font-bold text-dark-100 text-lg">Add Nurse</h3>
              <button onClick={() => setShowAddModal(false)} className="p-2 rounded-lg hover:bg-dark-800 text-dark-400"><X size={18} /></button>
            </div>
            <form onSubmit={handleAddNurse} className="p-5 space-y-4">
              <div>
                <label className="block text-sm text-dark-500 mb-2">Full Name</label>
                <input required name="name" value={form.name} onChange={handleChange} placeholder="e.g. Kavita Rao" className="input-field" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-dark-500 mb-2">Gender</label>
                  <select name="gender" value={form.gender} onChange={handleChange} className="input-field">
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-dark-500 mb-2">Experience</label>
                  <input name="experience" value={form.experience} onChange={handleChange} placeholder="e.g. 4 years" className="input-field" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-dark-500 mb-2">Care Type</label>
                <input required name="careType" value={form.careType} onChange={handleChange} placeholder="e.g. Elderly Care" className="input-field" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-dark-500 mb-2">Phone</label>
                  <input name="phone" value={form.phone} onChange={handleChange} placeholder="+91 90000 00000" className="input-field" />
                </div>
                <div>
                  <label className="block text-sm text-dark-500 mb-2">Email</label>
                  <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="name@example.com" className="input-field" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-dark-500 mb-2">Availability</label>
                <input name="availability" value={form.availability} onChange={handleChange} placeholder="e.g. Mon-Fri, 9AM-5PM" className="input-field" />
              </div>
              <div>
                <label className="block text-sm text-dark-500 mb-2">Location / Address</label>
                <input name="address" value={form.address} onChange={handleChange} placeholder="e.g. Sector 12, Bareilly" className="input-field" />
              </div>
              <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2"><Plus size={18} /> Add Nurse</button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteModalNurse && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setDeleteModalNurse(null)}>
          <div className="bg-dark-900 border border-dark-700 rounded-2xl w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 text-center">
              <div className="w-14 h-14 rounded-full bg-rose-500/15 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle size={26} className="text-rose-400" />
              </div>
              <h3 className="font-bold text-dark-100 text-lg mb-1">Delete Nurse?</h3>
              <p className="text-sm text-dark-500 mb-6">Are you sure you want to remove <span className="text-dark-300 font-medium">{deleteModalNurse.name}</span>? This action cannot be undone.</p>
              <div className="flex items-center gap-3">
                <button onClick={() => setDeleteModalNurse(null)} className="flex-1 py-2.5 bg-dark-800 hover:bg-dark-700 rounded-xl text-sm text-dark-300 font-medium">Cancel</button>
                <button onClick={handleDeleteNurse} className="flex-1 py-2.5 bg-rose-500 hover:bg-rose-600 rounded-xl text-sm text-white font-medium">Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Nurses
