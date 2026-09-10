import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { apiLogin, apiRegister, isLoggedIn } from '../api.js'
import { useToast } from '../components/Toast.jsx'

export default function Auth() {
  const navigate = useNavigate()
  const showToast = useToast()
  const [params] = useSearchParams()

  const [mode, setMode]         = useState(params.get('mode') === 'register' ? 'register' : 'login')
  const [name, setName]         = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm]   = useState('')
  const [showPw, setShowPw]     = useState(false)
  const [showCf, setShowCf]     = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')

  // Redirect if already logged in
  useEffect(() => {
    if (isLoggedIn()) navigate('/dashboard', { replace: true })
  }, [navigate])

  const isLogin = mode === 'login'

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!isLogin) {
      if (!name.trim()) return setError('Please enter your full name.')
      if (password !== confirm) return setError('Passwords do not match.')
      if (password.length < 6)  return setError('Password must be at least 6 characters.')
    }

    setLoading(true)
    try {
      if (!isLogin) {
        await apiRegister(name.trim(), email.trim(), password)
        await apiLogin(email.trim(), password)
      } else {
        await apiLogin(email.trim(), password)
      }
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(isLogin ? 'Invalid email or password. Please try again.' : (err.message || 'Registration failed.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-body">
      {/* Nav */}
      <header className="auth-nav">
        <div className="nav-inner">
          <Link to="/" className="brand-logo">
            <div className="brand-icon">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2 9a3 3 0 010 6v2a2 2 0 002 2h16a2 2 0 002-2v-2a3 3 0 010-6V7a2 2 0 00-2-2H4a2 2 0 00-2 2z"/>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 5v2M13 17v2M13 11v2"/>
              </svg>
            </div>
            <span className="brand-name">Ticket System</span>
          </Link>
          <div className="auth-tab-group">
            <button className={`auth-tab${isLogin ? ' active' : ''}`} onClick={() => setMode('login')}>Sign In</button>
            <button className={`auth-tab${!isLogin ? ' active' : ''}`} onClick={() => setMode('register')}>Register</button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="auth-main">
        <div className="auth-card">
          {/* Form Panel */}
          <section className="auth-form-panel">
            <div style={{ marginBottom: 32 }}>
              <h1 style={{ fontSize: 'clamp(24px,3vw,30px)', fontWeight: 700, color: 'var(--text-900)', letterSpacing: '-.02em' }}>
                {isLogin ? 'Welcome back' : 'Create your account'}
              </h1>
              <p style={{ fontSize: 14, color: 'var(--text-500)', marginTop: 6 }}>
                {isLogin ? 'Sign in to manage your tickets.' : 'Start managing your tickets in one place.'}
              </p>
            </div>

            {/* Google */}
            <button className="btn btn-secondary" style={{ width: '100%', gap: 10, marginBottom: 0 }}
              onClick={() => showToast('Google OAuth — connect your provider to enable.')}>
              <svg width="17" height="17" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>

            <div className="divider">or continue with email</div>

            <form onSubmit={handleSubmit}>
              {!isLogin && (
                <div className="form-group">
                  <label className="form-label" htmlFor="inp-name">Full Name</label>
                  <input id="inp-name" type="text" className="form-input" placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} required={!isLogin} autoFocus={!isLogin}/>
                </div>
              )}
              <div className="form-group">
                <label className="form-label" htmlFor="inp-email">Email</label>
                <input id="inp-email" type="email" className="form-input" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required autoFocus={isLogin}/>
              </div>
              <div className="form-group">
                <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:6 }}>
                  <label className="form-label" htmlFor="inp-password" style={{ marginBottom: 0 }}>Password</label>
                  {isLogin && <a href="#" style={{ fontSize:12,fontWeight:600,color:'var(--brand-600)' }}>Forgot?</a>}
                </div>
                <div className="input-wrap">
                  <input id="inp-password" type={showPw ? 'text' : 'password'} className="form-input" placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} required/>
                  <button type="button" className="pw-toggle" onClick={() => setShowPw(v => !v)} aria-label="Toggle password">
                    <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      {showPw
                        ? <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"/>
                        : <><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></>
                      }
                    </svg>
                  </button>
                </div>
              </div>
              {!isLogin && (
                <div className="form-group">
                  <label className="form-label" htmlFor="inp-confirm">Confirm Password</label>
                  <div className="input-wrap">
                    <input id="inp-confirm" type={showCf ? 'text' : 'password'} className="form-input" placeholder="Confirm your password" value={confirm} onChange={e => setConfirm(e.target.value)} required={!isLogin}/>
                    <button type="button" className="pw-toggle" onClick={() => setShowCf(v => !v)} aria-label="Toggle confirm password">
                      <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        {showCf
                          ? <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"/>
                          : <><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></>
                        }
                      </svg>
                    </button>
                  </div>
                </div>
              )}

              {error && (
                <div style={{ marginBottom:14,padding:'10px 14px',background:'#fef2f2',border:'1px solid #fecaca',borderRadius:10,fontSize:13,color:'#dc2626' }}>
                  {error}
                </div>
              )}

              <div style={{ marginTop: 6 }}>
                <button type="submit" className="btn btn-primary" style={{ width:'100%',borderRadius:12,padding:13 }} disabled={loading}>
                  {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
                </button>
              </div>
            </form>

            <div style={{ marginTop:24,textAlign:'center',fontSize:13,color:'var(--text-500)' }}>
              <span>{isLogin ? "Don't have an account?" : 'Already have an account?'}</span>
              <button onClick={() => { setMode(isLogin ? 'register' : 'login'); setError('') }}
                style={{ color:'var(--brand-600)',fontWeight:600,background:'none',border:'none',cursor:'pointer',marginLeft:4 }}>
                {isLogin ? 'Create an account' : 'Sign in'}
              </button>
            </div>
          </section>

          {/* Brand Panel */}
          <section className="auth-brand-panel">
            <div className="auth-brand-grid"/>
            <div className="shield-wrap" style={{ position:'relative',zIndex:1 }}>
              <div className="shield-glow"/>
              <div className="shield-outer" style={{ position:'relative',zIndex:1 }}>
                <div className="shield-inner">
                  <div className="shield-core">
                    <svg width="28" height="28" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M11.484 2.17a.75.75 0 011.032 0 11.209 11.209 0 007.877 3.08.75.75 0 01.722.515 12.74 12.74 0 01.635 3.985c0 5.942-4.064 10.933-9.563 12.348a.75.75 0 01-.374 0C6.064 20.933 2 15.942 2 10c0-1.39.223-2.73.635-3.985a.75.75 0 01.722-.516l.143.001c2.996 0 5.717-1.17 7.734-3.08l.25-.25zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.875.875 0 100-1.75.875.875 0 000 1.75z" clipRule="evenodd"/>
                    </svg>
                  </div>
                </div>
                <div className="shield-dot-tl"/>
                <div className="shield-dot-br"/>
              </div>
            </div>
            <div style={{ position:'relative',zIndex:1 }}>
              <p className="auth-tagline">Organize &bull; Track &bull; Resolve</p>
              <p className="auth-tagline-sub">Your tickets, your control.</p>
            </div>
          </section>
        </div>
      </main>

      <footer style={{ padding:20,textAlign:'center',fontSize:12,color:'var(--text-400)' }}>
        <div style={{ display:'flex',alignItems:'center',justifyContent:'center',gap:24 }}>
          <a href="#">Privacy</a><a href="#">Terms</a><a href="#">Support</a>
        </div>
      </footer>
    </div>
  )
}
