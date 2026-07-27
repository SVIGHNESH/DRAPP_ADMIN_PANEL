// import React from 'react';
// import {
//   LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
//   BarChart, Bar, PieChart, Pie, Cell, Legend
// } from 'recharts';

// // Patient Trends Data
// const patientTrendsData = [
//   { month: 'Jan', patients: 120, discharged: 100, admitted: 130 },
//   { month: 'Feb', patients: 150, discharged: 140, admitted: 160 },
//   { month: 'Mar', patients: 180, discharged: 170, admitted: 190 },
//   { month: 'Apr', patients: 200, discharged: 190, admitted: 210 },
//   { month: 'May', patients: 170, discharged: 165, admitted: 175 },
//   { month: 'Jun', patients: 220, discharged: 210, admitted: 230 },
//   { month: 'Jul', patients: 250, discharged: 240, admitted: 260 },
//   { month: 'Aug', patients: 230, discharged: 225, admitted: 235 },
//   { month: 'Sep', patients: 210, discharged: 205, admitted: 215 },
//   { month: 'Oct', patients: 190, discharged: 185, admitted: 195 },
//   { month: 'Nov', patients: 240, discharged: 230, admitted: 250 },
//   { month: 'Dec', patients: 280, discharged: 270, admitted: 290 },
// ];

// // Department Revenue Data
// const departmentData = [
//   { name: 'Cardiology', value: 450000, color: '#00d4ff' },
//   { name: 'Orthopedics', value: 320000, color: '#0ea5e9' },
//   { name: 'Neurology', value: 280000, color: '#6366f1' },
//   { name: 'Pediatrics', value: 200000, color: '#8b5cf6' },
//   { name: 'Dermatology', value: 150000, color: '#ec4899' },
//   { name: 'ENT', value: 100000, color: '#f43f5e' },
// ];

// // Nurse Performance Data
// const nursePerformanceData = [
//   { name: 'Priya Sharma', clients: 450, rating: 4.8, availability: 95 },
//   { name: 'Anjali Verma', clients: 380, rating: 4.6, availability: 88 },
//   { name: 'Ramesh Kumar', clients: 520, rating: 4.9, availability: 92 },
//   { name: 'Sunita Devi', clients: 310, rating: 4.5, availability: 85 },
//   { name: 'Arjun Singh', clients: 420, rating: 4.7, availability: 90 },
// ];

// // Booking Analytics
// const appointmentData = [
//   { status: 'Completed', count: 1250, color: '#00d4ff' },
//   { status: 'No-Show', count: 180, color: '#f43f5e' },
//   { status: 'Cancelled', count: 120, color: '#f59e0b' },
//   { status: 'Rescheduled', count: 95, color: '#8b5cf6' },
// ];

// const StatCard = ({ title, value, icon, trend, trendUp }) => (
//   <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
//     <div className="flex items-center justify-between mb-3">
//       <span className="text-gray-400 text-sm">{title}</span>
//       <span className="text-2xl">{icon}</span>
//     </div>
//     <div className="text-2xl font-bold text-white mb-2">{value}</div>
//     <div className={`text-sm flex items-center gap-1 ${trendUp ? 'text-green-400' : 'text-red-400'}`}>
//       <span>{trendUp ? '▲' : '▼'}</span>
//       <span>{trend}</span>
//     </div>
//   </div>
// );

// export default function Analytics() {
//   return (
//     <div className="p-6 bg-gray-900 min-h-screen">
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold text-white mb-2">Analytics Dashboard</h1>
//         <p className="text-gray-400">Hospital performance metrics & insights</p>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
//         <StatCard title="Total Users" value="2,450" icon="👥" trend="12.5%" trendUp={true} />
//         <StatCard title="User Satisfaction" value="4.7/5" icon="⭐" trend="2.4%" trendUp={true} />
//       </div>

//       {/* Charts Row 1 */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
//         {/* Patient Trends */}
//         <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
//           <h3 className="text-lg font-semibold text-white mb-4">Patient Trends (Monthly)</h3>
//           <ResponsiveContainer width="100%" height={300}>
//             <LineChart data={patientTrendsData}>
//               <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
//               <XAxis dataKey="month" stroke="#9ca3af" />
//               <YAxis stroke="#9ca3af" />
//               <Tooltip 
//                 contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
//                 labelStyle={{ color: '#fff' }}
//               />
//               <Legend />
//               <Line type="monotone" dataKey="patients" stroke="#00d4ff" strokeWidth={2} dot={{ fill: '#00d4ff' }} />
//               <Line type="monotone" dataKey="admitted" stroke="#0ea5e9" strokeWidth={2} dot={{ fill: '#0ea5e9' }} />
//               <Line type="monotone" dataKey="discharged" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981' }} />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>

//         {/* Department Revenue */}
//         <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
//           <h3 className="text-lg font-semibold text-white mb-4">Revenue by Department</h3>
//           <ResponsiveContainer width="100%" height={300}>
//             <PieChart>
//               <Pie
//                 data={departmentData}
//                 cx="50%"
//                 cy="50%"
//                 innerRadius={60}
//                 outerRadius={100}
//                 paddingAngle={5}
//                 dataKey="value"
//               >
//                 {departmentData.map((entry, index) => (
//                   <Cell key={`cell-${index}`} fill={entry.color} />
//                 ))}
//               </Pie>
//               <Tooltip 
//                 formatter={(value) => `₹${value.toLocaleString()}`}
//                 contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
//               />
//               <Legend />
//             </PieChart>
//           </ResponsiveContainer>
//         </div>
//       </div>

//       {/* Charts Row 2 */}
//       <div className="grid grid-cols-1 gap-6 mb-6">
//         {/* Nurse Performance */}
//         <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
//           <h3 className="text-lg font-semibold text-white mb-4">Nurse Performance</h3>
//           <ResponsiveContainer width="100%" height={300}>
//             <BarChart data={nursePerformanceData}>
//               <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
//               <XAxis dataKey="name" stroke="#9ca3af" />
//               <YAxis stroke="#9ca3af" />
//               <Tooltip 
//                 contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
//               />
//               <Legend />
//               <Bar dataKey="clients" fill="#00d4ff" radius={[4, 4, 0, 0]} />
//               <Bar dataKey="rating" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>
//       </div>

//       {/* Booking Analytics */}
//       <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
//         <h3 className="text-lg font-semibold text-white mb-4">Booking Analytics</h3>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <ResponsiveContainer width="100%" height={250}>
//             <PieChart>
//               <Pie
//                 data={appointmentData}
//                 cx="50%"
//                 cy="50%"
//                 outerRadius={80}
//                 dataKey="count"
//                 label={({ status, percent }) => `${status} ${(percent * 100).toFixed(0)}%`}
//               >
//                 {appointmentData.map((entry, index) => (
//                   <Cell key={`cell-${index}`} fill={entry.color} />
//                 ))}
//               </Pie>
//               <Tooltip 
//                 contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
//               />
//             </PieChart>
//           </ResponsiveContainer>
//           <div className="flex flex-col justify-center gap-4">
//             {appointmentData.map((item) => (
//               <div key={item.status} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
//                 <div className="flex items-center gap-3">
//                   <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }}></div>
//                   <span className="text-white">{item.status}</span>
//                 </div>
//                 <span className="text-white font-semibold">{item.count}</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }