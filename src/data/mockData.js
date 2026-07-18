export const statsData = [
  { id: 1, title: 'Total Users', value: '2,500+', change: '+10.4%', icon: 'Users', gradient: 'from-cyan-400 to-cyan-600', desc: 'Last Month' },
  { id: 2, title: 'Total Booking', value: '250+', change: '+8.6%', icon: 'Calendar', gradient: 'from-amber-400 to-amber-600', desc: 'Last Month' },
  { id: 3, title: 'Total Revenue', value: '$12,928', change: '+20.6%', icon: 'DollarSign', gradient: 'from-violet-400 to-violet-600', desc: 'Last Month' },
]

export const expenseData = [
  { name: 'Revenue', value: 58, fill: '#10B981' },
  { name: 'Expense', value: 24, fill: '#FF6B8A' },
  { name: 'Other', value: 18, fill: '#FFC542' },
]

export const bedData = [
  { name: 'ICU', occupied: 18, total: 24 },
  { name: 'General', occupied: 145, total: 200 },
  { name: 'Private', occupied: 42, total: 60 },
  { name: 'Emergency', occupied: 12, total: 20 },
]

export const bookingsData = [
  { id: 1, userName: 'Sarah Johnson', userId: 'US-001', nurse: 'Priya Sharma', careType: 'Elderly Care', date: '2024-06-21', time: '09:00 AM', status: 'confirmed', type: 'Follow-up', avatar: 'SJ', address: 'Sector 12, Bareilly' },
  { id: 2, userName: 'Robert Williams', userId: 'US-002', nurse: 'Anjali Verma', careType: 'Post-Surgery Care', date: '2024-06-21', time: '09:30 AM', status: 'in-progress', type: 'Consultation', avatar: 'RW', address: 'Civil Lines, Bareilly' },
  { id: 3, userName: 'Maria Garcia', userId: 'US-003', nurse: 'Ramesh Kumar', careType: 'Physiotherapy Support', date: '2024-06-21', time: '10:00 AM', status: 'pending', type: 'New User', avatar: 'MG', address: 'Rampur Garden, Bareilly' },
  { id: 4, userName: 'David Brown', userId: 'US-004', nurse: 'Sunita Devi', careType: 'Pediatric Care', date: '2024-06-21', time: '10:30 AM', status: 'confirmed', type: 'Vaccination', avatar: 'DB', address: 'Model Town, Bareilly' },
  { id: 5, userName: 'Jennifer Martinez', userId: 'US-005', nurse: 'Priya Sharma', careType: 'Elderly Care', date: '2024-06-21', time: '11:00 AM', status: 'cancelled', type: 'Check-up', avatar: 'JM', address: 'Sector 12, Bareilly' },
  { id: 6, userName: 'Thomas Anderson', userId: 'US-006', nurse: 'Anjali Verma', careType: 'Post-Surgery Care', date: '2024-06-21', time: '11:30 AM', status: 'completed', type: 'Follow-up', avatar: 'TA', address: 'Civil Lines, Bareilly' },
  { id: 7, userName: 'Lisa Thompson', userId: 'US-007', nurse: 'Arjun Singh', careType: 'Palliative Care', date: '2024-06-21', time: '02:00 PM', status: 'confirmed', type: 'Home Visit', avatar: 'LT', address: 'Cantt, Bareilly' },
  { id: 8, userName: 'Kevin Lee', userId: 'US-008', nurse: 'Neha Gupta', careType: 'General Nursing', date: '2024-06-21', time: '02:30 PM', status: 'pending', type: 'Routine Check', avatar: 'KL', address: 'Rajendra Nagar, Bareilly' },
]

export const nursesData = [
  { id: 1, name: 'Priya Sharma', gender: 'Female', careType: 'Elderly Care', experience: '8 years', rating: 4.9, clients: 247, status: 'active', avatar: 'PS', availability: 'Mon-Fri, 9AM-5PM', phone: '+91 90000 11111', email: 'priya.sharma@example.com', location: { address: 'Near Sector 12, Bareilly', lastUpdated: '2 mins ago' } },
  { id: 2, name: 'Anjali Verma', gender: 'Female', careType: 'Post-Surgery Care', experience: '6 years', rating: 4.8, clients: 192, status: 'active', avatar: 'AV', availability: 'Mon-Wed, 8AM-4PM', phone: '+91 90000 22222', email: 'anjali.verma@example.com', location: { address: 'Civil Lines, Bareilly', lastUpdated: '5 mins ago' } },
  { id: 3, name: 'Ramesh Kumar', gender: 'Male', careType: 'Physiotherapy Support', experience: '10 years', rating: 4.7, clients: 315, status: 'active', avatar: 'RK', availability: 'Tue-Sat, 10AM-6PM', phone: '+91 90000 33333', email: 'ramesh.kumar@example.com', location: { address: 'Rampur Garden, Bareilly', lastUpdated: '1 min ago' } },
  { id: 4, name: 'Sunita Devi', gender: 'Female', careType: 'Pediatric Care', experience: '9 years', rating: 4.9, clients: 268, status: 'active', avatar: 'SD', availability: 'Mon-Fri, 8AM-6PM', phone: '+91 90000 44444', email: 'sunita.devi@example.com', location: { address: 'Model Town, Bareilly', lastUpdated: '10 mins ago' } },
  { id: 5, name: 'Arjun Singh', gender: 'Male', careType: 'Palliative Care', experience: '5 years', rating: 4.6, clients: 134, status: 'on-leave', avatar: 'AS', availability: 'Unavailable', phone: '+91 90000 55555', email: 'arjun.singh@example.com', location: { address: 'Cantt, Bareilly', lastUpdated: '1 hour ago' } },
  { id: 6, name: 'Neha Gupta', gender: 'Female', careType: 'General Nursing', experience: '7 years', rating: 4.8, clients: 201, status: 'active', avatar: 'NG', availability: 'Mon-Thu, 9AM-5PM', phone: '+91 90000 66666', email: 'neha.gupta@example.com', location: { address: 'Rajendra Nagar, Bareilly', lastUpdated: '3 mins ago' } },
]

