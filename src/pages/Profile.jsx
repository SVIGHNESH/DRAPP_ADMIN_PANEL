import React from 'react'
import { Camera, Mail, Phone, MapPin, Calendar, Award, BookOpen, Shield, Edit3 } from 'lucide-react'

const Profile = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="page-title">My Profile</h1><p className="text-dark-500 mt-1">Manage your profile information</p></div>
        <button className="btn-primary flex items-center gap-2"><Edit3 size={18} /> Edit Profile</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card p-6">
          <div className="text-center mb-6">
            <div className="relative inline-block">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-accent-cyan to-accent-teal flex items-center justify-center text-dark-900 text-4xl font-bold mx-auto mb-4">AD</div>
              <button className="absolute bottom-2 right-2 p-2 bg-dark-800 rounded-full border border-dark-700 text-dark-400 hover:text-accent-cyan"><Camera size={16} /></button>
            </div>
            <h2 className="text-xl font-bold text-dark-100">Admin Director</h2>
            <p className="text-accent-cyan font-medium">Hospital Administrator</p>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-dark-800/50 rounded-xl"><Mail size={18} className="text-accent-cyan" /><div><p className="text-xs text-dark-500">Email</p><p className="text-sm text-dark-200">admin@lifecare.com</p></div></div>
            <div className="flex items-center gap-3 p-3 bg-dark-800/50 rounded-xl"><Phone size={18} className="text-accent-teal" /><div><p className="text-xs text-dark-500">Phone</p><p className="text-sm text-dark-200">+1 (555) 000-0000</p></div></div>
            <div className="flex items-center gap-3 p-3 bg-dark-800/50 rounded-xl"><MapPin size={18} className="text-accent-rose" /><div><p className="text-xs text-dark-500">Location</p><p className="text-sm text-dark-200">Boston, MA</p></div></div>
            <div className="flex items-center gap-3 p-3 bg-dark-800/50 rounded-xl"><Calendar size={18} className="text-accent-amber" /><div><p className="text-xs text-dark-500">Joined</p><p className="text-sm text-dark-200">January 15, 2020</p></div></div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6">
            <h3 className="section-title mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="block text-sm text-dark-500 mb-2">Full Name</label><input type="text" defaultValue="Admin Director" className="input-field" readOnly /></div>
              <div><label className="block text-sm text-dark-500 mb-2">Username</label><input type="text" defaultValue="admin_director" className="input-field" readOnly /></div>
              <div><label className="block text-sm text-dark-500 mb-2">Email Address</label><input type="email" defaultValue="admin@lifecare.com" className="input-field" readOnly /></div>
              <div><label className="block text-sm text-dark-500 mb-2">Phone Number</label><input type="tel" defaultValue="+1 (555) 000-0000" className="input-field" readOnly /></div>
              <div className="md:col-span-2"><label className="block text-sm text-dark-500 mb-2">Address</label><input type="text" defaultValue="123 Hospital Ave, Boston, MA 02101" className="input-field" readOnly /></div>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="section-title mb-4">Professional Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-4 p-4 bg-dark-800/50 rounded-xl"><div className="w-12 h-12 rounded-xl bg-accent-cyan/20 flex items-center justify-center"><Shield size={24} className="text-accent-cyan" /></div><div><p className="text-sm text-dark-500">Role</p><p className="font-medium text-dark-200">Hospital Director</p></div></div>
              <div className="flex items-center gap-4 p-4 bg-dark-800/50 rounded-xl"><div className="w-12 h-12 rounded-xl bg-accent-teal/20 flex items-center justify-center"><Award size={24} className="text-accent-teal" /></div><div><p className="text-sm text-dark-500">Experience</p><p className="font-medium text-dark-200">15+ Years</p></div></div>
              <div className="flex items-center gap-4 p-4 bg-dark-800/50 rounded-xl"><div className="w-12 h-12 rounded-xl bg-accent-amber/20 flex items-center justify-center"><BookOpen size={24} className="text-accent-amber" /></div><div><p className="text-sm text-dark-500">Education</p><p className="font-medium text-dark-200">Harvard Business School</p></div></div>
              <div className="flex items-center gap-4 p-4 bg-dark-800/50 rounded-xl"><div className="w-12 h-12 rounded-xl bg-accent-rose/20 flex items-center justify-center"><Award size={24} className="text-accent-rose" /></div><div><p className="text-sm text-dark-500">Certifications</p><p className="font-medium text-dark-200">CHFP, FACHE</p></div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile