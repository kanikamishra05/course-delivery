import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getCourses } from '../services/courseApi'
import { getCategoryStyle } from '../utils/courseIcons'

export default function MyCoursesPage() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => { fetchEnrolledCourses() }, [])

  const fetchEnrolledCourses = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await getCourses({ enrolled: true, limit: 50 })
      setCourses(res.data.data.courses)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load your courses')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>My Learning</h1>
      </div>
      
      {error && <div className="alert-box alert-empty mb-4">{error}</div>}

      {loading ? (
        <p className="text-muted">Loading your courses...</p>
      ) : courses.length === 0 ? (
        <div className="card text-center" style={{ padding: '3rem 1rem' }}>
          <h3 className="mb-2">No courses yet</h3>
          <p className="text-muted mb-4">You haven't enrolled in any courses yet.</p>
          <Link to="/discover" className="btn btn-primary">Browse Courses</Link>
        </div>
      ) : (
        <div className="metric-grid">
          {courses.map((course) => {
            const styleConfig = getCategoryStyle(course.category || course.title)
            return (
              <div key={course._id} className="card flex flex-col justify-between" style={{ position: 'relative', overflow: 'hidden' }}>
                <div style={{ color: styleConfig.color, position: 'absolute', top: 0, right: 0, pointerEvents: 'none' }}>
                  {styleConfig.bgSvg}
                </div>

                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', borderRadius: '12px', backgroundColor: styleConfig.bg, color: styleConfig.color }}>
                      {styleConfig.icon}
                    </div>
                  </div>
                  <h3 className="card-title"><Link to={`/courses/${course._id}`}>{course.title}</Link></h3>
                  <p className="card-meta mb-4 line-clamp-3">{course.description}</p>
                </div>
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <span className="badge" style={{ backgroundColor: styleConfig.bg, color: styleConfig.color, border: `1px solid ${styleConfig.border}` }}>{course.category}</span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
