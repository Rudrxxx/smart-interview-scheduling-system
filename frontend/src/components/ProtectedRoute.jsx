import { Navigate } from 'react-router-dom'
import { useDBUser } from './ClerkAxiosProvider'

export default function ProtectedRoute({ children, roles }) {
  const { user, loading } = useDBUser()
  
  if (loading) return <div className="flex items-center justify-center h-screen bg-slate-950 text-slate-400">Loading Configuration...</div>
  if (!user) return <Navigate to="/login" />
  
  if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" />
  return children
}
