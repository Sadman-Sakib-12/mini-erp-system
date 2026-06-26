import { Navigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

export function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: ('Admin' | 'Staff')[] }) {
  const { session, role } = useAuth()
  
  if (!session) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && role && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace /> // Or a 403 Forbidden page
  }

  return <>{children}</>
}
