import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  ChevronLeft, ChevronRight, Heart, Menu, X, LayoutDashboard,
  Calendar, Stethoscope, Activity,
  HelpCircle, LogOut, ChevronRight as ChevronRightIcon
} from 'lucide-react'
import { sidebarLinks, sidebarSettings } from '../data/mockData'
import { useAuth } from '../context/AuthContext'

const iconMap = {
  LayoutDashboard, Calendar, Stethoscope,
  Activity, HelpCircle
}

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation()
  const { logout } = useAuth()
  const isActive = (path) => location.pathname === path

  const renderLink = (link) => {
    const Icon = iconMap[link.icon]
    const active = isActive(link.path)
    return (
      <Link key={link.name} to={link.path} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${active ? 'bg-dark-800 text-accent-cyan border-l-2 border-accent-cyan' : 'text-dark-400 hover:bg-dark-800 hover:text-dark-200'} ${!isOpen ? 'justify-center px-2' : ''}`}>
        <Icon size={20} />
        {isOpen && <span className="font-medium text-sm">{link.name}</span>}
        {active && isOpen && <ChevronRightIcon size={16} className="ml-auto" />}
      </Link>
    )
  }

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsOpen(false)} />
      )}

      <aside className={`fixed left-0 top-0 h-full bg-dark-900 border-r border-dark-700 z-50 transition-all duration-300 flex flex-col ${isOpen ? 'w-72' : 'w-20'} ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        {/* Logo */}
        <div className={`h-20 flex items-center px-6 ${isOpen ? 'justify-between' : 'justify-center'}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-accent-cyan to-accent-teal rounded-xl flex items-center justify-center">
              <Heart className="text-dark-900" size={20} />
            </div>
            {isOpen && <h1 className="text-xl font-bold text-dark-100">LifeCare</h1>}
          </div>
          <button onClick={() => setIsOpen(!isOpen)} className="hidden lg:flex p-1.5 rounded-lg hover:bg-dark-700 text-dark-400">
            {isOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-6 overflow-y-auto">
          <div>
            {isOpen && <p className="px-4 text-xs font-semibold text-dark-500 uppercase mb-3">General</p>}
            <div className="space-y-1">
              {sidebarLinks.map(renderLink)}
            </div>
          </div>

          <div>
            {isOpen && <p className="px-4 text-xs font-semibold text-dark-500 uppercase mb-3">Settings</p>}
            <div className="space-y-1">
              {sidebarSettings.map(renderLink)}
            </div>
          </div>
        </nav>

        <div className="p-4 border-t border-dark-700">
          <button
            onClick={() => logout()}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-500/10 transition"
          >
            <LogOut size={20} />
            {isOpen && <span className="font-medium">Sign Out</span>}
          </button>
        </div>
      </aside>

      <button onClick={() => setIsOpen(!isOpen)} className="fixed top-4 left-4 z-50 lg:hidden p-2 bg-dark-800 rounded-lg border border-dark-700 text-dark-200">
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>
    </>
  )
}

export default Sidebar
