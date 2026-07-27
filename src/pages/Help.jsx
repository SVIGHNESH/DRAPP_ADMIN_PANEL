// import React from 'react'
// // import { Phone, Mail, MessageCircle, LifeBuoy, ChevronDown } from 'lucide-react'
// import { Phone, Mail, MessageCircle } from "lucide-react";

// // const faqs = [
// //   { q: 'How do I book a nurse for a user?', a: 'Go to the Bookings page and click "New Booking", then select a user and an available nurse.' },
// //   { q: 'How can I track a nurse\u2019s live location?', a: 'Open the Nurses page and click "Track Location" on any nurse card to see their last known location.' },
// //   { q: 'How do I contact a nurse directly?', a: 'Use the Call or Email buttons on the nurse card in the Nurses page.' },
// // ]

// const Help = () => {
//   return (
//     <div className="space-y-6">
//       <div><h1 className="page-title">Help & Support</h1><p className="text-dark-500 mt-1">We're here to help you anytime</p></div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         <div className="card p-6 lg:col-span-1">
//           <div className="w-12 h-12 rounded-xl bg-accent-cyan/15 flex items-center justify-center mb-4">
//             <Phone size={22} className="text-accent-cyan" />
//           </div>
//           <h3 className="section-title mb-1">Support Contact Number</h3>
//           <p className="text-sm text-dark-500 mb-3">Call us anytime for urgent help</p>
//           <a href="tel:+911234567890" className="text-2xl font-bold text-accent-cyan hover:underline">+91 12345 67890</a>
//           <p className="text-xs text-dark-500 mt-2">Replace this with your actual SDC support number</p>
//         </div>

//         <div className="card p-6 lg:col-span-1">
//           <div className="w-12 h-12 rounded-xl bg-accent-teal/15 flex items-center justify-center mb-4">
//             <Mail size={22} className="text-accent-teal" />
//           </div>
//           <h3 className="section-title mb-1">Email Support</h3>
//           <p className="text-sm text-dark-500 mb-3">Get a response within 24 hours</p>
//           <a href="mailto:support@carenest.app" className="text-lg font-semibold text-accent-teal hover:underline">support@carenest.app</a>
//         </div>

//         <div className="card p-6 lg:col-span-1">
//           <div className="w-12 h-12 rounded-xl bg-accent-amber/15 flex items-center justify-center mb-4">
//             <MessageCircle size={22} className="text-accent-amber" />
//           </div>
//           <h3 className="section-title mb-1">Live Chat</h3>
//           <p className="text-sm text-dark-500 mb-3">Chat with our support team</p>
//           <button className="btn-primary">Start Chat</button>
//         </div>
//       </div>

//       {/* <div className="card p-6">
//         <div className="flex items-center gap-2 mb-6">
//           <LifeBuoy size={20} className="text-accent-cyan" />
//           <h3 className="section-title">Frequently Asked Questions</h3>
//         </div>
//         <div className="space-y-3">
//           {faqs.map((item, i) => (
//             <details key={i} className="bg-dark-800/50 rounded-xl p-4 border border-dark-700/50 group">
//               <summary className="flex items-center justify-between cursor-pointer text-dark-200 font-medium list-none">
//                 {item.q}
//                 <ChevronDown size={16} className="text-dark-500 group-open:rotate-180 transition-transform" />
//               </summary>
//               <p className="text-sm text-dark-500 mt-3">{item.a}</p>
//             </details>
//           ))}
//         </div>
//       </div>
//     </div>
//   )
// } */}

// export default Help

import React from "react";
import { Phone, Mail } from "lucide-react";

const Help = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Help & Support</h1>
        <p className="text-dark-500 mt-1">
          We're here to help you anytime
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Support Number */}
        <div className="card p-6">
          <div className="w-12 h-12 rounded-xl bg-accent-cyan/15 flex items-center justify-center mb-4">
            <Phone size={22} className="text-accent-cyan" />
          </div>

          <h3 className="section-title mb-1">Support Contact Number</h3>
          <p className="text-sm text-dark-500 mb-3">
            Call us anytime for urgent help
          </p>

          <a
            href="tel:+911234567890"
            className="text-2xl font-bold text-accent-cyan hover:underline"
          >
            +91 12345 67890
          </a>

          <p className="text-xs text-dark-500 mt-2">
            Replace this with your actual support number
          </p>
        </div>

        {/* Email Support */}
        <div className="card p-6">
          <div className="w-12 h-12 rounded-xl bg-accent-teal/15 flex items-center justify-center mb-4">
            <Mail size={22} className="text-accent-teal" />
          </div>

          <h3 className="section-title mb-1">Email Support</h3>
          <p className="text-sm text-dark-500 mb-3">
            Get a response within 24 hours
          </p>

          <a
            href="mailto:support@carenest.app"
            className="text-lg font-semibold text-accent-teal hover:underline"
          >
            support@carenest.app
          </a>
        </div>
      </div>
    </div>
  );
};

export default Help;