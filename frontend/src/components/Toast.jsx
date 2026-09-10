import React, { createContext, useContext, useState, useCallback, useRef } from 'react'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toast, setToast] = useState({ visible: false, message: '', type: 'default' })
  const timerRef = useRef(null)

  const showToast = useCallback((message, type = 'default') => {
    clearTimeout(timerRef.current)
    setToast({ visible: true, message, type })
    timerRef.current = setTimeout(() => setToast(t => ({ ...t, visible: false })), 3000)
  }, [])

  const bgColor =
    toast.type === 'error'   ? '#dc2626' :
    toast.type === 'warning' ? '#d97706' : '#0f172a'

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <div
        style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
          background: bgColor, color: '#fff',
          fontSize: 13, fontWeight: 500,
          padding: '12px 18px', borderRadius: 10,
          boxShadow: '0 8px 24px rgba(0,0,0,.25)',
          display: 'flex', alignItems: 'center', gap: 8,
          transform: toast.visible ? 'translateY(0)' : 'translateY(80px)',
          opacity: toast.visible ? 1 : 0,
          pointerEvents: 'none',
          transition: 'transform .3s cubic-bezier(0.16,1,.3,1), opacity .3s',
        }}
      >
        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <span>{toast.message}</span>
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext)
}
