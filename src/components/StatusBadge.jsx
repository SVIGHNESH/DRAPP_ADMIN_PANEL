import React from 'react'

import { cn } from '@/lib/utils'

/**
 * A status as T03 settled it: a neutral chip on --surface-sunken carrying a
 * coloured dot, rather than a pill tinted with the status hue.
 *
 * The hue lives only in the 6px dot, so it has to clear 3:1 rather than the
 * 4.5:1 a tinted pill's own text would have to clear. That is what lets amber
 * stay amber in the light theme instead of going muddy; `node
 * tickets/assets/T03/contrast.mjs --pills` reproduces the failure it avoids.
 */
const dotClasses = {
  success: 'bg-success',
  info: 'bg-info',
  warning: 'bg-warning',
  special: 'bg-special',
  danger: 'bg-danger',
  neutral: 'bg-fg-subtle',
}

const StatusBadge = ({ tone = 'neutral', children, className }) => (
  <span
    className={cn(
      'inline-flex items-center gap-1.5 rounded-full bg-surface-sunken py-0.5 pr-2.5 pl-2 text-xs whitespace-nowrap',
      tone === 'neutral' ? 'text-fg-muted' : 'text-fg-secondary',
      className
    )}
  >
    <span aria-hidden="true" className={cn('size-1.5 shrink-0 rounded-full', dotClasses[tone] || dotClasses.neutral)} />
    {children}
  </span>
)

export default StatusBadge
