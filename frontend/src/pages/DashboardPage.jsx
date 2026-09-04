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
        <h2>Inactivity Alerts ({alerts.length})</h2>
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
        <div className="metric-card">
          <div className="metric-value">{headline.publishedCourses}</div>
          <div className="metric-label">Published Courses</div>
        </div>
        <div className="metric-card">
          <div className="metric-value">{headline.totalLearners}</div>
          <div className="metric-label">Total Learners</div>
        </div>
        <div className="metric-card">
          <div className="metric-value">{headline.completionsThisMonth}</div>
          <div className="metric-label">Completions This Month</div>
        </div>
        <div className="metric-card">
          <div className="metric-value">{headline.learnersInProgress}</div>
          <div className="metric-label">Learners In Progress</div>
        </div>
      </div>

      <div className="card">
        <h2 className="mb-4">Completions (Last 8 Weeks)</h2>
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
