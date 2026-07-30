import React, { useState } from 'react'
import { Bell, Sun, Moon, ChevronDown, LogOut } from 'lucide-react'
import { useTheme } from '../context/useTheme'
import { useAuth } from '../context/useAuth'

const Topbar = () => {
  const { darkMode, toggleTheme } = useTheme()
  const { user, logout } = useAuth()
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfile, setShowProfile] = useState(false)

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'AD'

  const handleSignOut = () => {
    setShowProfile(false)
    logout()
  }

  return (
    <header className="h-20 bg-dark-900 border-b border-dark-700 flex justify-end items-center px-6 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button onClick={toggleTheme} className="p-2.5 rounded-xl bg-dark-800 border border-dark-700 text-dark-400 hover:text-accent-cyan" title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}>
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <div className="relative">
          <button onClick={() => setShowNotifications(!showNotifications)} className="p-2.5 rounded-xl bg-dark-800 border border-dark-700 text-dark-400 relative">
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-xs rounded-full flex items-center justify-center">0</span>
          </button>
        </div>

        <div className="relative">
          <button onClick={() => setShowProfile(!showProfile)} className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-dark-800">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-sm">
              {initials}
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-sm font-semibold text-dark-200">{user?.name || 'Admin'}</p>
              <p className="text-xs text-dark-500">{user?.email || ''}</p>
            </div>
            <ChevronDown size={16} className="text-dark-500 hidden lg:block" />
          </button>
          {showProfile && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowProfile(false)} />
              <div className="absolute right-0 top-full mt-2 w-56 bg-dark-800 rounded-xl shadow-2xl border border-dark-700 z-50 p-2">
                <div className="border-t border-dark-700 mt-0 pt-0">
                  <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-rose-500/10 text-sm text-rose-400">
                    <LogOut size={16} /> Sign Out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export default Topbar
