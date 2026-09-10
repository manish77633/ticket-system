import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import AppLayout from '../components/AppLayout.jsx'
import ConfirmModal from '../components/ConfirmModal.jsx'
import StatusBadge from '../components/StatusBadge.jsx'
import { apiGetTicket, apiUpdateStatus } from '../api.js'
import { useToast } from '../components/Toast.jsx'
import { formatDate, getNextStatus, getNextStatusLabel } from '../utils.js'

export default function TicketDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const showToast = useToast()

  const [ticket, setTicket] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const [confirmOpen, setConfirmOpen] = useState(false)
  const [pendingStatus, setPendingStatus] = useState(null)
  const [confirmLoading, setConfirmLoading] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const data = await apiGetTicket(id)
        setTicket(data)
        document.title = `#${data.id} ${data.title} — Ticket System`
      } catch (err) {
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  if (loading) {
    return (
      <AppLayout>
        <div className="breadcrumb" style={{ marginBottom: 28 }}><div className="skeleton" style={{ height: 13, width: 120 }}/></div>
        <div className="ticket-detail-card">
          <div className="skeleton skeleton-title" style={{ marginBottom: 16 }}/>
          <div className="skeleton skeleton-text" style={{ width: '80%' }}/>
          <div className="skeleton skeleton-text" style={{ width: '60%' }}/>
        </div>
        <div className="ticket-detail-card">
          <div className="ticket-info-grid">
            <div><div className="skeleton" style={{ height: 10, width: 60, marginBottom: 8 }}/><div className="skeleton skeleton-text" style={{ width: 80 }}/></div>
            <div><div className="skeleton" style={{ height: 10, width: 60, marginBottom: 8 }}/><div className="skeleton skeleton-text" style={{ width: 90 }}/></div>
            <div><div className="skeleton" style={{ height: 10, width: 60, marginBottom: 8 }}/><div className="skeleton skeleton-badge"/></div>
          </div>
        </div>
      </AppLayout>
    )
  }

  if (error || !ticket) {
    return (
      <AppLayout>
        <div className="error-page">
          <div className="error-icon">❌</div>
          <h1 className="error-title">Ticket not found</h1>
          <p className="error-message">The ticket you're looking for could not be found or you don't have access.</p>
          <Link to="/tickets" className="btn btn-primary">← Back to My Tickets</Link>
        </div>
      </AppLayout>
    )
  }

  function initiateTransition() {
    const next = getNextStatus(ticket.status)
    if (next) {
      setPendingStatus(next)
      setConfirmOpen(true)
    }
  }

  async function confirmTransition() {
    if (!pendingStatus) return
    setConfirmLoading(true)
    try {
      const updated = await apiUpdateStatus(ticket.id, pendingStatus)
      setTicket(updated)
      showToast(`Ticket moved to ${pendingStatus.replace('_', ' ').toUpperCase()} ✓`)
      setConfirmOpen(false)
    } catch (err) {
      showToast(err.message || 'Failed to update status.', 'error')
    } finally {
      setConfirmLoading(false)
    }
  }

  const isClosing = pendingStatus === 'closed'
  const actionNext = getNextStatus(ticket.status)
  const actionLabel = getNextStatusLabel(ticket.status)

  const statusToStep = { open: 0, in_progress: 1, closed: 2 }
  const currentStep = statusToStep[ticket.status] ?? 0

  return (
    <AppLayout>
      <div className="breadcrumb">
        <Link to="/tickets">
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ verticalAlign: 'middle', marginRight: 2 }}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
          Back to My Tickets
        </Link>
        <span>›</span>
        <span style={{ color: 'var(--text-700)', fontWeight: 500 }}>{ticket.title}</span>
      </div>

      <div className="ticket-detail-card">
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-900)', letterSpacing: '-.01em', marginBottom: 12 }}>{ticket.title}</h1>
            <p style={{ fontSize: 14, color: 'var(--text-500)', lineHeight: 1.7 }}>{ticket.description || 'No description provided.'}</p>
          </div>
          <div><StatusBadge status={ticket.status} /></div>
        </div>
      </div>

      <div className="ticket-detail-card">
        <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-900)', marginBottom: 20 }}>Ticket Information</h2>
        <div className="ticket-info-grid">
          <div className="ticket-info-item">
            <div className="info-label">Ticket ID</div>
            <div className="info-value">#{ticket.id}</div>
          </div>
          <div className="ticket-info-item">
            <div className="info-label">Created</div>
            <div className="info-value">{formatDate(ticket.created_at)}</div>
          </div>
          <div className="ticket-info-item">
            <div className="info-label">Status</div>
            <div className="info-value"><StatusBadge status={ticket.status} /></div>
          </div>
        </div>
      </div>

      <div className="ticket-detail-card">
        <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-900)', marginBottom: 8 }}>Ticket Status</h2>
        <p style={{ fontSize: 13, color: 'var(--text-500)', marginBottom: 16 }}>
          {ticket.status === 'closed' ? 'Your ticket is closed.' : `Your ticket is currently ${ticket.status === 'open' ? 'open' : 'in progress'}.`}
        </p>

        <div className="status-timeline">
          <div className={`timeline-step${currentStep > 0 ? ' done' : currentStep === 0 ? ' active' : ''}`}>
            <div className="timeline-step-circle"><svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/></svg></div>
            <div className="timeline-step-label">Open</div>
          </div>
          <div className={`timeline-line${currentStep > 0 ? ' done' : ''}`}/>
          <div className={`timeline-step${currentStep > 1 ? ' done' : currentStep === 1 ? ' active' : ''}`}>
            <div className="timeline-step-circle"><svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg></div>
            <div className="timeline-step-label">In Progress</div>
          </div>
          <div className={`timeline-line${currentStep > 1 ? ' done' : ''}`}/>
          <div className={`timeline-step${currentStep === 2 ? ' active' : ''}`}>
            <div className="timeline-step-circle"><svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg></div>
            <div className="timeline-step-label">Closed</div>
          </div>
        </div>

        {ticket.status === 'closed' ? (
          <div style={{ marginTop: 16, padding: '14px 16px', background: 'var(--closed-bg)', border: '1px solid var(--closed-border)', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
            <svg width="18" height="18" fill="none" stroke="var(--closed-dot)" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--closed-text)' }}>Ticket Closed — This ticket is complete and cannot be reopened.</span>
          </div>
        ) : (
          <div style={{ marginTop: 20 }}>
            <button
              className="btn btn-primary"
              style={ticket.status === 'in_progress' ? { background: '#10b981', boxShadow: '0 4px 12px rgba(16,185,129,.3)' } : {}}
              onClick={initiateTransition}
            >
              {actionLabel}
            </button>
          </div>
        )}
      </div>

      <ConfirmModal
        open={confirmOpen}
        title={isClosing ? 'Close this ticket?' : 'Move ticket to In Progress?'}
        message={isClosing ? 'Are you sure you want to close this ticket? This action cannot be undone.' : 'Are you sure you want to move this ticket to In Progress?'}
        confirmLabel={isClosing ? 'Close Ticket' : 'Move to In Progress'}
        confirmStyle={isClosing ? {
          iconBg: '#ecfdf5',
          btn: { background: '#10b981', boxShadow: '0 4px 12px rgba(16,185,129,.3)' },
          icon: <svg width="26" height="26" fill="none" stroke="#10b981" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        } : {}}
        onConfirm={confirmTransition}
        onCancel={() => setConfirmOpen(false)}
        loading={confirmLoading}
      />
    </AppLayout>
  )
}
