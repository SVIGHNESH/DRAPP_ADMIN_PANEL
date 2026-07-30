import React from 'react'

/**
 * The one loading state a skeleton cannot serve: ProtectedRoute's auth check,
 * where there is no layout yet to imitate. Every in-page load uses Skeleton.
 */
const Loader = () => (
  <div className="flex min-h-[60vh] items-center justify-center">
    <span
      role="status"
      aria-label="Loading"
      className="size-5 animate-spin rounded-full border-2 border-border-strong border-t-accent-brand"
    />
  </div>
)

export default Loader
