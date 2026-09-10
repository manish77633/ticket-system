import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../components/AppLayout.jsx'
import ResponsiveScale from '../components/ResponsiveScale.jsx'
import CreateTicketModal from '../components/CreateTicketModal.jsx'
import StatusBadge, { StatusDot } from '../components/StatusBadge.jsx'
import { apiListTickets } from '../api.js'
import { useToast } from '../components/Toast.jsx'
import { timeAgo } from '../utils.js'

export default function Dashboard() {
  const navigate = useNavigate()
  const showToast = useToast()
  
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [createModal, setCreateModal] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const data = await apiListTickets()
        setTickets(Array.isArray(data) ? data : [])
      } catch (err) {
        showToast('Failed to load tickets.', 'error')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [showToast])

  const user = JSON.parse(localStorage.getItem('ticket_system_user') || 'null')
  const name = user?.name?.split(' ')[0] || 'there'
  const hr = new Date().getHours()
  const greet = hr < 12 ? 'Good morning' : hr < 18 ? 'Good afternoon' : 'Good evening'

  const total = tickets.length
  const openCount = tickets.filter(t => t.status === 'open').length
  const progCount = tickets.filter(t => t.status === 'in_progress').length
  const closedCount = tickets.filter(t => t.status === 'closed').length

  const recent = [...tickets].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 4)

  return (
    <AppLayout>
      <div style={{ width: '100%' }}>
        <div className="page-header">
          <div>
            <div className="page-greeting">Welcome Back</div>
            <h1 className="page-title">{greet}, {name}!</h1>
            <p className="page-subtitle">Here's an overview of your tickets.</p>
          </div>
          <button className="btn btn-primary btn-sm" onClick={() => setCreateModal(true)}>
            <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>
            Create Ticket
          </button>
        </div>

        <div className="stats-grid">
          <div className="stat-card stat-all" onClick={() => navigate('/tickets')}>
            <div className="stat-label">Total Tickets</div>
            <div className="stat-value">{loading ? <span className="skeleton skeleton-text" style={{ width: 40, display: 'inline-block' }}/> : total}</div>
          </div>
          <div className="stat-card stat-open" onClick={() => navigate('/tickets?filter=open')}>
            <div className="stat-label">Open</div>
            <div className="stat-value">{loading ? <span className="skeleton skeleton-text" style={{ width: 30, display: 'inline-block' }}/> : openCount}</div>
          </div>
          <div className="stat-card stat-prog" onClick={() => navigate('/tickets?filter=in_progress')}>
            <div className="stat-label">In Progress</div>
            <div className="stat-value">{loading ? <span className="skeleton skeleton-text" style={{ width: 30, display: 'inline-block' }}/> : progCount}</div>
          </div>
          <div className="stat-card stat-closed" onClick={() => navigate('/tickets?filter=closed')}>
            <div className="stat-label">Closed</div>
            <div className="stat-value">{loading ? <span className="skeleton skeleton-text" style={{ width: 30, display: 'inline-block' }}/> : closedCount}</div>
          </div>
        </div>

        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-900)' }}>Recent Tickets</h2>
            <button onClick={() => navigate('/tickets')} style={{ fontSize: 13, color: 'var(--brand-600)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>View all →</button>
          </div>

          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div className="ticket-row" style={{ pointerEvents: 'none' }}><div className="skeleton" style={{ height: 14, width: '55%' }}/><div className="skeleton skeleton-badge"/></div>
              <div className="ticket-row" style={{ pointerEvents: 'none' }}><div className="skeleton" style={{ height: 14, width: '40%' }}/><div className="skeleton skeleton-badge"/></div>
              <div className="ticket-row" style={{ pointerEvents: 'none' }}><div className="skeleton" style={{ height: 14, width: '65%' }}/><div className="skeleton skeleton-badge"/></div>
            </div>
          ) : recent.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <p style={{ fontSize: 14, color: 'var(--text-500)' }}>No tickets yet.</p>
              <button className="btn btn-primary btn-sm" style={{ marginTop: 12 }} onClick={() => setCreateModal(true)}>+ Create your first ticket</button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {recent.map(t => (
                <div key={t.id} className="ticket-row" onClick={() => navigate(`/tickets/${t.id}`)}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, overflow: 'hidden', flex: 1 }}>
                    <StatusDot status={t.status} />
                    <span className="ticket-title">{t.title}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                    <StatusBadge status={t.status} />
                    <span className="ticket-time">{timeAgo(t.created_at)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <CreateTicketModal
        open={createModal}
        onClose={() => setCreateModal(false)}
        onCreated={(newTicket) => setTickets(prev => [newTicket, ...prev])}
      />
    </AppLayout>
  )
}
