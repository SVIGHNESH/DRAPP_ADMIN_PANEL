import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Heart, Menu } from 'lucide-react'

import Sidebar from './Sidebar'

/**
 * The frame around every authenticated route.
 *
 * There is no topbar. tickets/T04-app-shell-design.md settled that the 80px
 * bar whose entire left half was empty should not be shrunk but removed: its
 * theme toggle and profile menu moved into the sidebar footer, its
 * notifications bell was dead and went, and the page title it might have
 * carried belongs to PageHeader, which each page renders for itself.
 *
 * Below `lg` the sidebar becomes a drawer, and the only thing that survives of
 * the topbar is a 48px bar holding the trigger and the wordmark. The old
 * hamburger floated outside the aside at `fixed top-4 left-4`, overlapping
 * whatever was underneath it.
 *
 * The document scrolls rather than an inner `main`. The sidebar is fixed, so
 * it does not need the `h-screen overflow-hidden` wrapper the old layout used,
 * and losing that wrapper is what makes scroll restoration and `position:
 * sticky` behave normally.
 */
const AppShell = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  // A drawer that survives navigation would cover the page it just opened.
  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  return (
    <div className="min-h-screen bg-canvas">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="lg:pl-60">
        <header className="sticky top-0 z-30 flex h-12 items-center gap-2 border-b border-border bg-canvas px-3 lg:hidden">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation"
            aria-expanded={mobileOpen}
            className="flex size-8 items-center justify-center rounded-md text-fg-secondary transition-colors outline-none hover:bg-surface-hover hover:text-fg focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Menu size={16} />
          </button>
          <span className="flex size-5 items-center justify-center rounded-xs bg-accent-brand">
            <Heart size={12} className="text-accent-brand-fg" fill="currentColor" />
          </span>
          <span className="text-sm font-semibold text-fg">LifeCare</span>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  )
}

export default AppShell
