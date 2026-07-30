import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Cards get no shadow. T03 settled that depth comes from the 1px border plus
 * --surface-sunken, and that only floating things (popovers, toasts, modals)
 * cast anything.
 */
function Card({ className, ...props }) {
  return (
    <div
      data-slot="card"
      className={cn("rounded-lg border border-border bg-surface", className)}
      {...props} />
  );
}

function CardHeader({ className, ...props }) {
  return (
    <div
      data-slot="card-header"
      className={cn("flex items-start justify-between gap-4 px-4 py-3", className)}
      {...props} />
  );
}

function CardTitle({ className, ...props }) {
  return (
    <h3
      data-slot="card-title"
      className={cn("text-sm font-semibold text-fg", className)}
      {...props} />
  );
}

function CardDescription({ className, ...props }) {
  return (
    <p
      data-slot="card-description"
      className={cn("mt-0.5 text-xs text-fg-muted", className)}
      {...props} />
  );
}

function CardContent({ className, ...props }) {
  return <div data-slot="card-content" className={cn("px-4 pb-4", className)} {...props} />;
}

export { Card, CardHeader, CardTitle, CardDescription, CardContent }
