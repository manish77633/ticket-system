/* ============================================================
   utils.js — Shared helpers
   ============================================================ */

// ── Toast Notification ─────────────────────────────────────
let toastTimer = null

export function showToast(message, type = 'default') {
  let toast = document.getElementById('toast')
  if (!toast) {
    toast = document.createElement('div')
    toast.id = 'toast'
    toast.className = 'toast'
    toast.innerHTML = `
      <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
      <span id="toast-text"></span>
    `
    document.body.appendChild(toast)
  }

  document.getElementById('toast-text').textContent = message

  if (type === 'error') toast.style.background = '#dc2626'
  else if (type === 'warning') toast.style.background = '#d97706'
  else toast.style.background = '#0f172a'

  toast.classList.add('show')
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3000)
}

// ── Date Formatting ────────────────────────────────────────
export function formatDate(dateStr) {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function timeAgo(dateStr) {
  if (!dateStr) return '—'
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1)   return 'Just now'
  if (mins < 60)  return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24)   return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 30)  return `${days}d ago`
  return formatDate(dateStr)
}

// ── Status helpers ─────────────────────────────────────────
export function getBadgeHTML(status) {
  const map = {
    open:        { cls: 'badge badge-open',     label: 'OPEN' },
    in_progress: { cls: 'badge badge-progress', label: 'IN PROGRESS' },
    closed:      { cls: 'badge badge-closed',   label: 'CLOSED' },
  }
  const b = map[status] || map.open
  return `<span class="${b.cls}">${b.label}</span>`
}

export function getDotClass(status) {
  const map = { open: 'dot dot-open', in_progress: 'dot dot-progress', closed: 'dot dot-closed' }
  return map[status] || 'dot dot-open'
}

export function getNextStatus(status) {
  if (status === 'open')        return 'in_progress'
  if (status === 'in_progress') return 'closed'
  return null
}

export function getNextStatusLabel(status) {
  if (status === 'open')        return 'Move to In Progress'
  if (status === 'in_progress') return 'Close Ticket'
  return null
}

// ── User initials ──────────────────────────────────────────
export function getInitials(name) {
  if (!name) return 'U'
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
}

// ── Guard: redirect if not logged in ──────────────────────
export function requireAuth() {
  const token = localStorage.getItem('ticket_system_token')
  if (!token) {
    window.location.href = '/auth.html'
    return false
  }
  return true
}

// ── Guard: redirect if already logged in ──────────────────
export function redirectIfLoggedIn(dest = '/dashboard.html') {
  const token = localStorage.getItem('ticket_system_token')
  if (token) {
    window.location.href = dest
  }
}

// ── Sidebar toggle (mobile) ────────────────────────────────
export function initSidebarToggle() {
  const sidebar  = document.getElementById('sidebar')
  const backdrop = document.getElementById('sidebar-backdrop')
  const btn      = document.getElementById('mobile-menu-btn')

  function open()  { sidebar?.classList.add('open');  backdrop?.classList.add('open') }
  function close() { sidebar?.classList.remove('open'); backdrop?.classList.remove('open') }

  btn?.addEventListener('click', open)
  backdrop?.addEventListener('click', close)
}

// ── Render sidebar user info ───────────────────────────────
export function renderSidebarUser() {
  const user = JSON.parse(localStorage.getItem('ticket_system_user') || 'null')
  if (!user) return

  const nameEl   = document.getElementById('sidebar-user-name')
  const roleEl   = document.getElementById('sidebar-user-role')
  const avatarEl = document.getElementById('sidebar-avatar')

  if (nameEl)   nameEl.textContent   = user.name || user.email
  if (roleEl)   roleEl.textContent   = 'Workspace Member'
  if (avatarEl) avatarEl.textContent = getInitials(user.name || user.email)
}
