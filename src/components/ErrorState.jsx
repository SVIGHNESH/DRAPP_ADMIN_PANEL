import React from 'react'
import { AlertTriangle } from 'lucide-react'

import { Button } from '@/components/ui/button'

const ErrorState = ({ message = 'Something went wrong.', onRetry }) => (
  <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
    <span className="flex size-9 items-center justify-center rounded-lg border border-border bg-danger-soft text-danger">
      <AlertTriangle size={17} />
    </span>
    <p className="mt-3 max-w-sm text-sm text-fg-secondary">{message}</p>
    {onRetry && (
      <Button variant="outline" onClick={onRetry} className="mt-4">
        Retry
      </Button>
    )}
  </div>
)

export default ErrorState
