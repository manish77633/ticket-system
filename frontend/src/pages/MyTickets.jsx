import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import AppLayout from '../components/AppLayout.jsx'
import CreateTicketModal from '../components/CreateTicketModal.jsx'
import StatusBadge, { StatusDot } from '../components/StatusBadge.jsx'
import { apiListTickets } from '../api.js'
import { useToast } from '../components/Toast.jsx'
import { timeAgo } from '../utils.js'

export default function MyTickets() {
  const navigate = useNavigate()
  const showToast = useToast()
  const [searchParams, setSearchParams] = useSearchParams()
  
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [createModal, setCreateModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const activeFilter = searchParams.get('filter') || 'all'

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

  function setFilter(f) {
    if (f === 'all') searchParams.delete('filter')
    else searchParams.set('filter', f)
    setSearchParams(searchParams)
  }

  let filtered = tickets
  if (activeFilter !== 'all') {
    filtered = filtered.filter(t => t.status === activeFilter)
  }
  if (searchQuery) {
    filtered = filtered.filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()))
  }
  filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

  return (
    <AppLayout>
      <div className="page-header">
        <div>
          <h1 className="page-title">My Tickets</h1>
          <p className="page-subtitle">Everything you've created, in one place.</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setCreateModal(true)}>
          <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>
          Create Ticket
        </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
        <div className="search-wrap" style={{ flex: 1, minWidth: 200 }}>
          <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          <input
            type="search"
            className="search-input"
            placeholder="Search tickets..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="filter-tabs" style={{ marginBottom: 0 }}>
          {['all', 'open', 'in_progress', 'closed'].map(f => (
            <button
              key={f}
              className={`filter-tab${activeFilter === f ? ' active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f === 'all' ? 'All' : f === 'in_progress' ? 'In Progress' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="card" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="ticket-table" style={{ padding: 0 }}>
            <thead>
              <tr>
                <th style={{ padding: '16px 20px 12px' }}>Ticket Title</th>
                <th style={{ padding: '16px 12px 12px' }}>Status</th>
                <th style={{ padding: '16px 20px 12px', textAlign: 'right' }}>Created</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <>
                  <tr><td style={{ padding: '14px 20px' }}><div className="skeleton" style={{ height: 14, width: '50%' }}/></td><td><div className="skeleton skeleton-badge"/></td><td style={{ padding: '14px 20px', textAlign: 'right' }}><div className="skeleton" style={{ height: 12, width: 60, marginLeft: 'auto' }}/></td></tr>
                  <tr><td style={{ padding: '14px 20px' }}><div className="skeleton" style={{ height: 14, width: '65%' }}/></td><td><div className="skeleton skeleton-badge"/></td><td style={{ padding: '14px 20px', textAlign: 'right' }}><div className="skeleton" style={{ height: 12, width: 60, marginLeft: 'auto' }}/></td></tr>
                </>
              ) : filtered.length === 0 ? null : (
                filtered.map(t => (
                  <tr key={t.id} onClick={() => navigate(`/tickets/${t.id}`)} style={{ cursor: 'pointer', transition: 'background .12s' }}>
                    <td style={{ padding: '14px 20px' }}>
                      <div className="td-title">
                        <StatusDot status={t.status} />
                        <span>{t.title}</span>
                      </div>
                    </td>
                    <td style={{ padding: '14px 12px' }}><StatusBadge status={t.status} /></td>
                    <td style={{ padding: '14px 20px', textAlign: 'right', fontSize: 12, color: 'var(--text-400)', fontWeight: 400 }}>{timeAgo(t.created_at)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {!loading && filtered.length === 0 && (
          <div style={{ padding: '60px 24px', textAlign: 'center' }}>
            <svg width="48" height="48" fill="none" stroke="var(--text-400)" strokeWidth="1.5" viewBox="0 0 24 24" style={{ margin: '0 auto 16px', display: 'block' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
            </svg>
            <p style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-700)', marginBottom: 6 }}>No tickets found</p>
            <p style={{ fontSize: 13, color: 'var(--text-400)', marginBottom: 20 }}>Create your first ticket to get started.</p>
            <button className="btn btn-primary btn-sm" onClick={() => setCreateModal(true)}>+ Create Ticket</button>
          </div>
        )}
      </div>

      <CreateTicketModal
        open={createModal}
        onClose={() => setCreateModal(false)}
        onCreated={(newTicket) => setTickets(prev => [newTicket, ...prev])}
      />
    </AppLayout>
  )
}
