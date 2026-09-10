import React, { useState, useEffect } from 'react'
import { apiCreateTicket } from '../api.js'
import { useToast } from './Toast.jsx'

export default function CreateTicketModal({ open, onClose, onCreated }) {
  const showToast = useToast()
  const [title, setTitle]   = useState('')
  const [desc, setDesc]     = useState('')
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)

  // Reset on open
  useEffect(() => {
    if (open) { setTitle(''); setDesc(''); setError('') }
  }, [open])

  // Escape to close
  useEffect(() => {
    if (!open) return
    const h = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [open, onClose])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const ticket = await apiCreateTicket(title.trim(), desc.trim())
      onCreated(ticket)
      showToast('Ticket created successfully! ✓')
      onClose()
    } catch (err) {
      setError(err.message || 'Failed to create ticket.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className={`modal-overlay${open ? ' open' : ''}`}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal-box">
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: 16, right: 16, color: 'var(--text-400)', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-900)', marginBottom: 4 }}>Create a new ticket</h2>
        <p style={{ fontSize: 13, color: 'var(--text-500)', marginBottom: 24 }}>Fill in the details below to open a ticket.</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Title</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Fix login validation issue"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              maxLength={120}
              autoFocus
            />
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-input"
              placeholder="Describe the issue in detail..."
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              required
              style={{ minHeight: 100 }}
            />
          </div>
          {error && (
            <div style={{ marginBottom: 14, padding: '10px 14px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, fontSize: 13, color: '#dc2626' }}>
              {error}
            </div>
          )}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-secondary btn-sm" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary btn-sm" disabled={loading}>
              {loading ? 'Creating...' : 'Create Ticket'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
