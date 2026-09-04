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
      <Link to="/" className="navbar-brand">
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
            <button onClick={handleLogout} className="btn btn-secondary btn-sm" style={{ marginLeft: '1rem' }}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
          </>
        )}
      </div>
    </nav>
  )
}
