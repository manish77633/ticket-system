/* ============================================================
   api.js — Shared API client (fetch wrapper + JWT management)
   ============================================================ */

const BASE = 'https://ticket-system-81cp.onrender.com';
const TOKEN_KEY = 'ticket_system_token'
const USER_KEY = 'ticket_system_user'

// ── Token helpers ──────────────────────────────────────────
export function getToken() { return localStorage.getItem(TOKEN_KEY) }
export function setToken(t) { localStorage.setItem(TOKEN_KEY, t) }
export function removeToken() { localStorage.removeItem(TOKEN_KEY) }

export function getUser() {
  try { return JSON.parse(localStorage.getItem(USER_KEY)) } catch { return null }
}
export function setUser(u) { localStorage.setItem(USER_KEY, JSON.stringify(u)) }
export function removeUser() { localStorage.removeItem(USER_KEY) }

export function isLoggedIn() { return !!getToken() }

export function logout() {
  removeToken()
  removeUser()
  window.location.href = '/auth.html'
}

// ── Core fetch wrapper ─────────────────────────────────────
async function request(method, path, body) {
  const headers = { 'Content-Type': 'application/json' }
  const token = getToken()
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(BASE + path, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  // Unauthorised → redirect to auth
  if (res.status === 401) {
    logout()
    return
  }

  const data = await res.json().catch(() => ({}))

  if (!res.ok) {
    const msg = data.error || data.message || `HTTP ${res.status}`
    throw new Error(msg)
  }

  return data
}

// ── Auth ───────────────────────────────────────────────────
export async function apiRegister(name, email, password) {
  return request('POST', '/auth/register', { name, email, password })
}

export async function apiLogin(email, password) {
  const data = await request('POST', '/auth/login', { email, password })
  setToken(data.token)
  setUser(data.user)
  return data
}

// ── Tickets ────────────────────────────────────────────────
export async function apiListTickets() {
  return request('GET', '/tickets')
}

export async function apiGetTicket(id) {
  return request('GET', `/tickets/${id}`)
}

export async function apiCreateTicket(title, description) {
  return request('POST', '/tickets', { title, description })
}

export async function apiUpdateStatus(id, status) {
  return request('PATCH', `/tickets/${id}/status`, { status })
}
