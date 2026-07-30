import React from 'react'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'

const NotFound = () => (
  <div className="flex flex-col items-center justify-center py-24 text-center">
    <p className="text-2xl font-semibold text-fg tabular-nums">404</p>
    <p className="mt-1 text-sm text-fg-muted">This page does not exist.</p>
    <Button asChild variant="outline" className="mt-5">
      <Link to="/dashboard">Back to dashboard</Link>
    </Button>
  </div>
)

export default NotFound
