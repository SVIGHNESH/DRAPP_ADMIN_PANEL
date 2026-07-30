import React from 'react'
import { Inbox } from 'lucide-react'

const EmptyState = ({ message = 'Data is not available.', action }) => (
  <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
    <span className="flex size-9 items-center justify-center rounded-lg border border-border bg-surface-sunken text-fg-muted">
      <Inbox size={17} />
    </span>
    <p className="mt-3 max-w-sm text-sm text-fg-muted">{message}</p>
    {action && <div className="mt-4">{action}</div>}
  </div>
)

export default EmptyState
