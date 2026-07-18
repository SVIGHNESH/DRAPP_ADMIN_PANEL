import React, { useState } from 'react'
import { Search, Plus, Filter, FileText, MoreHorizontal, ChevronLeft, ChevronRight } from 'lucide-react'
import { usersData, getStatusColor } from '../data/mockData'

const Users = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)

  const filtered = usersData.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || u.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const itemsPerPage = 5
  const totalPages = Math.ceil(filtered.length / itemsPerPage)
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="page-title">Users</h1><p className="text-dark-500 mt-1">Manage and monitor all users</p></div>
        <button className="btn-primary flex items-center gap-2"><Plus size={18} /> Add User</button>
      </div>

      <div className="card p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500" size={18} />
            <input type="text" placeholder="Search users..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="input-field pl-10" />
          </div>
          <div className="flex items-center gap-3">
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input-field w-40">
              <option value="all">All Status</option>
              <option value="stable">Stable</option>
              <option value="critical">Critical</option>
              <option value="observation">Observation</option>
            </select>
            <button className="btn-secondary flex items-center gap-2"><Filter size={16} /> Filter</button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-700">
                <th className="table-header">User</th>
                <th className="table-header">Age/Gender</th>
                <th className="table-header">Blood Type</th>
                <th className="table-header">Care Needed</th>
                <th className="table-header">Address</th>
                <th className="table-header">Nurse</th>
                <th className="table-header">Status</th>
                <th className="table-header">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((u) => (
                <tr key={u.id} className="border-b border-dark-700/50 hover:bg-dark-800/30">
                  <td className="table-cell">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-cyan to-accent-teal flex items-center justify-center text-dark-900 text-sm font-bold">{u.name.split(' ').map(n => n[0]).join('')}</div>
                      <p className="font-medium text-dark-200">{u.name}</p>
                    </div>
                  </td>
                  <td className="table-cell text-dark-300">{u.age} / {u.gender}</td>
                  <td className="table-cell"><span className="badge bg-cyan-500/15 text-cyan-400">{u.bloodType}</span></td>
                  <td className="table-cell text-dark-400">{u.careNeeded}</td>
                  <td className="table-cell text-dark-300">{u.address}</td>
                  <td className="table-cell text-dark-400">{u.nurse}</td>
                  <td className="table-cell"><span className={`badge ${getStatusColor(u.status)}`}>{u.status}</span></td>
                  <td className="table-cell">
                    <div className="flex items-center gap-2">
                      <button className="p-2 rounded-lg hover:bg-dark-700 text-dark-400"><FileText size={16} /></button>
                      <button className="p-2 rounded-lg hover:bg-dark-700 text-dark-400"><MoreHorizontal size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between mt-6 pt-4 border-t border-dark-700">
          <p className="text-sm text-dark-500">Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filtered.length)} of {filtered.length} results</p>
          <div className="flex items-center gap-2">
            <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="p-2 rounded-lg border border-dark-700 hover:bg-dark-800 disabled:opacity-50"><ChevronLeft size={16} /></button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button key={page} onClick={() => setCurrentPage(page)} className={`w-9 h-9 rounded-lg text-sm font-medium ${currentPage === page ? 'bg-accent-cyan text-dark-900' : 'border border-dark-700 hover:bg-dark-800 text-dark-400'}`}>{page}</button>
            ))}
            <button onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="p-2 rounded-lg border border-dark-700 hover:bg-dark-800 disabled:opacity-50"><ChevronRight size={16} /></button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Users
