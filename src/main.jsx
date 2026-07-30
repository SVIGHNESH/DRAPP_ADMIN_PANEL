import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import App from './App.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import './index.css';

// react-hot-toast stays. tickets/T05-component-inventory.md weighed swapping it
// for shadcn's Sonner and decided the swap buys nothing here: a toast is one of
// the few things whose styling is fully reachable from the outside, so driving
// it from the tokens costs this block, where swapping the library would cost a
// touch on every page that reports success or failure. Toasts are one of the
// three things T03 lets cast a shadow.
const toastOptions = {
  duration: 4000,
  style: {
    background: 'var(--surface)',
    color: 'var(--fg)',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    boxShadow: 'var(--shadow-popover)',
    fontSize: '13px',
    lineHeight: '20px',
    padding: '8px 12px',
    maxWidth: '380px',
  },
  success: { iconTheme: { primary: 'var(--success)', secondary: 'var(--surface)' } },
  error: { iconTheme: { primary: 'var(--danger)', secondary: 'var(--surface)' } },
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Toaster
            position="top-right"
            reverseOrder={false}
            gutter={8}
            toastOptions={toastOptions}
          />
          <App />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);
