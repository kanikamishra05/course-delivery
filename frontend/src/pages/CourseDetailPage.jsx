import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getCourse, getCourseProgress, selfEnroll, updateLessonProgress } from '../services/courseApi'
import { getCourseActivity, addCourseComment } from '../services/m06Api'
import { useAuth } from '../context/AuthContext'

export default function CourseDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  const [enrolled, setEnrolled] = useState(false)
  const [progress, setProgress] = useState(null)
  const [enrollError, setEnrollError] = useState('')
  const [enrolling, setEnrolling] = useState(false)
  
  const [activity, setActivity] = useState([])
  const [commentText, setCommentText] = useState('')
  const [canViewActivity, setCanViewActivity] = useState(false)

  useEffect(() => { loadCourseAndProgress() }, [id, isAuthenticated])

  const loadCourseAndProgress = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await getCourse(id)
      const courseData = res.data.data.course
      setCourse(courseData)
      
      let isAuthorized = false;
      if (isAuthenticated && user?.role === 'INSTRUCTOR' && courseData.instructorId === user.id) {
        isAuthorized = true;
      }
      
      if (isAuthenticated && user?.role === 'LEARNER') {
        try {
          const progRes = await getCourseProgress(id)
          setEnrolled(true)
          setProgress(progRes.data.data.progress)
          isAuthorized = true;
        } catch (err) {
          if (err.response?.status === 404) {
            setEnrolled(false)
          }
        }
      }
      
      if (isAuthorized) {
        setCanViewActivity(true)
        try {
          const actRes = await getCourseActivity(id)
          setActivity(actRes.data.data.activity)
        } catch(e) { console.error('Failed to fetch activity') }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Course not found')
    } finally {
      setLoading(false)
    }
  }

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    try {
      await addCourseComment(id, commentText);
      setCommentText('');
      const actRes = await getCourseActivity(id);
      setActivity(actRes.data.data.activity);
    } catch (err) {
      alert('Failed to add comment');
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
      const progRes = await getCourseProgress(id)
      setProgress(progRes.data.data.progress)
    } catch (err) {
      alert('Failed to update progress')
    }
  }

  const formatEventType = (act) => {
    if (act.eventType === 'PROGRESS_UPDATED') {
      return act.metadata?.completed ? 'Lesson Completed' : 'Lesson Marked Incomplete'
    }
    const labels = {
      COURSE_CREATED: 'Course Created',
      COURSE_UPDATED: 'Course Updated',
      COURSE_PUBLISHED: 'Course Published',
      COURSE_ARCHIVED: 'Course Archived',
      COURSE_RESTORED: 'Course Restored',
      LESSON_CREATED: 'Lesson Created',
      LESSON_UPDATED: 'Lesson Updated',
      LESSON_DELETED: 'Lesson Deleted',
      ENROLLMENT_CREATED: 'Enrollment Created',
      COMMENT: 'Comment Added'
    }
    return labels[act.eventType] || act.eventType
  }

  const renderMetadata = (act) => {
    if (act.eventType === 'COMMENT' && act.metadata?.text) {
      return <p className="activity-detail italic">"{act.metadata.text}"</p>
    }
    if (act.eventType === 'PROGRESS_UPDATED') {
      return act.metadata?.title ? <p className="activity-detail">{act.metadata.title}</p> : null
    }
    
    if (act.metadata && Object.keys(act.metadata).length > 0) {
      const parts = []
      if (act.metadata.title) parts.push(act.metadata.title)
      if (act.metadata.learnerEmail) parts.push(`Learner: ${act.metadata.learnerEmail}`)
      if (act.metadata.type) parts.push(`Type: ${act.metadata.type}`)
      if (act.metadata.fields && act.metadata.fields.length > 0) parts.push(`Fields: ${act.metadata.fields.join(', ')}`)
      
      if (parts.length > 0) {
        return <p className="activity-detail">{parts.join(' | ')}</p>
      }
    }
    return null
  }

  if (loading) return <div className="container text-muted">Loading course details...</div>
  if (error) return <div className="container text-danger">{error}</div>
  if (!course) return null

  const lessons = course.lessons || []

  return (
    <div className="container" style={{ maxWidth: 800 }}>
      <div className="mb-6">
        <button onClick={() => navigate(-1)} className="btn btn-secondary btn-sm mb-4">← Back</button>
        <h1 className="mb-2">{course.title}</h1>
        <p className="text-muted" style={{ fontSize: '1.125rem' }}>{course.description}</p>
        <div className="mt-4">
          <span className="badge badge-info">{course.category}</span>
        </div>
      </div>

      {isAuthenticated && user?.role === 'LEARNER' && !enrolled && (
        <div className="card mb-6 flex justify-between items-center bg-blue-50">
          <div>
            <h3 className="mb-1">Ready to start learning?</h3>
            {enrollError && <p className="text-danger mb-0 mt-2">{enrollError}</p>}
          </div>
          <button onClick={handleEnroll} disabled={enrolling} className="btn btn-primary">
            {enrolling ? 'Enrolling...' : 'Enroll Now'}
          </button>
        </div>
      )}

      {enrolled && progress && (
        <div className="card mb-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="mb-0">Your Progress</h3>
            <span className="badge badge-success">{progress.percentage}%</span>
          </div>
          <p className="text-muted mb-4">State: <strong style={{ color: 'var(--primary)' }}>{progress.state}</strong> ({progress.completedLessons} of {progress.totalLessons} lessons)</p>
          <div style={{ width: '100%', background: 'var(--border)', height: 8, borderRadius: 4, overflow: 'hidden' }}>
            <div style={{ width: `${progress.percentage}%`, background: 'var(--success)', height: '100%', transition: 'width 0.3s ease' }} />
          </div>
        </div>
      )}

      <div className="card mb-6">
        <h2 className="mb-4">Lessons ({lessons.length})</h2>
        {lessons.length === 0 ? (
          <p className="text-muted">No lessons available.</p>
        ) : (
          <div className="flex-col gap-4">
            {lessons.map((lesson, idx) => {
              const isCompleted = progress?.completedLessonIds?.includes(lesson._id)
              return (
                <div key={lesson._id} className="flex items-start gap-4" style={{ padding: '1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
                  {enrolled && (
                    <input
                      type="checkbox"
                      checked={isCompleted || false}
                      onChange={() => toggleLesson(lesson._id, isCompleted)}
                      style={{ marginTop: '0.25rem', width: '1.25rem', height: '1.25rem', cursor: 'pointer' }}
                    />
                  )}
                  <div>
                    <strong style={{ textDecoration: isCompleted ? 'line-through' : 'none', color: isCompleted ? 'var(--text-muted)' : 'var(--primary)', fontSize: '1.05rem' }}>
                      {idx + 1}. {lesson.title}
                    </strong>
                    {lesson.content && <p className="text-muted mb-0 mt-1" style={{ fontSize: '0.875rem' }}>{lesson.content}</p>}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    
      {canViewActivity && (
        <div className="card">
          <h2 className="mb-4">Activity History</h2>
          
          <form onSubmit={handleAddComment} className="flex gap-2 mb-6">
            <input 
              className="form-input"
              type="text" 
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
              placeholder="Add a comment to this course..." 
            />
            <button type="submit" className="btn btn-primary shrink-0">Post</button>
          </form>

          {activity.length === 0 ? (
            <p className="text-muted">No activity yet.</p>
          ) : (
            <div className="activity-feed">
              {activity.map(act => (
                <div key={act._id} className="activity-item">
                  <div className="activity-meta">
                    <strong>{act.actorId?.name || 'System'}</strong> — {new Date(act.createdAt).toLocaleString()}
                  </div>
                  <div>
                    <span className="activity-title">{formatEventType(act)}</span>
                    {renderMetadata(act)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
