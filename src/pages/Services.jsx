import React, { useState, useEffect, useCallback } from "react"
import { Search, Plus, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { getServices, createService } from '../api/services'
import { getErrorMessage } from '../utils/apiError'
import toast from "react-hot-toast"

import Loader from "../components/Loader"
import ErrorState from "../components/ErrorState"
import EmptyState from "../components/EmptyState"

const Services = () => {
  const [services, setServices] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [showAddModal, setShowAddModal] = useState(false)
  const [form, setForm] = useState({ name: '', description: '', base_price: '' })
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const itemsPerPage = 6

  const loadData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await getServices()
      setServices(res.data || [])
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const filtered = services.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const resetForm = () => setForm({ name: '', description: '', base_price: '' })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) return
    setSubmitting(true)
    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim() || null,
        base_price: parseFloat(form.base_price) || 0,
        active: true,
      }

      await createService(payload)
      toast.success("Service created")

      resetForm()
      setShowAddModal(false)
      await loadData()
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  const openAdd = () => {
    resetForm()
    setShowAddModal(true)
  }

  if (loading) return <Loader />
  if (error) return <ErrorState message={error} onRetry={loadData} />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Services</h1>
          <p className="text-dark-500 mt-1">
            Healthcare services offered to patients. Services can be added but not edited or removed.
          </p>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2">
          <Plus size={18} /> Add Service
        </button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500" size={18} />
        <input
          type="text"
          placeholder="Search services..."
          value={searchQuery}
          onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1) }}
          className="input-field pl-10"
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState message="No services found. Create your first service to get started." />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginated.map((service) => (
              <div key={service.service_id} className="card p-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-cyan to-accent-teal flex items-center justify-center text-dark-900 text-xl font-bold mb-4">
                  {service.name.charAt(0).toUpperCase()}
                </div>

                <h3 className="font-bold text-dark-100 text-lg mb-1">{service.name}</h3>
                {service.description && (
                  <p className="text-sm text-dark-400 mb-3 line-clamp-2">{service.description}</p>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-dark-700">
                  <span className="text-lg font-bold text-accent-cyan">
                    ₹{service.base_price}
                    <span className="text-xs font-normal text-dark-500"> /hour</span>
                  </span>
                  <span className="badge bg-emerald-500/10 text-emerald-400">Active</span>
                </div>
              </div>
            ))}
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

      {/* Add Service Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowAddModal(false)}>
          <div className="bg-dark-900 border border-dark-700 rounded-2xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-dark-700">
              <h3 className="font-bold text-dark-100 text-lg">Add Service</h3>
              <button onClick={() => setShowAddModal(false)} className="p-2 rounded-lg hover:bg-dark-800 text-dark-400">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-sm text-dark-500 mb-2">Service Name</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  placeholder="e.g. Doctor Consultation"
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm text-dark-500 mb-2">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  placeholder="Brief description of the service"
                  rows={3}
                  className="input-field resize-none"
                />
              </div>
              <div>
                <label className="block text-sm text-dark-500 mb-2">Base Price (₹ per hour)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  value={form.base_price}
                  onChange={(e) => setForm((p) => ({ ...p, base_price: e.target.value }))}
                  placeholder="0.00"
                  className="input-field"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {submitting ? 'Saving...' : 'Create Service'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Services