import { useAuth } from '../context/AuthContext'

export default function HomePage() {
  const { user, logout } = useAuth()

  return (
    <div style={{ maxWidth: 600, margin: '80px auto', padding: '0 16px' }}>
      <h1>Course Delivery</h1>
      <p>Welcome, {user.name}!</p>
      <p>
        <strong>Role:</strong> {user.role}
      </p>
      <p>
        <strong>Email:</strong> {user.email}
      </p>
      <p style={{ marginTop: 24, color: '#666' }}>
        Course management and other features will be available in future milestones.
      </p>
      <button onClick={logout} style={{ padding: '8px 24px', marginTop: 16 }}>
        Logout
      </button>
    </div>
  )
}
