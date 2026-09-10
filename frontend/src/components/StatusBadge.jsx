import React from 'react'

const CONFIG = {
  open:        { cls: 'badge badge-open',     label: 'OPEN' },
  in_progress: { cls: 'badge badge-progress', label: 'IN PROGRESS' },
  closed:      { cls: 'badge badge-closed',   label: 'CLOSED' },
}

export default function StatusBadge({ status }) {
  const c = CONFIG[status] || CONFIG.open
  return <span className={c.cls}>{c.label}</span>
}

export function StatusDot({ status }) {
  const cls = status === 'open' ? 'dot dot-open' : status === 'in_progress' ? 'dot dot-progress' : 'dot dot-closed'
  return <span className={cls} />
}
