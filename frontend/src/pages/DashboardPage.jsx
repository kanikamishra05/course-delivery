import { useState, useEffect } from 'react'
import api from '../services/api'
import { getActiveAlerts, dismissAlert } from '../services/m06Api'
import { Link } from 'react-router-dom'

export default function DashboardPage() {
  const [metrics, setMetrics] = useState(null)
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/dashboard')
        setMetrics(res.data.data)
        const alertsRes = await getActiveAlerts()
        setAlerts(alertsRes.data.data.alerts)
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard')
      } finally {
        setLoading(false)
      }
    }
    fetchDashboard()
  }, [])

  if (loading) return <div className="container text-muted">Loading dashboard...</div>
  if (error) return <div className="container text-danger">{error}</div>
  if (!metrics) return null

  const { headline, breakdown } = metrics

  const handleDismiss = async (enrollmentId) => {
    try {
      await dismissAlert(enrollmentId);
      setAlerts(alerts.filter(a => a.enrollmentId !== enrollmentId));
    } catch (err) {
      alert('Failed to dismiss alert');
    }
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>Instructor Dashboard</h1>
        <Link to="/courses" className="btn btn-secondary">Manage Courses</Link>
      </div>
      
      <div className="alert-box">
        <h2 style={{ display: 'flex', alignItems: 'center' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
          Inactivity Alerts ({alerts.length})
        </h2>
        {alerts.length > 0 ? (
          alerts.map(alert => (
            <div key={alert._id} className="alert-item">
              <div>
                <strong>{alert.learner?.name || alert.learner?.email || 'Unknown Learner'}</strong> has been inactive in <strong>{alert.course?.title}</strong> for {alert.daysInactive} days.
              </div>
              <button onClick={() => handleDismiss(alert.enrollmentId)} className="btn btn-sm" style={{ backgroundColor: '#F59E0B', color: '#fff', border: 'none' }}>
                Dismiss
              </button>
            </div>
          ))
        ) : (
          <p className="alert-empty">No inactivity alerts.</p>
        )}
      </div>

      <div className="metric-grid">
        <div className="metric-card" style={{ textAlign: 'left' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
            </svg>
            <div className="metric-label" style={{ margin: 0 }}>Published Courses</div>
          </div>
          <div className="metric-value" style={{ margin: 0 }}>{headline.publishedCourses}</div>
        </div>
        <div className="metric-card" style={{ textAlign: 'left' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            <div className="metric-label" style={{ margin: 0 }}>Total Learners</div>
          </div>
          <div className="metric-value" style={{ margin: 0 }}>{headline.totalLearners}</div>
        </div>
        <div className="metric-card" style={{ textAlign: 'left' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
              <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
              <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
              <path d="M4 22h16"></path>
              <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
              <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
              <path d="M18 2H6v7c0 6 6 10 6 10s6-4 6-10V2z"></path>
            </svg>
            <div className="metric-label" style={{ margin: 0 }}>Completions This Month</div>
          </div>
          <div className="metric-value" style={{ margin: 0 }}>{headline.completionsThisMonth}</div>
        </div>
        <div className="metric-card" style={{ textAlign: 'left' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
              <polyline points="17 6 23 6 23 12"></polyline>
            </svg>
            <div className="metric-label" style={{ margin: 0 }}>Learners In Progress</div>
          </div>
          <div className="metric-value" style={{ margin: 0 }}>{headline.learnersInProgress}</div>
        </div>
      </div>

      <div className="card">
        <h2 className="mb-4" style={{ display: 'flex', alignItems: 'center' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
            <polyline points="17 6 23 6 23 12"></polyline>
          </svg>
          Completions (Last 8 Weeks)
        </h2>
        <div style={{ display: 'flex', alignItems: 'flex-end', height: 200, gap: '1rem', padding: '1rem 0' }}>
          {breakdown.completionsOver8Weeks.map((count, i) => {
            const max = Math.max(...breakdown.completionsOver8Weeks, 1);
            const height = (count / max) * 100 + '%';
            return (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center' }}>
                <span className="text-muted mb-1" style={{ fontSize: '0.75rem' }}>{count}</span>
                <div style={{ width: '100%', backgroundColor: 'var(--secondary)', height, minHeight: count > 0 ? 4 : 1, borderRadius: '4px 4px 0 0' }} />
                <span className="text-muted mt-2" style={{ fontSize: '0.625rem', textTransform: 'uppercase' }}>Wk {i+1}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
