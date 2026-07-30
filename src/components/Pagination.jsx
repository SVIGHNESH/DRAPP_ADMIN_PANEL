import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import { cn } from '@/lib/utils'

/**
 * One pager for all three list pages. Bookings, Nurses and Services each
 * carried their own copy of this markup, drifted apart by a wrapper class.
 */
const Pagination = ({ page, totalPages, onPageChange, className }) => {
  if (totalPages <= 1) return null

  const arrowClasses =
    'flex size-7 items-center justify-center rounded-md border border-border text-fg-secondary transition-colors outline-none hover:bg-surface-hover hover:text-fg focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40'

  return (
    <nav aria-label="Pagination" className={cn('flex items-center gap-1', className)}>
      <button
        type="button"
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page === 1}
        aria-label="Previous page"
        className={arrowClasses}
      >
        <ChevronLeft size={14} />
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onPageChange(p)}
          aria-current={page === p ? 'page' : undefined}
          className={cn(
            'flex size-7 items-center justify-center rounded-md text-xs tabular-nums transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring',
            page === p
              ? 'bg-accent-brand font-medium text-accent-brand-fg'
              : 'border border-border text-fg-secondary hover:bg-surface-hover hover:text-fg'
          )}
        >
          {p}
        </button>
      ))}

      <button
        type="button"
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        aria-label="Next page"
        className={arrowClasses}
      >
        <ChevronRight size={14} />
      </button>
    </nav>
  )
}

export default Pagination
