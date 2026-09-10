import React, { useEffect } from 'react'

export default function ConfirmModal({ open, title, message, confirmLabel, confirmStyle = {}, onConfirm, onCancel, loading }) {
  // Close on Escape
  useEffect(() => {
    if (!open) return
    const handler = (e) => { if (e.key === 'Escape') onCancel() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onCancel])

  return (
    <div
      className={`modal-overlay${open ? ' open' : ''}`}
      onClick={(e) => e.target === e.currentTarget && onCancel()}
    >
      <div className="modal-box" style={{ maxWidth: 400, textAlign: 'center' }}>
        {/* Icon */}
        <div className="confirm-icon" style={confirmStyle.iconBg ? { background: confirmStyle.iconBg } : { background: '#fffbeb' }}>
          {confirmStyle.icon || (
            <svg width="26" height="26" fill="none" stroke="#f59e0b" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
          )}
        </div>
        <h3 className="confirm-title">{title}</h3>
        <p className="confirm-message">{message}</p>
        <div className="confirm-actions">
          <button className="btn btn-secondary" onClick={onCancel} disabled={loading}>Cancel</button>
          <button
            className="btn btn-primary"
            style={confirmStyle.btn || {}}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? 'Updating...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
