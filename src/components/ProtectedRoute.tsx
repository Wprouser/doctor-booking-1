import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useSession } from '../lib/auth-client'

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { data: session, isPending } = useSession()
  const location = useLocation()

  if (isPending) {
    return <p className="text-slate-500 dark:text-slate-400">Loading…</p>
  }

  if (!session) {
    return <Navigate to="/sign-in" state={{ from: location.pathname }} replace />
  }

  return children
}
