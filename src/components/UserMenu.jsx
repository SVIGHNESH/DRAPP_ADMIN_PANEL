import React from 'react'
import { ChevronsUpDown, LogOut, Moon, Sun } from 'lucide-react'

import { useAuth } from '../context/useAuth'
import { useTheme } from '../context/useTheme'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

/**
 * The sidebar footer, and the only place Sign Out lives.
 *
 * It used to be in two: pinned in red at the bottom of the sidebar, and again
 * in a profile dropdown in the topbar that contained nothing else.
 * tickets/T04-app-shell-design.md kept the dropdown and gave it a reason to
 * exist by folding the theme toggle into it, which is what let the topbar go
 * away entirely.
 *
 * The notifications bell that sat beside it is gone. Its badge was hardcoded
 * to 0 and it opened nothing, and shipping a dead control is worse than not
 * shipping it. Nothing else in the app produces notifications.
 */
const UserMenu = () => {
  const { user, logout } = useAuth()
  const { darkMode, setDarkMode } = useTheme()

  const name = user?.name || 'Admin'
  const initials = name
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left transition-colors outline-none hover:bg-surface-hover focus-visible:ring-2 focus-visible:ring-ring data-[state=open]:bg-surface-hover">
        <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-border bg-surface-sunken text-2xs font-medium text-fg-secondary">
          {initials}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-medium text-fg">{name}</span>
          {user?.email && <span className="block truncate text-2xs text-fg-muted">{user.email}</span>}
        </span>
        <ChevronsUpDown size={13} className="shrink-0 text-fg-muted" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" side="top" className="w-[13.5rem]">
        <DropdownMenuLabel>Appearance</DropdownMenuLabel>
        <DropdownMenuRadioGroup
          value={darkMode ? 'dark' : 'light'}
          onValueChange={(value) => setDarkMode(value === 'dark')}
        >
          <DropdownMenuRadioItem value="light">
            <Sun /> Light
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="dark">
            <Moon /> Dark
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem variant="destructive" onSelect={() => logout()}>
          <LogOut /> Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserMenu
