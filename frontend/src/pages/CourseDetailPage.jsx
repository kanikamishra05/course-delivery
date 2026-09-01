import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getCourse, getCourseProgress, selfEnroll, updateLessonProgress } from '../services/courseApi'
import { useAuth } from '../context/AuthContext'

export default function CourseDetailPage() {
  const { id } = useParams()
  const { user, isAuthenticated } = useAuth()
  
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  // Enrollment and Progress state
  const [enrolled, setEnrolled] = useState(false)
  const [progress, setProgress] = useState(null)
  const [enrollError, setEnrollError] = useState('')
  const [enrolling, setEnrolling] = useState(false)

  useEffect(() => {
    loadCourseAndProgress()
  }, [id, isAuthenticated])

  const loadCourseAndProgress = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await getCourse(id)
      setCourse(res.data.data.course)
      
      // If learner, check progress
      if (isAuthenticated && user?.role === 'LEARNER') {
        try {
          const progRes = await getCourseProgress(id)
          setEnrolled(true)
          setProgress(progRes.data.data.progress)
        } catch (err) {
          if (err.response?.status === 404) {
            setEnrolled(false) // Not enrolled
          }
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Course not found')
    } finally {
      setLoading(false)
    }
  }

  const handleEnroll = async () => {
    setEnrollError('')
    setEnrolling(true)
    try {
      await selfEnroll(id)
      await loadCourseAndProgress()
    } catch (err) {
      setEnrollError(err.response?.data?.message || 'Failed to enroll')
    } finally {
      setEnrolling(false)
    }
  }

  const toggleLesson = async (lessonId, currentStatus) => {
    try {
      await updateLessonProgress(lessonId, !currentStatus)
      // Refresh progress
      const progRes = await getCourseProgress(id)
      setProgress(progRes.data.data.progress)
    } catch (err) {
      alert('Failed to update progress')
    }
  }

  if (loading) return <div style={{ padding: 40 }}>Loading...</div>
  if (error) return <div style={{ padding: 40, color: 'red' }}>{error}</div>
  if (!course) return null

  const lessons = course.lessons || []

  return (
    <div style={{ maxWidth: 800, margin: '40px auto', padding: '0 16px' }}>
      <Link to={user?.role === 'INSTRUCTOR' ? "/courses" : "/discover"}>← Back</Link>
      <h1 style={{ marginTop: 16 }}>{course.title}</h1>
      <p style={{ color: '#555' }}>{course.description}</p>
      <p><strong>Category:</strong> {course.category}</p>

      {/* Learner Enrollment Section */}
      {isAuthenticated && user?.role === 'LEARNER' && !enrolled && (
        <div style={{ padding: 16, background: '#f0f8ff', borderRadius: 8, margin: '24px 0' }}>
          <h3>Ready to learn?</h3>
          {enrollError && <p style={{ color: 'red' }}>{enrollError}</p>}
          <button onClick={handleEnroll} disabled={enrolling} style={{ padding: '8px 24px' }}>
            {enrolling ? 'Enrolling...' : 'Enroll Now'}
          </button>
        </div>
      )}

      {/* Progress Section */}
      {enrolled && progress && (
        <div style={{ padding: 16, background: '#f8f9fa', borderRadius: 8, margin: '24px 0' }}>
          <h3>Your Progress: {progress.percentage}%</h3>
          <p>State: <strong>{progress.state}</strong> ({progress.completedLessons} / {progress.totalLessons} lessons)</p>
          <div style={{ width: '100%', background: '#ddd', height: 12, borderRadius: 6, overflow: 'hidden' }}>
            <div style={{ width: `${progress.percentage}%`, background: '#28a745', height: '100%' }} />
          </div>
        </div>
      )}

      <h2>Lessons ({lessons.length})</h2>
      {lessons.length === 0 ? (
        <p>No lessons available.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {lessons.map((lesson, idx) => {
            const isCompleted = progress?.completedLessonIds?.includes(lesson._id)
            return (
              <div key={lesson._id} style={{ display: 'flex', alignItems: 'flex-start', padding: 12, border: '1px solid #eee', borderRadius: 6 }}>
                {enrolled && (
                  <input
                    type="checkbox"
                    checked={isCompleted || false}
                    onChange={() => toggleLesson(lesson._id, isCompleted)}
                    style={{ marginTop: 4, marginRight: 12, transform: 'scale(1.2)' }}
                  />
                )}
                <div>
                  <strong style={{ textDecoration: isCompleted ? 'line-through' : 'none', color: isCompleted ? '#888' : '#000' }}>
                    {idx + 1}. {lesson.title}
                  </strong>
                  {lesson.content && <p style={{ margin: '4px 0 0', color: '#555', fontSize: 14 }}>{lesson.content}</p>}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
