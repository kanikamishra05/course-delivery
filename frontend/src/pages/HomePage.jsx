import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function HomePage() {
  const { user, logout } = useAuth()

  return (
    <div style={{ maxWidth: 600, margin: '80px auto', padding: '0 16px' }}>
      <h1>Course Delivery</h1>
      <p>Welcome, {user.name}!</p>
      <p><strong>Role:</strong> {user.role}</p>
      <p><strong>Email:</strong> {user.email}</p>

      {user.role === 'INSTRUCTOR' ? (
        <p>
          <Link to="/courses">
            <button style={{ padding: '8px 20px', marginRight: 12 }}>Manage My Courses</button>
          </Link>
        </p>
      ) : (
        <p>
          <Link to="/discover">
            <button style={{ padding: '8px 20px', marginRight: 12 }}>Browse Courses</button>
          </Link>
          <Link to="/my-courses">
            <button style={{ padding: '8px 20px', marginRight: 12 }}>My Enrolled Courses</button>
          </Link>
        </p>
      )}

      <button onClick={logout} style={{ padding: '8px 24px', marginTop: 16 }}>
        Logout
      </button>
    </div>
  )
}
