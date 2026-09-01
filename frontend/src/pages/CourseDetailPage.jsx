import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getCourse } from '../services/courseApi'

export default function CourseDetailPage() {
  const { id } = useParams()
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getCourse(id)
        setCourse(res.data.data.course)
      } catch (err) {
        setError(err.response?.data?.message || 'Course not found')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  if (loading) return <div style={{ padding: 40 }}>Loading...</div>
  if (error) return <div style={{ padding: 40, color: 'red' }}>{error}</div>
  if (!course) return null

  const lessons = course.lessons || []

  return (
    <div style={{ maxWidth: 800, margin: '40px auto', padding: '0 16px' }}>
      <Link to="/courses">← Back to courses</Link>
      <h1 style={{ marginTop: 16 }}>{course.title}</h1>
      <p style={{ color: '#555' }}>{course.description}</p>
      <p><strong>Category:</strong> {course.category}</p>

      <h2>Lessons ({lessons.length})</h2>
      {lessons.length === 0 ? (
        <p>No lessons available.</p>
      ) : (
        <ol>
          {lessons.map((lesson) => (
            <li key={lesson._id} style={{ marginBottom: 16 }}>
              <strong>{lesson.title}</strong>
              {lesson.content && <p style={{ margin: '4px 0 0', color: '#555' }}>{lesson.content}</p>}
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}
