import React from 'react'
import { Search } from 'lucide-react'

import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

/** The filter control the three list pages share. */
const SearchInput = ({ className, ...props }) => (
  <div className={cn('relative', className)}>
    <Search
      size={14}
      aria-hidden="true"
      className="pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 text-fg-muted"
    />
    <Input type="search" className="pl-8" {...props} />
  </div>
)

export default SearchInput
