import React from 'react'
import { Users, Calendar, IndianRupee } from 'lucide-react'

import { Card } from '@/components/ui/card'

const iconMap = { Users, Calendar, DollarSign: IndianRupee }

/**
 * Flat and bordered. T03 killed the three per-card gradients along with every
 * other gradient in the app, and gave cards no shadow: depth is the 1px border.
 * The value is tabular so the three cards stay aligned as counts change.
 */
const StatCard = ({ title, value, icon, desc }) => {
  const Icon = iconMap[icon] || Users

  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 text-fg-muted">
        <Icon size={14} className="shrink-0" />
        <h3 className="truncate text-xs font-medium">{title}</h3>
      </div>
      <p className="mt-2 text-2xl font-semibold text-fg tabular-nums">{value}</p>
      {desc && <p className="mt-1 truncate text-xs text-fg-muted">{desc}</p>}
    </Card>
  )
}

export default StatCard
