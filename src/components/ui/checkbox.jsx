import * as React from "react"
import { Checkbox as CheckboxPrimitive } from "radix-ui"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"

function Checkbox({ className, ...props }) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer size-4 shrink-0 rounded-xs border border-border-strong bg-surface transition-colors outline-none",
        "focus-visible:ring-2 focus-visible:ring-ring",
        "data-[state=checked]:border-accent-brand data-[state=checked]:bg-accent-brand data-[state=checked]:text-accent-brand-fg",
        "disabled:cursor-not-allowed disabled:opacity-60",
        className
      )}
      {...props}>
      <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
        <Check size={11} strokeWidth={3} />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox }
