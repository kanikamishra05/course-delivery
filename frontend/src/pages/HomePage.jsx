import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function HomePage() {
  const { user, isAuthenticated, loading } = useAuth()
  
  if (loading) return <div>Loading...</div>

  // Authenticated redirect logic
  if (isAuthenticated) {
    if (user?.role === 'INSTRUCTOR') return <Navigate to="/dashboard" replace />
    if (user?.role === 'LEARNER') return <Navigate to="/discover" replace />
    return <Navigate to="/login" replace />
  }

  // Public Landing Page
  return (
    <div className="landing-page" style={{ minHeight: 'calc(100vh - 60px)', display: 'flex', flexDirection: 'column' }}>
      
      {/* Hero Section */}
      <div className="container" style={{ padding: '4rem 1rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '3rem', flex: 1 }}>
        <div style={{ flex: '1 1 400px' }}>
          <h1 style={{ fontSize: '3rem', lineHeight: 1.2, marginBottom: '1.5rem', color: 'var(--text)' }}>
            Learn. Progress. Achieve.
          </h1>
          <p className="text-muted" style={{ fontSize: '1.25rem', marginBottom: '2.5rem', lineHeight: 1.6 }}>
            CourseDelivery is a modern learning platform where learners can discover courses, complete lessons, and track their progress, while instructors can easily create courses, manage learners, and monitor activity.
          </p>
          <Link to="/login" className="btn btn-primary" style={{ fontSize: '1.125rem', padding: '0.75rem 2.5rem' }}>
            Get Started
          </Link>
        </div>
        
        <div style={{ flex: '1 1 400px', display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: '100%', maxWidth: '450px', aspectRatio: '4/3', backgroundColor: '#eff6ff', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #bfdbfe', position: 'relative', overflow: 'hidden' }}>
            <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.15, position: 'absolute', top: '-20px', right: '-20px' }}>
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
            </svg>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', padding: '2rem', zIndex: 1 }}>
              <div className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', boxShadow: 'var(--shadow-md)', backgroundColor: '#fff' }}>
                <svg width="32" height="32" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Progress</span>
              </div>
              <div className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', boxShadow: 'var(--shadow-md)', transform: 'translateY(1.5rem)', backgroundColor: '#fff' }}>
                <svg width="32" height="32" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
                <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Lessons</span>
              </div>
              <div className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', boxShadow: 'var(--shadow-md)', transform: 'translateY(-1.5rem)', backgroundColor: '#fff' }}>
                <svg width="32" height="32" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Activity</span>
              </div>
              <div className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', boxShadow: 'var(--shadow-md)', backgroundColor: '#fff' }}>
                <svg width="32" height="32" fill="none" stroke="#ea580c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Instruct</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div style={{ backgroundColor: '#f8fafc', padding: '5rem 1rem', marginTop: 'auto', borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <h2 className="text-center" style={{ fontSize: '2rem', marginBottom: '4rem' }}>Everything you need to learn</h2>
          
          <div className="metric-grid">
            <div className="card" style={{ textAlign: 'center', padding: '2.5rem 1.5rem' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', borderRadius: '16px', backgroundColor: '#eff6ff', color: '#2563eb', marginBottom: '1.5rem' }}>
                <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              </div>
              <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Discover Courses</h3>
              <p className="text-muted" style={{ fontSize: '1rem', lineHeight: 1.6 }}>Search, filter, sort, and explore available courses tailored to your learning goals.</p>
            </div>

            <div className="card" style={{ textAlign: 'center', padding: '2.5rem 1.5rem' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', borderRadius: '16px', backgroundColor: '#f0fdf4', color: '#16a34a', marginBottom: '1.5rem' }}>
                <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
              </div>
              <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Track Progress</h3>
              <p className="text-muted" style={{ fontSize: '1rem', lineHeight: 1.6 }}>Complete lessons step-by-step and automatically monitor your overall learning progress.</p>
            </div>

            <div className="card" style={{ textAlign: 'center', padding: '2.5rem 1.5rem' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', borderRadius: '16px', backgroundColor: '#fdf4ff', color: '#c026d3', marginBottom: '1.5rem' }}>
                <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
              </div>
              <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Manage Courses</h3>
              <p className="text-muted" style={{ fontSize: '1rem', lineHeight: 1.6 }}>Instructors can easily create courses, manage lessons, and rapidly enroll learners.</p>
            </div>

            <div className="card" style={{ textAlign: 'center', padding: '2.5rem 1.5rem' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', borderRadius: '16px', backgroundColor: '#fff7ed', color: '#ea580c', marginBottom: '1.5rem' }}>
                <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
              </div>
              <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Activity & Alerts</h3>
              <p className="text-muted" style={{ fontSize: '1rem', lineHeight: 1.6 }}>Track detailed course activity and automatically identify learner inactivity.</p>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  )
}
