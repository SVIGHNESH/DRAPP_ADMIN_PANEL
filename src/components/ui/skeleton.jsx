import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * The loading placeholder for lists and cards. The old Loader.jsx spinner
 * survives alongside it for the one case a skeleton cannot serve: the
 * whole-app auth check in ProtectedRoute, where there is no layout to imitate
 * yet.
 *
 * `animate-pulse` is Tailwind's own opacity-only keyframe, which is inside
 * what T08 allows to animate and is cut to nothing by the reduced-motion rule
 * in index.css.
 */
function Skeleton({ className, ...props }) {
  return (
    <div
      data-slot="skeleton"
      className={cn("animate-pulse rounded-md bg-surface-sunken", className)}
      {...props} />
  );
}

export { Skeleton }
