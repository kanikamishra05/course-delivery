import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children, roles }) {
  const { user, loading, isAuthenticated } = useAuth()

  if (loading) {
    return <div>Loading...</div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // If specific roles are required, check the user's role
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />
  }

  return children
}
