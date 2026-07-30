import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Replaces the `.table-header` and `.table-cell` classes from the old
 * `@layer components` block. The header strip is --surface-sunken, one of the
 * jobs T03 gives that token.
 */
function Table({ className, containerClassName, ...props }) {
  return (
    <div data-slot="table-container" className={cn("w-full overflow-x-auto", containerClassName)}>
      <table
        data-slot="table"
        className={cn("w-full caption-bottom border-collapse text-sm", className)}
        {...props} />
    </div>
  );
}

function TableHeader({ className, ...props }) {
  return (
    <thead
      data-slot="table-header"
      className={cn("bg-surface-sunken [&_tr]:border-b [&_tr]:border-border", className)}
      {...props} />
  );
}

function TableBody({ className, ...props }) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props} />
  );
}

function TableRow({ className, interactive = false, ...props }) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "border-b border-border transition-colors",
        interactive && "cursor-pointer hover:bg-surface-hover",
        className
      )}
      {...props} />
  );
}

function TableHead({ className, ...props }) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "h-8 px-3 text-left align-middle text-2xs font-medium tracking-wide whitespace-nowrap text-fg-muted uppercase",
        className
      )}
      {...props} />
  );
}

function TableCell({ className, ...props }) {
  return (
    <td
      data-slot="table-cell"
      className={cn("px-3 py-2.5 align-middle text-sm text-fg-secondary", className)}
      {...props} />
  );
}

export { Table, TableHeader, TableBody, TableRow, TableHead, TableCell }
