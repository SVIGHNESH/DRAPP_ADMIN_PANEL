import * as React from "react"
import { cva } from "class-variance-authority";
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

/**
 * Upstream shadcn/ui, with two deliberate departures recorded by
 * tickets/T09-ramps-and-variants.md:
 *
 * 1. The size table is retuned to T03's 32px control height. Heights are
 *    spacing utilities (`h-9`), not theme tokens, so unlike `rounded-md` and
 *    `text-sm` they cannot be bound at the token layer. Every other value in
 *    this file resolves through @theme and is left stock.
 * 2. The focus ring is `ring-2 ring-ring` rather than upstream's
 *    `ring-[3px] ring-ring/50`. T03's --ring already carries its own alpha, so
 *    the /50 modifier would apply it twice and the ring would all but vanish.
 */
const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-accent-brand-hover",
        destructive:
          "bg-destructive text-white hover:opacity-90",
        outline:
          "border border-border bg-surface shadow-xs hover:bg-surface-hover",
        secondary:
          "bg-secondary text-secondary-foreground border border-border hover:bg-surface-hover",
        ghost:
          "text-fg-secondary hover:bg-surface-hover hover:text-fg",
        link: "text-accent-text underline-offset-4 hover:underline",
      },
      size: {
        default: "h-8 px-3 has-[>svg]:px-2.5",
        xs: "h-6 gap-1 rounded-xs px-2 text-xs has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1.5 px-2.5 text-xs has-[>svg]:px-2 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-9 px-4 has-[>svg]:px-3.5",
        icon: "size-8",
        "icon-xs": "size-6 rounded-xs [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-7 [&_svg:not([class*='size-'])]:size-3.5",
        "icon-lg": "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props} />
  );
}

export { Button, buttonVariants }
