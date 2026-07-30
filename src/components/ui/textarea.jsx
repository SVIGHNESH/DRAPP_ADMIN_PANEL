import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "min-h-16 w-full resize-y rounded-md border border-border bg-surface px-2.5 py-1.5 text-sm text-fg transition-colors",
        "outline-none focus-visible:border-accent-brand focus-visible:ring-2 focus-visible:ring-ring",
        "disabled:cursor-not-allowed disabled:opacity-60",
        className
      )}
      {...props} />
  );
}

export { Textarea }
