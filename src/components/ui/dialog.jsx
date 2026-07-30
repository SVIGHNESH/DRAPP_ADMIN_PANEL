import * as React from "react"
import { Dialog as DialogPrimitive } from "radix-ui"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * Replaces the hand-rolled `fixed inset-0` modals that lived inline in
 * Bookings.jsx, Nurses.jsx and Services.jsx.
 *
 * The portal is the point, not just the styling: those modals rendered as the
 * last child of a `space-y-6` container, which under Tailwind 3 handed them a
 * stray 24px top margin and pushed every one of them 12px above centre
 * (tickets/T01-tailwind-4-migration.md). Rendering into a portal means the
 * position no longer depends on where in the tree the modal is written.
 */
const Dialog = DialogPrimitive.Root
const DialogTrigger = DialogPrimitive.Trigger
const DialogClose = DialogPrimitive.Close

function DialogOverlay({ className, ...props }) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-black/40 dark:bg-black/60",
        "data-[state=open]:animate-overlay-in data-[state=closed]:animate-overlay-out",
        className
      )}
      {...props} />
  );
}

function DialogContent({ className, children, showCloseButton = true, ...props }) {
  return (
    <DialogPrimitive.Portal>
      <DialogOverlay />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        // Explicit so `focusContent` below always has something to land on,
        // rather than depending on Radix's focus scope having set it.
        tabIndex={-1}
        className={cn(
          "fixed top-1/2 left-1/2 z-50 grid w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2",
          "max-h-[85vh] grid-rows-[auto_minmax(0,1fr)_auto] overflow-hidden",
          "rounded-xl border border-border bg-surface shadow-modal outline-none",
          "data-[state=open]:animate-modal-in data-[state=closed]:animate-modal-out",
          className
        )}
        {...props}>
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close
            data-slot="dialog-close"
            className="absolute top-3 right-3 flex size-7 items-center justify-center rounded-md text-fg-muted transition-colors outline-none hover:bg-surface-hover hover:text-fg focus-visible:ring-2 focus-visible:ring-ring">
            <X size={15} />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

function DialogHeader({ className, ...props }) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-0.5 border-b border-border px-4 py-3 pr-12", className)}
      {...props} />
  );
}

function DialogBody({ className, ...props }) {
  return (
    <div
      data-slot="dialog-body"
      className={cn("overflow-y-auto px-4 py-4", className)}
      {...props} />
  );
}

/** The sunken strip T03 names as one of --surface-sunken's jobs. */
function DialogFooter({ className, ...props }) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "flex flex-col-reverse gap-2 border-t border-border bg-surface-sunken px-4 py-3 sm:flex-row sm:justify-end",
        className
      )}
      {...props} />
  );
}

function DialogTitle({ className, ...props }) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn("text-base font-semibold text-fg", className)}
      {...props} />
  );
}

function DialogDescription({ className, ...props }) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn("text-xs text-fg-muted", className)}
      {...props} />
  );
}

/**
 * Pass as `onOpenAutoFocus` on a dialog that is read rather than filled in.
 *
 * Radix focuses the first focusable descendant, which is right for a form and
 * wrong for a detail view: the booking detail's first focusable element is the
 * "Add note" field, so opening a row to read it dropped a caret into a text
 * box eight sections down. Focusing the dialog itself keeps the focus trap and
 * Esc intact and starts Tab from the top.
 */
const focusContent = (event) => {
  event.preventDefault()
  event.currentTarget.focus()
}

export {
  Dialog,
  DialogTrigger,
  DialogClose,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  focusContent,
}
