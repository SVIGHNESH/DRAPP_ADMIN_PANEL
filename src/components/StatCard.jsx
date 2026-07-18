import React from 'react'
import { TrendingUp, Users, Calendar, Stethoscope, DollarSign } from 'lucide-react'

const iconMap = { Users, Calendar, Stethoscope, DollarSign }

const StatCard = ({ title, value, change, icon, gradient, desc }) => {
  const Icon = iconMap[icon] || Users
  
  return (
    <div className={`bg-gradient-to-br ${gradient} rounded-2xl p-6 text-white shadow-lg relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300`}>
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Icon size={24} className="text-white" />
          </div>
          <div className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium bg-white/20">
            <TrendingUp size={14} /> {change}
          </div>
        </div>
        <h3 className="text-white/80 text-sm font-medium mb-1">{title}</h3>
        <p className="text-3xl font-bold text-white mb-1">{value}</p>
        <p className="text-white/60 text-xs">{desc}</p>
      </div>
    </div>
  )
}

export default StatCard