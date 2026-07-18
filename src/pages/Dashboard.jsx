import React, { useState } from 'react'
import { ChevronRight, Plus, Stethoscope, Activity, X, Calendar as CalendarIcon, Clock } from 'lucide-react'
import { statsData, calendarDays as initialCalendarDays, upcomingSchedule as initialSchedule, nursesData } from '../data/mockData'
import StatCard from '../components/StatCard'
import { ExpenseChart } from '../components/Charts'

const emptyForm = { title: '', nurse: '', user: '', date: '', time: '' }

const Dashboard = () => {
  const [calendarDays, setCalendarDays] = useState(initialCalendarDays)
  const [schedule, setSchedule] = useState(initialSchedule)
  const [showAddModal, setShowAddModal] = useState(false)
  const [form, setForm] = useState(emptyForm)

  const selectDay = (index) => {
    setCalendarDays(prev => prev.map((day, i) => ({ ...day, active: i === index })))
  }

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleAddSchedule = (e) => {
    e.preventDefault()
    if (!form.title || !form.nurse || !form.user) return
    const newItem = {
      id: Date.now(),
      title: form.title,
      time: form.date && form.time ? `${form.time} (${form.date})` : (form.time || 'Time not set'),
      nurse: form.nurse,
      user: form.user,
    }
    setSchedule(prev => [...prev, newItem])
    setForm(emptyForm)
    setShowAddModal(false)
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statsData.map((stat) => <StatCard key={stat.id} {...stat} />)}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6">
        <ExpenseChart />
      </div>

      {/* Calendar & Schedule */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <div><h3 className="section-title">April 2024</h3><p className="text-sm text-dark-500 mt-1">Upcoming bookings</p></div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg bg-dark-800 text-dark-400 hover:bg-dark-700"><ChevronRight size={16} className="rotate-180" /></button>
            <button className="p-2 rounded-lg bg-dark-800 text-dark-400 hover:bg-dark-700"><ChevronRight size={16} /></button>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          {calendarDays.map((day, index) => (
            <button
              key={index}
              onClick={() => selectDay(index)}
              className={`flex flex-col items-center gap-2 p-3 rounded-xl cursor-pointer transition-colors ${day.active ? 'bg-accent-cyan text-dark-900' : 'bg-dark-800 text-dark-400 hover:bg-dark-700'}`}
            >
              <span className="text-xs font-medium">{day.day}</span>
              <span className="text-lg font-bold">{day.date}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold text-dark-200">Schedule</h4>
          <button className="text-sm text-accent-cyan">See All</button>
        </div>

        {schedule.slice(0, 1).map((item) => (
          <div key={item.id} className="bg-dark-800/50 rounded-xl p-4 border border-dark-700/50 mb-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent-cyan/20 flex items-center justify-center"><Stethoscope size={20} className="text-accent-cyan" /></div>
              <div className="flex-1">
                <h5 className="font-medium text-dark-200">{item.title}</h5>
                <p className="text-sm text-dark-500">{item.time}</p>
                <p className="text-sm text-dark-500">{item.nurse} • {item.user}</p>
              </div>
              <ChevronRight size={16} className="text-dark-500 mt-2" />
            </div>
          </div>
        ))}

        <h4 className="font-semibold text-dark-200 mb-3">Upcoming</h4>
        <div className="space-y-3">
          {schedule.slice(1).map((item) => (
            <div key={item.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-dark-800/50 cursor-pointer">
              <div className="w-8 h-8 rounded-lg bg-accent-rose/20 flex items-center justify-center"><Activity size={16} className="text-accent-rose" /></div>
              <div className="flex-1">
                <h5 className="text-sm font-medium text-dark-200">{item.title}</h5>
                <p className="text-xs text-dark-500">{item.time}</p>
              </div>
              <ChevronRight size={14} className="text-dark-600" />
            </div>
          ))}
          {schedule.length <= 1 && (
            <p className="text-sm text-dark-500 text-center py-2">No more upcoming items.</p>
          )}
        </div>

        <button onClick={() => setShowAddModal(true)} className="w-full mt-4 py-2.5 bg-accent-cyan hover:bg-cyan-400 text-dark-900 rounded-xl font-semibold flex items-center justify-center gap-2">
          <Plus size={18} /> Add New
        </button>
      </div>

      {/* Add Schedule Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowAddModal(false)}>
          <div className="bg-dark-900 border border-dark-700 rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-dark-700">
              <h3 className="font-bold text-dark-100 text-lg">Add Schedule Item</h3>
              <button onClick={() => setShowAddModal(false)} className="p-2 rounded-lg hover:bg-dark-800 text-dark-400"><X size={18} /></button>
            </div>
            <form onSubmit={handleAddSchedule} className="p-5 space-y-4">
              <div>
                <label className="block text-sm text-dark-500 mb-2">Title</label>
                <input required name="title" value={form.title} onChange={handleChange} placeholder="e.g. Physiotherapy Session" className="input-field" />
              </div>
              <div>
                <label className="block text-sm text-dark-500 mb-2">Select Nurse</label>
                <select required name="nurse" value={form.nurse} onChange={handleChange} className="input-field">
                  <option value="">Choose a nurse</option>
                  {nursesData.map(n => <option key={n.id} value={n.name}>{n.name} — {n.careType}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-dark-500 mb-2">User Name</label>
                <input required name="user" value={form.user} onChange={handleChange} placeholder="e.g. Devon Lane" className="input-field" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-dark-500 mb-2 flex items-center gap-1"><CalendarIcon size={14} /> Date</label>
                  <input type="date" name="date" value={form.date} onChange={handleChange} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm text-dark-500 mb-2 flex items-center gap-1"><Clock size={14} /> Time</label>
                  <input type="time" name="time" value={form.time} onChange={handleChange} className="input-field" />
                </div>
              </div>
              <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2"><Plus size={18} /> Add to Schedule</button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard
