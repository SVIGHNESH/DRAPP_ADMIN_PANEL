import * as React from "react"

import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

/**
 * The form row: label above the control, optional hint below it.
 *
 * tickets/T07-auth-screens.md settled this pattern on the auth screens on
 * purpose, because they are the cheapest place to get it wrong cheaply, and
 * every other form in the app then copies it.
 *
 * `tone="error"` exists on FieldHint but nothing uses it yet. Errors still
 * report through toasts, which restyle-only requires: moving them inline next
 * to the field that caused them would change what the app says and when, not
 * how it looks.
 */
function Field({ className, ...props }) {
  return <div data-slot="field" className={cn("flex flex-col gap-1.5", className)} {...props} />;
}

function FieldLabel({ className, ...props }) {
  return <Label data-slot="field-label" className={className} {...props} />;
}

function FieldHint({ className, tone = "muted", ...props }) {
  return (
    <p
      data-slot="field-hint"
      className={cn("text-xs", tone === "error" ? "text-danger" : "text-fg-muted", className)}
      {...props} />
  );
}

export { Field, FieldLabel, FieldHint }
