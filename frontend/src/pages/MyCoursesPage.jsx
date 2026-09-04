import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getCourses } from '../services/courseApi'

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
          {courses.map((course) => (
            <div key={course._id} className="card flex flex-col justify-between">
              <div>
                <h3 className="card-title"><Link to={`/courses/${course._id}`}>{course.title}</Link></h3>
                <p className="card-meta mb-4 line-clamp-3">{course.description}</p>
              </div>
              <div>
                <span className="badge badge-info">{course.category}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
