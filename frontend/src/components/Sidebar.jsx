import React from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { logout, getUser } from '../api.js'
import { getInitials } from '../utils.js'

export default function Sidebar({ mobileOpen, onClose }) {
  const navigate = useNavigate()
  const user = getUser()

  function handleLogout() {
    logout()
    navigate('/auth')
  }

  const navLinkClass = ({ isActive }) =>
    `nav-item${isActive ? ' active' : ''}`

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div className="sidebar-backdrop open" onClick={onClose} />
      )}

      <aside className={`sidebar${mobileOpen ? ' open' : ''}`} id="sidebar">
        <div>
          {/* Brand */}
          <Link to="/" className="sidebar-brand" style={{ textDecoration: 'none' }}>
            <div className="sidebar-brand-icon">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"/>
              </svg>
            </div>
            <span className="sidebar-brand-name">Ticket System</span>
          </Link>

          {/* Nav */}
          <nav onClick={onClose}>
            <NavLink to="/dashboard" className={navLinkClass}>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" strokeWidth="2"/>
              </svg>
              Dashboard
            </NavLink>

            <NavLink to="/tickets" className={navLinkClass}>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/>
              </svg>
              My Tickets
            </NavLink>

            <a href="#" className="nav-item" style={{ marginTop: 8 }} onClick={(e) => e.preventDefault()}>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              Settings
            </a>
          </nav>
        </div>

        {/* User / Logout */}
        <div>
          <button
            onClick={handleLogout}
            className="nav-item"
            style={{ width: '100%', marginBottom: 10, color: '#94a3b8', cursor: 'pointer', background: 'none', border: 'none', textAlign: 'left' }}
            onMouseOver={e => e.currentTarget.style.color = '#fff'}
            onMouseOut={e => e.currentTarget.style.color = '#94a3b8'}
          >
            <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
            Logout
          </button>
          <div className="sidebar-avatar">
            <div className="avatar-circle">
              {getInitials(user?.name || user?.email || 'U')}
            </div>
            <div>
              <div className="avatar-name">{user?.name || 'User'}</div>
              <div className="avatar-role">Workspace Member</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
