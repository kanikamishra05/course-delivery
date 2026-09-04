import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function HomePage() {
  const { user } = useAuth()
  if (user?.role === 'INSTRUCTOR') return <Navigate to="/dashboard" replace />
  if (user?.role === 'LEARNER') return <Navigate to="/discover" replace />
  return <Navigate to="/login" replace />
}
