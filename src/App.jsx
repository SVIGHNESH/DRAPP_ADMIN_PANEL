import React, { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import Dashboard from './pages/Dashboard'
import Bookings from './pages/Bookings'
import Nurses from './pages/Nurses'
import Help from './pages/Help'
import Login from './pages/Login'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <div className="flex h-screen bg-dark-900 overflow-hidden">
              <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
              <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'ml-72' : 'ml-20'}`}>
                <Topbar />
                <main className="flex-1 overflow-y-auto p-6">
                  <div className="max-w-7xl mx-auto">
                    <Routes>
                      <Route path="/" element={<Navigate to="/dashboard" replace />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/bookings" element={<Bookings />} />
                      <Route path="/nurses" element={<Nurses />} />
                      <Route path="/help" element={<Help />} />
                      <Route path="*" element={
                        <div className="flex flex-col items-center justify-center h-64">
                          <h1 className="text-4xl font-bold text-dark-400">404</h1>
                          <p className="text-dark-500 mt-2">Page not found</p>
                        </div>
                      } />
                    </Routes>
                  </div>
                </main>
              </div>
            </div>
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default App
