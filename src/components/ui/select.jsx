import * as React from "react"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * A restyled native `<select>`, not Radix's Select.
 *
 * tickets/T05-component-inventory.md settled this: every select in the app is
 * a plain list of short string options inside a form, and the native control
 * already brings keyboard behaviour, type-ahead, form association and the
 * platform picker on touch devices. Radix's Select would trade all of that for
 * a styleable option list nothing here needs. `Dialog` and `DropdownMenu` are
 * the two places the native equivalent genuinely does not exist.
 */
function Select({ className, children, ...props }) {
  return (
    <div className="relative">
      <select
        data-slot="select"
        className={cn(
          "h-8 w-full appearance-none rounded-md border border-border bg-surface pr-8 pl-2.5 text-sm text-fg transition-colors",
          "outline-none focus-visible:border-accent-brand focus-visible:ring-2 focus-visible:ring-ring",
          "disabled:cursor-not-allowed disabled:opacity-60",
          className
        )}
        {...props}>
        {children}
      </select>
      <ChevronDown
        size={14}
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 text-fg-muted" />
    </div>
  );
}

export { Select }
