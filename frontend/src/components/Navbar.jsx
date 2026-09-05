import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand" style={{ display: 'flex', alignItems: 'center' }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
          <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
          <path d="M6 12v5c3 3 9 3 12 0v-5"/>
        </svg>
        CourseDelivery
      </Link>
      
      <div className="navbar-links">
        {isAuthenticated ? (
          <>
            <span className="nav-role">{user.role}</span>
            {user.role === 'INSTRUCTOR' ? (
              <>
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/courses">My Courses</Link>
              </>
            ) : (
              <>
                <Link to="/discover">Discover</Link>
                <Link to="/my-courses">My Learning</Link>
              </>
            )}
            <button onClick={handleLogout} className="btn btn-secondary" style={{ marginLeft: '1rem', fontSize: '1rem', padding: '0.5rem 1rem' }}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-secondary" style={{ backgroundColor: 'transparent', border: 'none', fontWeight: 600, color: 'var(--text)', fontSize: '1rem', padding: '0.5rem 1rem' }}>Login / Register</Link>
          </>
        )}
      </div>
    </nav>
  )
}
