import { useState, useEffect } from 'react'
import api from '../services/api'
import { Link } from 'react-router-dom'

export default function DashboardPage() {
  const [metrics, setMetrics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/dashboard')
        setMetrics(res.data.data)
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard')
      } finally {
        setLoading(false)
      }
    }
    fetchDashboard()
  }, [])

  if (loading) return <div style={{ padding: 24 }}>Loading dashboard...</div>
  if (error) return <div style={{ padding: 24, color: 'red' }}>{error}</div>
  if (!metrics) return null

  const { headline, breakdown } = metrics

  return (
    <div style={{ maxWidth: 900, margin: '40px auto', padding: '0 16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Instructor Dashboard</h1>
        <Link to="/instructor/courses" style={{ padding: '8px 16px', background: '#e9e9e9', textDecoration: 'none', color: '#333', borderRadius: 4 }}>
          Manage Courses
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginTop: 24 }}>
        <div style={{ padding: 24, border: '1px solid #ddd', borderRadius: 8, textAlign: 'center' }}>
          <h2 style={{ margin: 0, fontSize: 36, color: '#0066cc' }}>{headline.publishedCourses}</h2>
          <p style={{ margin: '8px 0 0', color: '#666' }}>Published Courses</p>
        </div>
        <div style={{ padding: 24, border: '1px solid #ddd', borderRadius: 8, textAlign: 'center' }}>
          <h2 style={{ margin: 0, fontSize: 36, color: '#0066cc' }}>{headline.totalLearners}</h2>
          <p style={{ margin: '8px 0 0', color: '#666' }}>Total Learners</p>
        </div>
        <div style={{ padding: 24, border: '1px solid #ddd', borderRadius: 8, textAlign: 'center' }}>
          <h2 style={{ margin: 0, fontSize: 36, color: '#0066cc' }}>{headline.completionsThisMonth}</h2>
          <p style={{ margin: '8px 0 0', color: '#666' }}>Completions This Month</p>
        </div>
        <div style={{ padding: 24, border: '1px solid #ddd', borderRadius: 8, textAlign: 'center' }}>
          <h2 style={{ margin: 0, fontSize: 36, color: '#0066cc' }}>{headline.learnersInProgress}</h2>
          <p style={{ margin: '8px 0 0', color: '#666' }}>Learners In Progress</p>
        </div>
      </div>

      <h2 style={{ marginTop: 40 }}>Completions (Last 8 Weeks)</h2>
      <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: 24, display: 'flex', alignItems: 'flex-end', height: 200, gap: 16 }}>
        {breakdown.completionsOver8Weeks.map((count, i) => {
          const max = Math.max(...breakdown.completionsOver8Weeks, 1);
          const height = (count / max) * 100 + '%';
          return (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center' }}>
              <span style={{ fontSize: 12, marginBottom: 4, color: '#666' }}>{count}</span>
              <div style={{ width: '100%', backgroundColor: '#0066cc', height, minHeight: count > 0 ? 4 : 1, borderRadius: '4px 4px 0 0' }} />
              <span style={{ fontSize: 10, marginTop: 4, color: '#999' }}>Wk {i+1}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
