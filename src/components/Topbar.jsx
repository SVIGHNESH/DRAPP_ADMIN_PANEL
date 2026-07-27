import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Bell, Sun, Moon, ChevronDown, LogOut, Settings, User, CheckCircle } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

const Topbar = () => {
  const navigate = useNavigate()
  const { darkMode, toggleTheme } = useTheme()
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showSignedOutToast, setShowSignedOutToast] = useState(false)

  // const goToProfile = () => {
  //   setShowProfile(false)
  //   navigate('/profile')
  // }

  // const goToSettings = () => {
  //   setShowProfile(false)
  //   navigate('/settings')
  // }

  const handleSignOut = () => {
    setShowProfile(false)
    setShowSignedOutToast(true)
    setTimeout(() => setShowSignedOutToast(false), 2500)
  }

  return (
    // <header className="h-20 bg-dark-900 border-b border-dark-700 flex items-center justify-between px-6 sticky top-0 z-30">
    <header className="h-20 bg-dark-900 border-b border-dark-700 flex justify-end items-center px-6 sticky top-0 z-30">
      {/* <div>
        <h1 className="text-xl font-bold text-dark-100 flex items-center gap-2">Hello, DR. Manorama👋</h1>
        <p className="text-sm text-dark-500">Welcome to the Caretaker Management Dashboard</p>
      </div> */}

      <div className="flex items-center gap-4">
        {/* <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500" size={18} />
          <input type="text" placeholder="Search anything" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-64 pl-10 pr-4 py-2.5 bg-dark-800 border border-dark-700 rounded-xl text-sm text-dark-200 placeholder:text-dark-500 focus:outline-none focus:ring-2 focus:ring-accent-cyan" />
        </div> */}

        <button onClick={toggleTheme} className="p-2.5 rounded-xl bg-dark-800 border border-dark-700 text-dark-400 hover:text-accent-cyan" title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}>
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <div className="relative">
          <button onClick={() => setShowNotifications(!showNotifications)} className="p-2.5 rounded-xl bg-dark-800 border border-dark-700 text-dark-400 relative">
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-xs rounded-full flex items-center justify-center">2</span>
          </button>
          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-dark-800 rounded-xl shadow-2xl border border-dark-700 z-50 p-4">
              <h3 className="font-semibold text-dark-100 mb-3">Notifications</h3>
              <div className="space-y-3">
                <div className="p-3 bg-cyan-500/5 rounded-lg border border-dark-700/50">
                  <p className="text-sm font-medium text-dark-200">Emergency Alert</p>
                  <p className="text-xs text-dark-500">A user has raised an urgent care request</p>
                </div>
                <div className="p-3 rounded-lg border border-dark-700/50">
                  <p className="text-sm font-medium text-dark-200">Booking Reminder</p>
                  <p className="text-xs text-dark-500">Nurse Priya Sharma has 3 pending confirmations</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* <div className="relative">
          <button onClick={() => setShowProfile(!showProfile)} className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-dark-800">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-sm">JD</div>
            <div className="hidden lg:block text-left">
              <p className="text-sm font-semibold text-dark-200">John Doe</p>
              <p className="text-xs text-dark-500">Admin</p>
            </div> 
             <ChevronDown size={16} className="text-dark-500 hidden lg:block" />
          </button>
          {showProfile && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowProfile(false)} />
              <div className="absolute right-0 top-full mt-2 w-56 bg-dark-800 rounded-xl shadow-2xl border border-dark-700 z-50 p-2">
                <button onClick={goToProfile} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-dark-700 text-sm text-dark-300"><User size={16} /> My Profile</button>
                <button onClick={goToSettings} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-dark-700 text-sm text-dark-300"><Settings size={16} /> Settings</button>
                <div className="border-t border-dark-700 mt-2 pt-2">
                  <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-rose-500/10 text-sm text-rose-400"><LogOut size={16} /> Sign Out</button>
                </div>
              </div>
            </>
          )}
        </div> */}
      </div>

      {showSignedOutToast && (
        <div className="fixed top-6 right-6 z-[100] bg-dark-800 border border-dark-700 rounded-xl shadow-2xl px-4 py-3 flex items-center gap-2">
          <CheckCircle size={18} className="text-emerald-400" />
          <span className="text-sm text-dark-200">Signed out successfully</span>
        </div>
      )}
    </header>
  )
}

export default Topbar
