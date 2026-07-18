import React, { useState } from 'react'
import { Bell, Shield, Globe, Moon, Sun, Smartphone, Mail, Eye, EyeOff, Save, Check } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

const tabs = [
  { id: 'general', label: 'General', icon: Globe },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'appearance', label: 'Appearance', icon: Moon },
]

const Settings = () => {
  const { darkMode, toggleTheme } = useTheme()
  const [activeTab, setActiveTab] = useState('general')
  const [showPassword, setShowPassword] = useState(false)
  const [saved, setSaved] = useState(false)
  const [accentColor, setAccentColor] = useState('cyan')
  const [notifs, setNotifs] = useState({
    email: true, push: true, sms: false, appointments: true, emergencies: true, system: true
  })

  const toggle = (key) => setNotifs(prev => ({ ...prev, [key]: !prev[key] }))

  const handleSave = (e) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-6">
      <div><h1 className="page-title">Settings</h1><p className="text-dark-500 mt-1">Manage your application preferences</p></div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-2">
          {tabs.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === item.id ? 'bg-dark-800 text-accent-cyan border-l-2 border-accent-cyan' : 'text-dark-400 hover:bg-dark-800 hover:text-dark-200'}`}
            >
              <item.icon size={20} /><span className="font-medium">{item.label}</span>
            </button>
          ))}
        </div>

        <div className="lg:col-span-2 space-y-6">
          {activeTab === 'general' && (
            <div className="card p-6">
              <h3 className="section-title mb-4 flex items-center gap-2"><Globe size={20} className="text-accent-cyan" /> General Settings</h3>
              <div className="space-y-4">
                <div><label className="block text-sm text-dark-500 mb-2">Organization Name</label><input type="text" defaultValue="CareNest" className="input-field" /></div>
                <div><label className="block text-sm text-dark-500 mb-2">Timezone</label><select className="input-field"><option>India Standard Time (IST)</option><option>Eastern Time (ET)</option><option>Pacific Time (PT)</option></select></div>
                <div><label className="block text-sm text-dark-500 mb-2">Language</label><select className="input-field"><option>English</option><option>Hindi</option><option>Spanish</option></select></div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="card p-6">
              <h3 className="section-title mb-4 flex items-center gap-2"><Bell size={20} className="text-accent-cyan" /> Notification Preferences</h3>
              <div className="space-y-4">
                {[
                  { key: 'email', label: 'Email Notifications', icon: Mail, desc: 'Receive updates via email' },
                  { key: 'push', label: 'Push Notifications', icon: Smartphone, desc: 'Receive push notifications' },
                  { key: 'sms', label: 'SMS Notifications', icon: Smartphone, desc: 'Receive text messages' },
                  { key: 'appointments', label: 'Booking Alerts', icon: Bell, desc: 'Get notified about bookings' },
                  { key: 'emergencies', label: 'Emergency Alerts', icon: Bell, desc: 'Critical emergency notifications' },
                  { key: 'system', label: 'System Updates', icon: Bell, desc: 'System maintenance and updates' },
                ].map(item => (
                  <div key={item.key} className="flex items-center justify-between p-4 bg-dark-800/50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-dark-700 flex items-center justify-center"><item.icon size={18} className="text-accent-cyan" /></div>
                      <div><p className="font-medium text-dark-200">{item.label}</p><p className="text-sm text-dark-500">{item.desc}</p></div>
                    </div>
                    <button onClick={() => toggle(item.key)} className={`w-12 h-6 rounded-full transition-colors relative ${notifs[item.key] ? 'bg-accent-cyan' : 'bg-dark-700'}`}>
                      <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${notifs[item.key] ? 'translate-x-6' : 'translate-x-0.5'}`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="card p-6">
              <h3 className="section-title mb-4 flex items-center gap-2"><Shield size={20} className="text-accent-cyan" /> Security Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-dark-500 mb-2">Current Password</label>
                  <div className="relative">
                    <input type={showPassword ? "text" : "password"} defaultValue="password123" className="input-field pr-10" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-500">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                  </div>
                </div>
                <div><label className="block text-sm text-dark-500 mb-2">New Password</label><input type="password" placeholder="Enter new password" className="input-field" /></div>
                <div><label className="block text-sm text-dark-500 mb-2">Confirm Password</label><input type="password" placeholder="Confirm new password" className="input-field" /></div>
                <div className="flex items-center gap-2 p-3 bg-emerald-500/10 rounded-xl"><Check size={18} className="text-emerald-400" /><p className="text-sm text-emerald-400">Two-factor authentication is enabled</p></div>
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="card p-6">
              <h3 className="section-title mb-4 flex items-center gap-2"><Moon size={20} className="text-accent-cyan" /> Appearance</h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-dark-800/50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-dark-700 flex items-center justify-center">{darkMode ? <Moon size={18} className="text-accent-cyan" /> : <Sun size={18} className="text-accent-cyan" />}</div>
                    <div><p className="font-medium text-dark-200">{darkMode ? 'Dark Mode' : 'Light Mode'}</p><p className="text-sm text-dark-500">Toggle the dashboard theme</p></div>
                  </div>
                  <button onClick={toggleTheme} className={`w-12 h-6 rounded-full transition-colors relative ${darkMode ? 'bg-accent-cyan' : 'bg-dark-700'}`}>
                    <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${darkMode ? 'translate-x-6' : 'translate-x-0.5'}`} />
                  </button>
                </div>
                <div>
                  <p className="font-medium text-dark-200 mb-3">Accent Color</p>
                  <div className="flex items-center gap-3">
                    {[
                      { id: 'cyan', color: '#00D4FF' },
                      { id: 'teal', color: '#00E5C9' },
                      { id: 'rose', color: '#FF6B8A' },
                      { id: 'amber', color: '#FFC542' },
                      { id: 'violet', color: '#A855F7' },
                    ].map(c => (
                      <button key={c.id} onClick={() => setAccentColor(c.id)} className={`w-9 h-9 rounded-full border-2 ${accentColor === c.id ? 'border-white' : 'border-transparent'}`} style={{ backgroundColor: c.color }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSave}>
            <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
              {saved ? <Check size={18} /> : <Save size={18} />} {saved ? 'Saved!' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Settings
