import React from 'react'
import { ShieldAlert } from 'lucide-react'

import { useAuth } from '../context/useAuth'
import { Button } from '@/components/ui/button'

/**
 * Shown when a real, signed-in account reaches the panel without the admin
 * role.
 *
 * It renders outside the app shell and offers sign-out rather than a link
 * back into the app, because there is no page in here the account may see.
 * Bouncing to /login instead would loop: the token is still valid, so the
 * login screen would sign them straight back in.
 */
const NotAuthorized = () => {
  const { user, logout } = useAuth()

  return (
    <div className="flex min-h-svh flex-col items-center justify-center px-6 py-24 text-center">
      <span className="flex size-9 items-center justify-center rounded-lg border border-border bg-danger-soft text-danger">
        <ShieldAlert size={17} />
      </span>
      <h1 className="mt-3 text-base font-semibold text-fg">Admin access required</h1>
      <p className="mt-1 max-w-sm text-sm text-fg-muted">
        {user?.email ? <>You are signed in as {user.email}, which </> : <>This account </>}
        does not have the admin role. Sign in with an admin account to use this panel.
      </p>
      <Button variant="outline" className="mt-5" onClick={() => logout()}>
        Sign out
      </Button>
    </div>
  )
}

export default NotAuthorized
