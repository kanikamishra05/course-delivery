import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getCourses } from '../services/courseApi'

export default function MyCoursesPage() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchEnrolledCourses()
  }, [])

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
    <div style={{ maxWidth: 900, margin: '40px auto', padding: '0 16px' }}>
      <h1>My Enrolled Courses</h1>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {loading ? (
        <p>Loading your courses...</p>
      ) : courses.length === 0 ? (
        <p>You haven't enrolled in any courses yet. <Link to="/discover">Browse courses</Link></p>
      ) : (
        <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
          {courses.map((course) => (
            <div key={course._id} style={{ border: '1px solid #ddd', borderRadius: 8, padding: 16 }}>
              <h3 style={{ margin: '0 0 8px' }}>
                <Link to={`/courses/${course._id}`}>{course.title}</Link>
              </h3>
              <p style={{ color: '#555', fontSize: 14, margin: '0 0 8px' }}>{course.description}</p>
              <span style={{ fontSize: 13, background: '#e9e9e9', padding: '2px 8px', borderRadius: 4 }}>
                {course.category}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
