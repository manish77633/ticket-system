import React from 'react'
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--surface-50)' }}>
      <div style={{ textAlign: 'center', padding: '40px 24px', maxWidth: 440 }}>
        {/* Icon */}
        <div style={{
          width: 100, height: 100, borderRadius: '50%', background: '#fef2f2', border: '1.5px solid #fecaca',
          display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 28px',
          animation: 'pulse-icon 2s ease-in-out infinite'
        }}>
          <svg width="44" height="44" fill="none" stroke="#ef4444" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </div>

        <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-900)', letterSpacing: '-.02em', marginBottom: 10 }}>
          Page not found
        </h1>
        <p style={{ fontSize: 15, color: 'var(--text-500)', lineHeight: 1.65, marginBottom: 36 }}>
          The page you're looking for could not be found.<br/>It may have been deleted or the URL is incorrect.
        </p>

        <Link to="/dashboard" className="btn btn-primary" style={{ borderRadius: 12, padding: '13px 28px', fontSize: 15, textDecoration: 'none', display: 'inline-flex' }}>
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
          Back to Dashboard
        </Link>

        {/* Brand */}
        <div style={{ marginTop: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <div style={{ width: 24, height: 24, borderRadius: 7, background: 'var(--brand-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"/></svg>
          </div>
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-700)' }}>Ticket System</span>
        </div>
      </div>
    </div>
  )
}
