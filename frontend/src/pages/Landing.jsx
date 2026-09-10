import React, { useState } from 'react'
import { Link, useNavigate, Navigate } from 'react-router-dom'
import ResponsiveScale from '../components/ResponsiveScale.jsx'
import { apiLogin, apiRegister, isLoggedIn } from '../api.js'
import { useToast } from '../components/Toast.jsx'

/* ── Mini hero ticket state ─────────────────────────────── */
const INITIAL = [
  { title: 'Fix login validation',      status: 'open',        desc: 'Unable to login with valid credentials.\nPlease check the authentication flow.' },
  { title: 'Update profile page',       status: 'in_progress', desc: 'Redesign the user profile page to match the new mockup.' },
  { title: 'Payment integration issue', status: 'closed',      desc: 'Stripe webhook is failing in production. Need immediate fix.' },
  { title: 'UI improvements & polish',  status: 'open',        desc: 'General cleanup of the dashboard UI components.' },
]

const STATUS_ORDER = ['open', 'in_progress', 'closed']

const LANDING_TICKETS = [
  { id: 1, title: 'Fix login validation issue',          status: 'open',        time: '2 hours ago' },
  { id: 2, title: 'Update user profile page layout',     status: 'in_progress', time: '5 hours ago' },
  { id: 3, title: 'Payment integration callback',        status: 'closed',      time: '1 day ago'   },
  { id: 4, title: 'UI improvements & responsive polish', status: 'open',        time: '2 days ago'  },
  { id: 5, title: 'API rate limiting on auth endpoints', status: 'in_progress', time: '3 days ago'  },
  { id: 6, title: 'Export ticket records to CSV',        status: 'closed',      time: '4 days ago'  },
]

function getBadgeClass(s) {
  return s === 'open' ? 'badge badge-open' : s === 'in_progress' ? 'badge badge-progress' : 'badge badge-closed'
}
function getBadgeLabel(s) {
  return s === 'open' ? 'OPEN' : s === 'in_progress' ? 'IN PROGRESS' : 'CLOSED'
}
function getDotClass(s) {
  return s === 'open' ? 'dot dot-open' : s === 'in_progress' ? 'dot dot-progress' : 'dot dot-closed'
}

