import React from 'react'

/**
 * Every page opens with this. tickets/T04-app-shell-design.md settled it once
 * here rather than letting each page renegotiate a header: the old `.page-title`
 * class put the title inside a card on some pages and loose on others.
 */
const PageHeader = ({ title, description, actions }) => (
  <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
    <div className="min-w-0">
      <h1 className="text-xl font-semibold text-fg">{title}</h1>
      {description && <p className="mt-1 max-w-2xl text-sm text-fg-muted">{description}</p>}
    </div>
    {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
  </div>
)

export default PageHeader
