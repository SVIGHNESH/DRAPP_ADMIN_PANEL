import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  Heart, LayoutDashboard, Calendar, Stethoscope, Activity, HelpCircle,
} from 'lucide-react'

import { sidebarLinks, sidebarSettings } from '../data/mockData'
import UserMenu from './UserMenu'
import { cn } from '@/lib/utils'

const iconMap = {
  LayoutDashboard, Calendar, Stethoscope,
  Activity, HelpCircle,
}

/**
 * 240px, fixed, and it does not collapse.
 *
 * tickets/T04-app-shell-design.md killed the 288/80px collapse: it cost a
 * useState in App.jsx, a margin swing on the content column, and a second set
 * of layout rules inside every element in here, and it bought a 208px
 * reclaimed on a layout whose content is already capped at max-w-7xl.
 *
 * The active item carries one signal, not the four it used to: a sunken fill
 * with full-strength text. No accent tint, no left border, no chevron.
 */
const NavItem = ({ link, active }) => {
  const Icon = iconMap[link.icon]
  return (
    <Link
      to={link.path}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'flex h-7 items-center gap-2 rounded-md px-2 text-sm transition-colors outline-none',
        'focus-visible:ring-2 focus-visible:ring-ring',
        active
          ? 'bg-surface-sunken font-medium text-fg'
          : 'text-fg-secondary hover:bg-surface-hover hover:text-fg'
      )}
    >
      {Icon && <Icon size={15} className="shrink-0" />}
      <span className="truncate">{link.name}</span>
    </Link>
  )
}

const NavSection = ({ label, links, isActive }) => (
  <div>
    <p className="mb-1 px-2 text-2xs font-medium tracking-wide text-fg-muted uppercase">{label}</p>
    <div className="flex flex-col gap-0.5">
      {links.map((link) => (
        <NavItem key={link.name} link={link} active={isActive(link.path)} />
      ))}
    </div>
  </div>
)

const Sidebar = ({ mobileOpen, onClose }) => {
  const location = useLocation()
  const isActive = (path) => location.pathname === path

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden dark:bg-black/60"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-60 flex-col border-r border-border bg-canvas',
          'transition-transform duration-200 ease-out lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-12 shrink-0 items-center gap-2 px-3">
          <span className="flex size-5 items-center justify-center rounded-xs bg-accent-brand">
            <Heart size={12} className="text-accent-brand-fg" fill="currentColor" />
          </span>
          <span className="text-sm font-semibold text-fg">LifeCare</span>
        </div>

        <nav className="flex flex-1 flex-col gap-5 overflow-y-auto px-2 py-2">
          <NavSection label="General" links={sidebarLinks} isActive={isActive} />
          <NavSection label="Settings" links={sidebarSettings} isActive={isActive} />
        </nav>

        <div className="shrink-0 border-t border-border p-2">
          <UserMenu />
        </div>
      </aside>
    </>
  )
}

export default Sidebar
