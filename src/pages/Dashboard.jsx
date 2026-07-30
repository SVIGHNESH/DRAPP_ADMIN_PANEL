import React, { useState, useEffect, useCallback } from 'react'
import { ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import StatCard from '../components/StatCard'
import PageHeader from '../components/PageHeader'
import ErrorState from '../components/ErrorState'
import EmptyState from '../components/EmptyState'
import { getBookings } from '../api/bookings'
import { getErrorMessage } from '../utils/apiError'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

const DashboardSkeleton = () => (
  <>
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {[0, 1, 2].map((i) => (
        <Skeleton key={i} className="h-[86px]" />
      ))}
    </div>
    <Skeleton className="mt-4 h-64" />
  </>
)

const Dashboard = () => {
  const navigate = useNavigate()
  const [stats, setStats] = useState([])
  const [upcoming, setUpcoming] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await getBookings()
      const bookings = res.data || []

      const total = bookings.length
      const active = bookings.filter((b) => b.status === 'requested' || b.status === 'confirmed' || b.status === 'in_progress').length
      const completed = bookings.filter((b) => b.status === 'completed').length

      setStats([
        { id: 1, title: 'Total Bookings', value: total, icon: 'Calendar', desc: 'All time' },
        { id: 2, title: 'Active Bookings', value: active, icon: 'Users', desc: 'Requested / Confirmed / In Progress' },
        { id: 3, title: 'Completed', value: completed, icon: 'Calendar', desc: 'Delivered' },
      ])

      const now = new Date()
      const upcomingList = bookings
        .filter((b) => new Date(b.slot_start) > now)
        .sort((a, b) => new Date(a.slot_start) - new Date(b.slot_start))
        .slice(0, 5)

      setUpcoming(upcomingList)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  return (
    <>
      <PageHeader title="Dashboard" description="Bookings at a glance" />

      {loading ? (
        <DashboardSkeleton />
      ) : error ? (
        <ErrorState message={error} onRetry={loadData} />
      ) : (
        <div className="flex flex-col gap-4">
          {stats.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {stats.map((stat) => <StatCard key={stat.id} {...stat} />)}
            </div>
          ) : (
            <Card>
              <EmptyState message="Dashboard data is not available." />
            </Card>
          )}

          <Card>
            <CardHeader className="border-b border-border">
              <div>
                <CardTitle>Upcoming Bookings</CardTitle>
                <CardDescription>Bookings with future slot start times</CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate('/bookings')}>
                View all
              </Button>
            </CardHeader>

            {upcoming.length === 0 ? (
              <EmptyState message="No upcoming bookings." />
            ) : (
              <ul className="divide-y divide-border">
                {upcoming.map((b) => {
                  const nurseName = b.assigned_nurse?.nurse_name || 'Unassigned'
                  const startTime = new Date(b.slot_start).toLocaleString('en-IN', {
                    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
                  })
                  return (
                    <li key={b.booking_id}>
                      <button
                        type="button"
                        onClick={() => navigate('/bookings')}
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors outline-none hover:bg-surface-hover focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
                      >
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-medium text-fg tabular-nums">
                            Booking #{b.booking_id}
                          </span>
                          <span className="block truncate text-xs text-fg-muted">
                            {startTime} &middot; {nurseName}
                          </span>
                        </span>
                        <ChevronRight size={14} className="shrink-0 text-fg-subtle" />
                      </button>
                    </li>
                  )
                })}
              </ul>
            )}
          </Card>
        </div>
      )}
    </>
  )
}

export default Dashboard
