import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { getToken } from '../api.js'

export default function ProtectedRoute() {
  if (!getToken()) return <Navigate to="/auth" replace />
  return <Outlet />
}