export const usersData = [
  { id: 1, name: 'Sarah Johnson', age: 34, gender: 'Female', bloodType: 'O+', careNeeded: 'Elderly Care', status: 'stable', address: 'Sector 12, Bareilly', nurse: 'Priya Sharma', avatar: 'SJ' },
  { id: 2, name: 'Robert Williams', age: 56, gender: 'Male', bloodType: 'A-', careNeeded: 'Post-Surgery Care', status: 'critical', address: 'Civil Lines, Bareilly', nurse: 'Anjali Verma', avatar: 'RW' },
  { id: 3, name: 'Maria Garcia', age: 28, gender: 'Female', bloodType: 'B+', careNeeded: 'Physiotherapy Support', status: 'stable', address: 'Rampur Garden, Bareilly', nurse: 'Ramesh Kumar', avatar: 'MG' },
  { id: 4, name: 'David Brown', age: 5, gender: 'Male', bloodType: 'O+', careNeeded: 'Pediatric Care', status: 'stable', address: 'Model Town, Bareilly', nurse: 'Sunita Devi', avatar: 'DB' },
  { id: 5, name: 'Jennifer Martinez', age: 42, gender: 'Female', bloodType: 'AB+', careNeeded: 'General Nursing', status: 'observation', address: 'Rajendra Nagar, Bareilly', nurse: 'Neha Gupta', avatar: 'JM' },
]

export const calendarDays = [
  { day: 'Mon', date: 11, active: true },
  { day: 'Tue', date: 12, active: false },
  { day: 'Wed', date: 13, active: false },
  { day: 'Thu', date: 14, active: false },
  { day: 'Fri', date: 15, active: false },
]

export const upcomingSchedule = [
  { id: 1, title: 'Elderly Care Visit', time: '10 AM - 1 PM', nurse: 'Priya Sharma', user: 'Devon Lane' },
  { id: 2, title: 'Post-Surgery Checkup', time: '2 PM (9 April, 2024)', nurse: 'Sunita Devi', user: 'Cameron Williamson' },
  { id: 3, title: 'Physiotherapy Session', time: '10 AM (10 April, 2024)', nurse: 'Ramesh Kumar', user: 'Eleanor Pena' },
]

export const sidebarLinks = [
  { name: 'Dashboard', path: '/dashboard', icon: 'LayoutDashboard' },
  { name: 'Booking', path: '/bookings', icon: 'Calendar' },
  { name: 'User', path: '/users', icon: 'UserRound' },
  { name: 'Nurses', path: '/nurses', icon: 'Stethoscope' },
]

export const sidebarReports = [
  { name: 'Analytics', path: '/analytics', icon: 'Activity' },
]

export const sidebarSettings = [
  { name: 'Help & Supports', path: '/help', icon: 'HelpCircle' },
  { name: 'Settings', path: '/settings', icon: 'Settings' },
]

export const getStatusColor = (status) => {
  const colors = {
    confirmed: 'bg-emerald-500/15 text-emerald-400',
    'in-progress': 'bg-cyan-500/15 text-cyan-400',
    pending: 'bg-amber-500/15 text-amber-400',
    cancelled: 'bg-rose-500/15 text-rose-400',
    completed: 'bg-dark-600 text-dark-400',
    active: 'bg-emerald-500/15 text-emerald-400',
    'on-leave': 'bg-amber-500/15 text-amber-400',
    stable: 'bg-emerald-500/15 text-emerald-400',
    critical: 'bg-rose-500/15 text-rose-400',
    observation: 'bg-cyan-500/15 text-cyan-400',
  }
  return colors[status] || 'bg-dark-600 text-dark-400'
}