export default function Landing() {
  const navigate   = useNavigate()
  const showToast  = useToast()

  const loggedIn = isLoggedIn()

  const [miniTickets, setMiniTickets]       = useState(INITIAL)
  const [demoTickets, setDemoTickets]       = useState(LANDING_TICKETS)
  const [demoFilter, setDemoFilter]         = useState('all')
  const [createModal, setCreateModal]       = useState(false)
  const [newTitle, setNewTitle]             = useState('')
  const [newDesc, setNewDesc]               = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Dummy Dashboard state
  const [miniView, setMiniView]             = useState('dashboard') // 'dashboard', 'create', 'details'
  const [miniSelected, setMiniSelected]     = useState(null)
  const [miniCreateTitle, setMiniCreateTitle] = useState('Fix login validation')
  const [miniCreateDesc, setMiniCreateDesc]   = useState('Unable to login with valid credentials.\nPlease check the authentication flow.')

  /* Mini hero */
  function handleMiniSubmit() {
    setMiniTickets(prev => [{ title: miniCreateTitle, desc: miniCreateDesc, status: 'open' }, ...prev])
    setMiniView('dashboard')
    setMiniCreateTitle('Fix login validation')
    setMiniCreateDesc('Unable to login with valid credentials.\nPlease check the authentication flow.')
    showToast('Dummy ticket created!')
  }

  function advanceMiniTicket() {
    if (miniSelected === null) return
    const t = miniTickets[miniSelected]
    if (t.status === 'closed') return
    const nextStatus = t.status === 'open' ? 'in_progress' : 'closed'
    setMiniTickets(prev => {
      const next = [...prev]
      next[miniSelected] = { ...next[miniSelected], status: nextStatus }
      return next
    })
    showToast(`Updated to ${nextStatus.replace('_', ' ').toUpperCase()}`)
  }

  const miniOpen   = miniTickets.filter(t => t.status === 'open').length
  const miniProg   = miniTickets.filter(t => t.status === 'in_progress').length
  const miniClosed = miniTickets.filter(t => t.status === 'closed').length

  /* Demo table */
  function advanceDemoTicket(id) {
    setDemoTickets(prev => prev.map(t => {
      if (t.id !== id) return t
      const idx  = STATUS_ORDER.indexOf(t.status)
      const next = STATUS_ORDER[(idx + 1) % 3]
      showToast(`Updated to ${next.replace('_', ' ').toUpperCase()}`)
      return { ...t, status: next }
    }))
  }

  const filteredDemo = demoFilter === 'all' ? demoTickets : demoTickets.filter(t => t.status === demoFilter)


  /* Create demo ticket */
  function handleCreateDemo(e) {
    e.preventDefault()
    setDemoTickets(prev => [{ id: Date.now(), title: newTitle, status: 'open', time: 'Just now' }, ...prev])
    showToast('Ticket added to demo! Sign up to save permanently.')
    setCreateModal(false)
    setNewTitle(''); setNewDesc('')
  }

  return (
    <>
      {/* ── NAV ──────────────────────────────────────────── */}
      <header className="landing-nav">
        <div className="nav-inner">
          <Link to="/" className="brand-logo">
            <div className="brand-icon">
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"/>
              </svg>
            </div>
            <span className="brand-name">Ticket System</span>
          </Link>
          <nav className="nav-links">
            <a href="#how-it-works">How It Works</a>
            <a href="#features">Features</a>
          </nav>
          <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {loggedIn ? (
              <button className="btn btn-primary btn-sm" onClick={() => navigate('/dashboard')}>Go to Dashboard</button>
            ) : (
              <>
                <button className="btn btn-ghost btn-sm" onClick={() => navigate('/auth')}>Sign In</button>
                <button className="btn btn-primary btn-sm" onClick={() => navigate('/auth?mode=register')}>Get Started</button>
              </>
            )}
          </div>
          <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}/>
            </svg>
          </button>
        </div>
        {mobileMenuOpen && (
          <div style={{ position:'absolute',top:64,left:0,right:0,background:'#fff',borderBottom:'1px solid var(--surface-200)',padding:24,display:'flex',flexDirection:'column',gap:16,boxShadow:'0 10px 15px -3px rgba(0,0,0,0.1)',zIndex:40 }}>
            <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} style={{ fontSize:16,fontWeight:600,color:'var(--text-700)' }}>How It Works</a>
            <a href="#features" onClick={() => setMobileMenuOpen(false)} style={{ fontSize:16,fontWeight:600,color:'var(--text-700)' }}>Features</a>
            <div style={{ height:1,background:'var(--surface-200)',margin:'8px 0' }}/>
            {loggedIn ? (
              <button className="btn btn-primary" style={{ width:'100%',justifyContent:'center' }} onClick={() => navigate('/dashboard')}>Go to Dashboard</button>
            ) : (
              <>
                <button className="btn btn-secondary" style={{ width:'100%',justifyContent:'center' }} onClick={() => navigate('/auth')}>Sign In</button>
                <button className="btn btn-primary" style={{ width:'100%',justifyContent:'center' }} onClick={() => navigate('/auth?mode=register')}>Get Started</button>
              </>
            )}
          </div>
        )}
      </header>

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="hero-section">
        <div className="hero-grid">
          {/* Copy */}
          <div>
            <div className="hero-eyebrow">
              <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/></svg>
              Simple Ticket Management
            </div>
            <h1 className="hero-headline">Track Every Ticket.<br/>Stay In Control.</h1>
            <p className="hero-subtitle">
              Create, track, and resolve your tickets in one simple workspace. Keep every issue organized and move it from open to closed with clarity.
            </p>
            {loggedIn ? (
              <div className="hero-actions" style={{ marginBottom: 20 }}>
                <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>
                  Go to Dashboard
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                </button>
              </div>
            ) : (
              <>
                <div className="hero-actions" style={{ marginBottom: 20 }}>
                  <button className="btn btn-primary" onClick={() => navigate('/auth?mode=register')}>
                    Get Started
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                  </button>
                  <button className="btn btn-secondary" onClick={() => navigate('/auth')}>Sign In</button>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                  <button className="btn btn-secondary btn-xs" style={{ gap: 8 }} onClick={() => showToast('Google OAuth — connect your provider to enable.')}>
                    <svg width="15" height="15" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                    </svg>
                    Continue with Google
                  </button>
                  <span style={{ fontSize: 12, color: 'var(--text-400)' }}>or</span>
                  <span style={{ fontSize: 12, color: 'var(--text-500)' }}>Create an account in seconds.</span>
                </div>
              </>
            )}
          </div>

          {/* 3D Mockup */}
          <div className="hero-perspective">
            <ResponsiveScale defaultWidth={800} defaultHeight={540}>
              <div className="hero-mockup">
                {/* Window chrome */}
                <div className="window-chrome">
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div className="window-dots">
                      <div className="window-dot" style={{ background: '#FF5F56' }}/>
                      <div className="window-dot" style={{ background: '#FFBD2E' }}/>
                      <div className="window-dot" style={{ background: '#27C93F' }}/>
                    </div>
                    <span className="window-url">app.ticketsystem.com/dashboard</span>
                  </div>
                  <span className="window-live-badge">Live Workspace</span>
                </div>
                {/* Mini Dashboard */}
                <div className="mini-dashboard">
                  <div className="mini-sidebar">
                    <div>
                      <div style={{ display:'flex',alignItems:'center',gap:8,padding:'0 6px 14px',borderBottom:'1px solid rgba(255,255,255,.07)',marginBottom:12 }}>
                        <div style={{ width:24,height:24,borderRadius:6,background:'var(--brand-600)',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',flexShrink:0 }}>
                          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"/></svg>
                        </div>
                        <span style={{ fontSize:14,fontWeight:700,color:'#fff' }}>Ticket System</span>
                      </div>
                      <nav>
                        {[
                          { label:'Dashboard', active:true },
                          { label:'My Tickets', active:false },
                          { label:'Settings', active:false },
                        ].map(item => (
                          <div key={item.label} style={{ display:'flex',alignItems:'center',gap:8,padding:'10px 12px',borderRadius:7,background: item.active ? 'var(--brand-600)':'transparent',color: item.active?'#fff':'#64748b',fontSize:13,fontWeight: item.active?600:500,marginBottom:3 }}>
                            {item.label}
                          </div>
                        ))}
                      </nav>
                    </div>
                    <div style={{ display:'flex',alignItems:'center',gap:10,paddingTop:12,borderTop:'1px solid rgba(255,255,255,.07)' }}>
                      <div style={{ width:32,height:32,borderRadius:'50%',background:'linear-gradient(135deg,var(--brand-600),#818cf8)',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:11,fontWeight:700,flexShrink:0 }}>AK</div>
                      <div>
                        <div style={{ fontSize:13,fontWeight:600,color:'#fff' }}>Alex Kumar</div>
                        <div style={{ fontSize:11,color:'#64748b' }}>Admin</div>
                      </div>
                    </div>
                  </div>
                  <div className="mini-content">
                    {miniView === 'dashboard' && (
                      <>
                        <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',paddingBottom:12,borderBottom:'1px solid var(--surface-100)',marginBottom:16 }}>
                          <div>
                            <div style={{ fontSize:16,fontWeight:700,color:'var(--text-900)' }}>Good morning, Alex</div>
                            <div style={{ fontSize:13,color:'var(--text-500)' }}>Track and manage your tickets.</div>
                          </div>
                          <button className="btn btn-primary btn-xs" onClick={() => setMiniView('create')}>+ Create</button>
                        </div>
                        <div className="mini-stat-grid">
                          <div className="mini-stat" style={{ background:'var(--surface-50)' }}><div className="mlabel">Total</div><div className="mval">{miniTickets.length}</div></div>
                          <div className="mini-stat" style={{ background:'var(--open-bg)',borderColor:'var(--open-border)' }}><div className="mlabel" style={{color:'var(--open-text)'}}>Open</div><div className="mval" style={{color:'var(--open-text)'}}>{miniOpen}</div></div>
                          <div className="mini-stat" style={{ background:'var(--prog-bg)',borderColor:'var(--prog-border)' }}><div className="mlabel" style={{color:'var(--prog-text)'}}>Prog</div><div className="mval" style={{color:'var(--prog-text)'}}>{miniProg}</div></div>
                          <div className="mini-stat" style={{ background:'var(--closed-bg)',borderColor:'var(--closed-border)' }}><div className="mlabel" style={{color:'var(--closed-text)'}}>Closed</div><div className="mval" style={{color:'var(--closed-text)'}}>{miniClosed}</div></div>
                        </div>
                        <div style={{ fontSize:14,fontWeight:700,color:'var(--text-900)',marginBottom:12 }}>Recent Tickets</div>
                        <div style={{ display:'flex',flexDirection:'column',gap:8 }}>
                          {miniTickets.map((t, i) => (
                            <div key={i} onClick={() => { setMiniSelected(i); setMiniView('details') }}
                              style={{ display:'flex',alignItems:'center',justifyContent:'space-between',padding:'10px 12px',borderRadius:8,border:'1px solid var(--surface-100)',background:'var(--surface-50)',cursor:'pointer',gap:8 }}
                              onMouseOver={e => { e.currentTarget.style.borderColor='#6366f1'; e.currentTarget.style.background='#fff' }}
                              onMouseOut={e => { e.currentTarget.style.borderColor='var(--surface-100)'; e.currentTarget.style.background='var(--surface-50)' }}
                            >
                              <div style={{ display:'flex',alignItems:'center',gap:8,overflow:'hidden' }}>
                                <span className={getDotClass(t.status)}/>
                                <span style={{ fontSize:13,fontWeight:600,color:'var(--text-700)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis' }}>{t.title}</span>
                              </div>
                              <span className={getBadgeClass(t.status)} style={{ fontSize:10, padding: '4px 8px' }}>{getBadgeLabel(t.status)}</span>
                            </div>
                          ))}
                        </div>
                      </>
                    )}

                    {miniView === 'create' && (
                      <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                         <h3 style={{ fontSize:18,fontWeight:700,color:'var(--text-900)',marginBottom:6 }}>Create Ticket</h3>
                         <p style={{ fontSize:13,color:'var(--text-500)',marginBottom:16 }}>Add a new ticket to your workspace.</p>
                         
                         <label style={{ fontSize:12,fontWeight:600,color:'var(--text-700)',marginBottom:6,display:'block' }}>Title</label>
                         <input className="form-input" style={{ fontSize:13,padding:10,marginBottom:16,height:36 }} value={miniCreateTitle} onChange={e => setMiniCreateTitle(e.target.value)} />
                         
                         <label style={{ fontSize:12,fontWeight:600,color:'var(--text-700)',marginBottom:6,display:'block' }}>Description</label>
                         <textarea className="form-input" style={{ fontSize:13,padding:10,marginBottom:16,flex:1,resize:'none' }} value={miniCreateDesc} onChange={e => setMiniCreateDesc(e.target.value)} />
                         
                         <div style={{ display:'flex',gap:8,justifyContent:'flex-end',marginTop:'auto' }}>
                           <button className="btn btn-secondary btn-xs" onClick={() => setMiniView('dashboard')}>Cancel</button>
                           <button className="btn btn-primary btn-xs" onClick={handleMiniSubmit}>Continue</button>
                         </div>
                      </div>
                    )}

                    {miniView === 'details' && miniSelected !== null && (
                      <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                         <div style={{ display:'flex',alignItems:'center',gap:10,marginBottom:16 }}>
                           <button className="btn btn-secondary btn-xs" style={{ padding:'4px 8px' }} onClick={() => setMiniView('dashboard')}>
                              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
                           </button>
                           <span className={getBadgeClass(miniTickets[miniSelected].status)} style={{ fontSize:10, padding: '4px 8px' }}>{getBadgeLabel(miniTickets[miniSelected].status)}</span>
                         </div>
                         <h3 style={{ fontSize:18,fontWeight:700,color:'var(--text-900)',marginBottom:8 }}>{miniTickets[miniSelected].title}</h3>
                         <p style={{ fontSize:14,color:'var(--text-500)',marginBottom:20,flex:1,lineHeight:1.6 }}>{miniTickets[miniSelected].desc || 'No description provided.'}</p>
                         
                         <div style={{ marginTop:'auto' }}>
                            {miniTickets[miniSelected].status !== 'closed' ? (
                              <button className="btn btn-primary btn-xs" style={{ width:'100%' }} onClick={advanceMiniTicket}>
                                 Mark as {miniTickets[miniSelected].status === 'open' ? 'In Progress' : 'Closed'}
                              </button>
                            ) : (
                              <div style={{ fontSize:10,color:'var(--closed-text)',background:'var(--closed-bg)',padding:'6px 10px',borderRadius:6,textAlign:'center',fontWeight:600 }}>
                                Ticket is Closed
                              </div>
                            )}
                         </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </ResponsiveScale>
          </div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────── */}
      <section id="features" className="features-section">
        <div style={{ maxWidth:1200,margin:'0 auto',padding:'0 24px' }}>
          <h2 style={{ fontSize:'clamp(22px,3vw,30px)',fontWeight:700,color:'var(--text-900)',marginBottom:48,letterSpacing:'-.02em' }}>
            Everything you need to manage your tickets.
          </h2>
          <div className="features-grid">
            {[
              { icon: <svg width="24" height="24" fill="none" stroke="#3b82f6" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>, bg:'#eff6ff', border:'#bfdbfe', title:'Create Tickets', desc:'Create tickets quickly with a title and description and keep your work organized.' },
              { icon: <svg width="24" height="24" fill="none" stroke="#f59e0b" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>, bg:'#fffbeb', border:'#fde68a', title:'Track Progress', desc:"See every ticket's current status and follow its progress from open to in progress." },
              { icon: <svg width="24" height="24" fill="none" stroke="#10b981" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>, bg:'#ecfdf5', border:'#a7f3d0', title:'Close With Confidence', desc:'Move completed tickets to closed and keep a clear record of what has been finished.' },
            ].map(f => (
              <div key={f.title} className="feature-card">
                <div className="feature-icon" style={{ background:f.bg, border:`1px solid ${f.border}` }}>{f.icon}</div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────── */}
      <section id="how-it-works" style={{ padding:'80px 24px',background:'var(--surface-50)' }}>
        <div style={{ maxWidth:1200,margin:'0 auto' }}>
          <div className="hiw-grid">
            <div>
              <h2 style={{ fontSize:'clamp(22px,3vw,28px)',fontWeight:700,color:'var(--text-900)',marginBottom:6,letterSpacing:'-.02em' }}>How it works</h2>
              <p style={{ fontSize:14,color:'var(--text-500)',marginBottom:32 }}>Get started in just a few simple steps.</p>
              <div className="step-grid">
                {[
                  { num:'01', title:'Create', desc:'Create tickets quickly with a title and description.' },
                  { num:'02', title:'Track',  desc:'View your tickets and monitor their current status in realtime.' },
                  { num:'03', title:'Progress', desc:'Move tickets from Open to In Progress with single click actions.' },
                  { num:'04', title:'Close',  desc:'Close completed tickets when the work is done and verified.' },
                ].map(s => (
                  <div key={s.num} className="step-card">
                    <div className="step-num">{s.num}</div>
                    <div className="step-title">{s.title}</div>
                    <div className="step-desc">{s.desc}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="workflow-card">
              <h3 style={{ fontSize:20,fontWeight:700,color:'var(--text-900)',marginBottom:4 }}>From open to done.</h3>
              <p style={{ fontSize:13,color:'var(--text-500)',marginBottom:24 }}>Every ticket follows a simple, clear workflow.</p>
              {[
                { bg:'var(--open-bg)', border:'var(--open-border)', dot:'var(--open-dot)', title:'OPEN', titleColor:'var(--open-text)', desc:'Initial state — waiting to be worked on.', iconBg:'var(--open-dot)' },
                { bg:'var(--prog-bg)', border:'var(--prog-border)', dot:'var(--prog-dot)', title:'IN PROGRESS', titleColor:'var(--prog-text)', desc:'Currently being worked on.', iconBg:'var(--prog-dot)' },
                { bg:'var(--closed-bg)', border:'var(--closed-border)', dot:'var(--closed-dot)', title:'CLOSED', titleColor:'var(--closed-text)', desc:'Ticket is complete and cannot be reopened.', iconBg:'var(--closed-dot)' },
              ].map(w => (
                <div key={w.title} className="workflow-state" style={{ background:w.bg, border:`1px solid ${w.border}`, marginBottom: w.title === 'CLOSED' ? 0 : 12 }}>
                  <div className="state-icon-circle" style={{ background:w.iconBg }}>
                    <span style={{ width:10,height:10,borderRadius:'50%',background:'#fff',display:'block' }}/>
                  </div>
                  <div>
                    <div className="state-title" style={{ color:w.titleColor }}>{w.title}</div>
                    <div className="state-desc">{w.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── INTERACTIVE TABLE ────────────────────────────── */}
      <section id="interactive-table" style={{ padding:'80px 24px',background:'#fff',borderTop:'1px solid var(--surface-200)' }}>
        <div style={{ maxWidth:1200,margin:'0 auto' }}>
          <h2 style={{ fontSize:'clamp(22px,3vw,28px)',fontWeight:700,color:'var(--text-900)',letterSpacing:'-.02em',marginBottom:6 }}>Everything in one clear view.</h2>
          <p style={{ fontSize:14,color:'var(--text-500)',marginBottom:40 }}>A complete overview designed for productivity.</p>
          <div className="interactive-table-wrapper" style={{ display:'grid',gridTemplateColumns:'1fr auto',gap:24,alignItems:'start' }}>
            <ResponsiveScale defaultWidth={820}>
              <div className="card" style={{ padding:24 }}>
                <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',paddingBottom:16,borderBottom:'1px solid var(--surface-100)',marginBottom:16,flexWrap:'wrap',gap:12 }}>
                  <div>
                    <div style={{ fontSize:13,fontWeight:700,textTransform:'uppercase',letterSpacing:'.05em',color:'var(--text-400)' }}>Welcome Back</div>
                    <div style={{ fontSize:22,fontWeight:700,color:'var(--text-900)' }}>Good morning, Alex</div>
                    <div style={{ fontSize:15,color:'var(--text-500)' }}>Track and manage your tickets.</div>
                  </div>
                  <button className="btn btn-primary btn-sm" onClick={() => setCreateModal(true)}>+ Create Ticket</button>
                </div>
                <div className="filter-tabs">
                  {['all','open','in_progress','closed'].map(f => (
                    <button key={f} className={`filter-tab${demoFilter===f?' active':''}`} style={{ fontSize: 14, padding: '10px 18px' }} onClick={() => setDemoFilter(f)}>
                      {f === 'all' ? `All (${demoTickets.length})` : f === 'in_progress' ? `In Progress (${demoTickets.filter(t=>t.status==='in_progress').length})` : `${f.charAt(0).toUpperCase()+f.slice(1)} (${demoTickets.filter(t=>t.status===f).length})`}
                    </button>
                  ))}
                </div>
                <div style={{ overflowX:'hidden' }}>
                  <table className="ticket-table">
                    <thead><tr><th style={{ fontSize: 14 }}>Ticket Title</th><th style={{ fontSize: 14 }}>Status</th><th style={{ fontSize: 14 }}>Created</th></tr></thead>
                    <tbody>
                      {filteredDemo.map(t => (
                        <tr key={t.id} onClick={() => advanceDemoTicket(t.id)} style={{ cursor:'pointer' }}>
                          <td><div className="td-title"><span className={getDotClass(t.status)}/><span style={{ fontSize: 15 }}>{t.title}</span></div></td>
                          <td><span className={getBadgeClass(t.status)} style={{ fontSize: 12, padding: '6px 12px' }}>{getBadgeLabel(t.status)}</span></td>
                          <td style={{ textAlign:'right',color:'var(--text-400)',fontSize:14,fontWeight:400 }}>{t.time}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div style={{ paddingTop:16,borderTop:'1px solid var(--surface-100)',marginTop:16,display:'flex',justifyContent:'space-between',alignItems:'center' }}>
                  <span style={{ fontSize:14,color:'var(--text-400)' }}>Showing active workspace data</span>
                  <button onClick={() => navigate('/auth')} style={{ fontSize:14,color:'var(--brand-600)',fontWeight:600,background:'none',border:'none',cursor:'pointer' }}>View all tickets →</button>
                </div>
              </div>
            </ResponsiveScale>
            {/* CTA */}
            <div className="card" style={{ padding:32,maxWidth:320,minWidth:260,background:'linear-gradient(160deg,#fff 0%,#eef2ff 100%)' }}>
              <div style={{ width:44,height:44,borderRadius:14,background:'rgba(79,70,229,.1)',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:20 }}>
                <svg width="22" height="22" fill="none" stroke="var(--brand-600)" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
              </div>
              <h3 style={{ fontSize:22,fontWeight:700,color:'var(--text-900)',lineHeight:1.25,marginBottom:10 }}>Ready to organize your tickets?</h3>
              <p style={{ fontSize:13,color:'var(--text-500)',lineHeight:1.65,marginBottom:28 }}>Create your account and start managing your team's tickets today.</p>
              <div style={{ display:'flex',flexDirection:'column',gap:10 }}>
                <button className="btn btn-primary" style={{ width:'100%',borderRadius:14 }} onClick={() => navigate('/auth?mode=register')}>
                  Get Started <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                </button>
                <button className="btn btn-secondary" style={{ width:'100%',borderRadius:14 }} onClick={() => navigate('/auth')}>Sign In</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────── */}
      <footer className="landing-footer">
        <div className="footer-inner">
          <div style={{ display:'flex',alignItems:'center',gap:12 }}>
            <div className="brand-icon" style={{ width:26,height:26,borderRadius:7 }}>
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"/></svg>
            </div>
            <span style={{ fontWeight:700,color:'var(--text-900)',fontSize:14 }}>Ticket System</span>
            <span style={{ color:'var(--surface-200)' }}>|</span>
            <span style={{ fontSize:13,color:'var(--text-500)' }}>Simple ticket management, built for clarity.</span>
          </div>
          <div style={{ display:'flex',alignItems:'center',gap:24,fontSize:13,color:'var(--text-500)' }}>
            <a href="#">Privacy</a><a href="#">Terms</a>
            <button onClick={() => navigate('/auth')} style={{ fontSize:13,color:'var(--text-500)',background:'none',border:'none',cursor:'pointer' }}>Sign In</button>
          </div>
        </div>
      </footer>



      {/* ── CREATE DEMO TICKET MODAL ─────────────────────── */}
      <div className={`modal-overlay${createModal ? ' open' : ''}`} onClick={e => e.target === e.currentTarget && setCreateModal(false)}>
        <div className="modal-box" style={{ maxWidth:440 }}>
          <button onClick={() => setCreateModal(false)} style={{ position:'absolute',top:16,right:16,color:'var(--text-400)',background:'none',border:'none',cursor:'pointer' }}>
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
          <h3 style={{ fontSize:20,fontWeight:700,color:'var(--text-900)',marginBottom:4 }}>Create a new ticket</h3>
          <p style={{ fontSize:13,color:'var(--text-500)',marginBottom:24 }}>Add a title and description to get started.</p>
          <form onSubmit={handleCreateDemo}>
            <div className="form-group">
              <label className="form-label">Title</label>
              <input type="text" className="form-input" placeholder="e.g. Fix login validation" value={newTitle} onChange={e => setNewTitle(e.target.value)} required/>
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea className="form-input" placeholder="Describe the issue..." value={newDesc} onChange={e => setNewDesc(e.target.value)} required/>
            </div>
            <div style={{ display:'flex',gap:10,justifyContent:'flex-end' }}>
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => setCreateModal(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary btn-sm">Create Ticket</button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
