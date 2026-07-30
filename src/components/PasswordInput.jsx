import React, { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

/**
 * The visibility toggle swaps `type` on the same element rather than swapping
 * elements, which is what keeps browser autofill and password managers
 * attached to it. The caller owns `autoComplete`, so a manager can tell a
 * current password from a new one.
 */
const PasswordInput = ({ className, ...props }) => {
  const [visible, setVisible] = useState(false)

  return (
    <div className="relative">
      <Input
        type={visible ? 'text' : 'password'}
        className={cn('pr-8', className)}
        {...props}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? 'Hide password' : 'Show password'}
        aria-pressed={visible}
        className="absolute top-1/2 right-1 flex size-6 -translate-y-1/2 items-center justify-center rounded-xs text-fg-muted transition-colors outline-none hover:text-fg focus-visible:ring-2 focus-visible:ring-ring"
      >
        {visible ? <EyeOff size={14} /> : <Eye size={14} />}
      </button>
    </div>
  )
}

export default PasswordInput
