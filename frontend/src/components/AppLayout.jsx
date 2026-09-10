import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Sidebar from './Sidebar.jsx'

export default function AppLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="app-layout">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="main-content">
        {/* Mobile Header */}
        <div className="mobile-header">
          <Link to="/" className="sidebar-brand" style={{ padding: 0, margin: 0, border: 'none', textDecoration: 'none' }}>
            <div className="sidebar-brand-icon">
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"/></svg>
            </div>
            <div className="sidebar-brand-name" style={{ color: 'var(--text-900)' }}>Ticket System</div>
          </Link>
          <button
            className="mobile-menu-btn"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            style={{ display: 'flex' }}
          >
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
