import React from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { expenseData, bedData } from '../data/mockData'

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-dark-800 border border-dark-700 rounded-xl p-3 shadow-xl">
        <p className="text-dark-200 text-sm font-medium mb-2">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-xs" style={{ color: entry.color }}>{entry.name}: {entry.value}</p>
        ))}
      </div>
    )
  }
  return null
}

export const ExpenseChart = () => (
  <div className="card p-6 relative">
    <div className="flex items-center justify-between mb-6">
      <div><h3 className="section-title">Total Expense</h3><p className="text-sm text-dark-500 mt-1">Revenue vs Expense analysis</p></div>
      <span className="text-sm text-dark-500">12/11/2024</span>
    </div>
    <div className="grid grid-cols-2 gap-4 mb-6">
      <div className="bg-dark-800/50 rounded-xl p-4">
        <p className="text-sm text-dark-500 mb-1">Total Expense</p>
        <p className="text-2xl font-bold text-dark-100">₹126,583.00</p>
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-500" /><span className="text-xs text-dark-400">Revenue 58%</span></div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-rose-500" /><span className="text-xs text-dark-400">Expense 24%</span></div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-amber-500" /><span className="text-xs text-dark-400">Other 6%</span></div>
      </div>
    </div>
    <div className="relative">
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie data={expenseData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
            {expenseData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
        <p className="text-3xl font-bold text-dark-100">88%</p>
        <p className="text-xs text-dark-500">Average</p>
      </div>
    </div>
  </div>
)

export const BedOccupancyChart = () => (
  <div className="card p-6">
    <h3 className="section-title mb-6">Bed Occupancy</h3>
    <div className="space-y-4">
      {bedData.map((item, index) => {
        const percentage = (item.occupied / item.total) * 100
        const colors = ['#FF6B8A', '#00D4FF', '#00E5C9', '#FFC542']
        return (
          <div key={index}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-dark-300">{item.name}</span>
              <span className="text-sm text-dark-400">{item.occupied}/{item.total}</span>
            </div>
            <div className="w-full bg-dark-800 rounded-full h-2.5">
              <div className="h-2.5 rounded-full transition-all duration-500" style={{ width: `${percentage}%`, backgroundColor: colors[index] }} />
            </div>
          </div>
        )
      })}
    </div>
  </div>
)
