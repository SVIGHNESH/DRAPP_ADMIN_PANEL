import React, { useState, useEffect, useCallback } from 'react'
import { ChevronRight, Clock } from 'lucide-react'
import StatCard from '../components/StatCard'
import { getBookings } from '../api/bookings'
import { getErrorMessage } from '../utils/apiError'
import { useNavigate } from 'react-router-dom'

import Loader from "../components/Loader"
import ErrorState from "../components/ErrorState"
import EmptyState from "../components/EmptyState"

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
        { id: 1, title: 'Total Bookings', value: total, icon: 'Calendar', gradient: 'from-cyan-400 to-cyan-600', change: '', desc: 'All time' },
        { id: 2, title: 'Active Bookings', value: active, icon: 'Users', gradient: 'from-amber-400 to-amber-600', change: '', desc: 'Requested / Confirmed / In Progress' },
        { id: 3, title: 'Completed', value: completed, icon: 'Calendar', gradient: 'from-violet-400 to-violet-600', change: '', desc: 'Delivered' },
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

  if (loading) return <Loader />
  if (error) return <ErrorState message={error} onRetry={loadData} />

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.length > 0 ? (
          stats.map((stat) => <StatCard key={stat.id} {...stat} />)
        ) : (
          <EmptyState message="Dashboard data is not available." />
        )}
      </div>

      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="section-title">Upcoming Bookings</h3>
            <p className="text-sm text-dark-500 mt-1">Bookings with future slot start times</p>
          </div>
          <button
            onClick={() => navigate('/bookings')}
            className="text-sm text-accent-cyan hover:underline"
          >
            View All
          </button>
        </div>

        {upcoming.length === 0 ? (
          <p className="text-sm text-dark-500 text-center py-8">No upcoming bookings.</p>
        ) : (
          <div className="space-y-3">
            {upcoming.map((b) => {
              const nurseName = b.assigned_nurse?.nurse_name || 'Unassigned'
              const startTime = new Date(b.slot_start).toLocaleString('en-IN', {
                day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
              })
              return (
                <div
                  key={b.booking_id}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-dark-800/50 cursor-pointer"
                  onClick={() => navigate('/bookings')}
                >
                  <div className="w-8 h-8 rounded-lg bg-accent-cyan/20 flex items-center justify-center">
                    <Clock size={16} className="text-accent-cyan" />
                  </div>
                  <div className="flex-1">
                    <h5 className="text-sm font-medium text-dark-200">
                      Booking #{b.booking_id}
                    </h5>
                    <p className="text-xs text-dark-500">{startTime} &middot; {nurseName}</p>
                  </div>
                  <ChevronRight size={14} className="text-dark-600" />
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
