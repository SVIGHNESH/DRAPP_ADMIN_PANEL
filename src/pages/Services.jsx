import React, { useState, useEffect, useCallback } from "react"
import { Loader2, Plus } from 'lucide-react'
import toast from "react-hot-toast"

import { getServices, createService } from '../api/services'
import { getErrorMessage } from '../utils/apiError'
import PageHeader from "../components/PageHeader"
import ErrorState from "../components/ErrorState"
import EmptyState from "../components/EmptyState"
import Pagination from "../components/Pagination"
import SearchInput from "../components/SearchInput"
import StatusBadge from "../components/StatusBadge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Dialog, DialogBody, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"

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

  return (
    <>
      <PageHeader
        title="Services"
        description="Healthcare services offered to patients. Services can be added but not edited or removed."
        actions={
          <Button onClick={openAdd}>
            <Plus /> Add service
          </Button>
        }
      />

      {loading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2, 3, 4, 5].map((i) => <Skeleton key={i} className="h-[124px]" />)}
        </div>
      ) : error ? (
        <ErrorState message={error} onRetry={loadData} />
      ) : (
        <div className="flex flex-col gap-4">
          <SearchInput
            className="max-w-xs"
            placeholder="Search services..."
            aria-label="Search services"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1) }}
          />

          {filtered.length === 0 ? (
            <Card>
              <EmptyState message="No services found. Create your first service to get started." />
            </Card>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {paginated.map((service) => (
                  <Card
                    key={service.service_id}
                    className={`flex flex-col p-4 ${service.active ? '' : 'opacity-70'}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h2 className="text-sm font-semibold text-fg">{service.name}</h2>
                      {/* Read from the row, not hardcoded. The listing is
                          expected to return active services only, so this
                          should always say Active - but a badge that cannot
                          say anything else is decoration, not a status. */}
                      <StatusBadge tone={service.active ? 'success' : 'neutral'}>
                        {service.active ? 'Active' : 'Inactive'}
                      </StatusBadge>
                    </div>

                    {service.description && (
                      <p className="mt-1.5 line-clamp-2 text-xs text-fg-muted">{service.description}</p>
                    )}

                    <div className="mt-auto flex items-baseline gap-1 pt-4">
                      <span className="text-base font-medium text-fg tabular-nums">₹{service.base_price}</span>
                      <span className="text-xs text-fg-muted">/hour</span>
                    </div>
                  </Card>
                ))}
              </div>

              <Pagination
                page={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                className="justify-center"
              />
            </>
          )}
        </div>
      )}

      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add service</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="contents">
            <DialogBody className="flex flex-col gap-4">
              <Field>
                <FieldLabel htmlFor="service-name">Service name</FieldLabel>
                <Input
                  id="service-name"
                  required
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  placeholder="e.g. Doctor Consultation"
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="service-description">Description</FieldLabel>
                <Textarea
                  id="service-description"
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  placeholder="Brief description of the service"
                  rows={3}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="service-price">Base price (₹ per hour)</FieldLabel>
                <Input
                  id="service-price"
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  value={form.base_price}
                  onChange={(e) => setForm((p) => ({ ...p, base_price: e.target.value }))}
                  placeholder="0.00"
                  className="tabular-nums"
                />
              </Field>
            </DialogBody>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowAddModal(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting && <Loader2 className="animate-spin" />}
                {submitting ? 'Saving...' : 'Create service'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default Services
